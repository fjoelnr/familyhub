import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import cors from "cors";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile, writeFile, readdir, stat, mkdir } from "fs/promises";
import { join, resolve } from "path";
import { z } from "zod";

const execAsync = promisify(exec);

// ─── Configuration ─────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "8080", 10);
const ANTIGRAVITY_HOST = process.env.ANTIGRAVITY_HOST || "192.168.178.40";
const ANTIGRAVITY_PORT = parseInt(process.env.ANTIGRAVITY_PORT || "3000", 10);
const COMMAND_TIMEOUT = parseInt(process.env.COMMAND_TIMEOUT || "30000", 10);
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "10485760", 10); // 10MB
const TASKS_DIR = process.env.TASKS_DIR || "/app/data/tasks";
const MAX_CONCURRENT_TASKS = parseInt(process.env.MAX_CONCURRENT_TASKS || "1", 10);

// ─── Task Queue ─────────────────────────────────────────────────────────────────
const taskQueue = new Map(); // taskId → task object
let runningTasks = 0;

async function ensureTasksDir() {
    await mkdir(TASKS_DIR, { recursive: true });
}

async function saveTask(task) {
    await ensureTasksDir();
    await writeFile(join(TASKS_DIR, `${task.id}.json`), JSON.stringify(task, null, 2), "utf-8");
}

async function loadTasksFromDisk() {
    try {
        await ensureTasksDir();
        const files = await readdir(TASKS_DIR);
        for (const file of files) {
            if (!file.endsWith(".json")) continue;
            try {
                const content = await readFile(join(TASKS_DIR, file), "utf-8");
                const task = JSON.parse(content);
                taskQueue.set(task.id, task);
                // Re-queue tasks that were running when server stopped
                if (task.status === "running") {
                    task.status = "pending";
                    task.error = "Server restarted, re-queued";
                    await saveTask(task);
                }
            } catch { /* skip corrupt files */ }
        }
        log("info", `Loaded ${taskQueue.size} tasks from disk`);
    } catch { /* no tasks dir yet */ }
}

async function processQueue() {
    if (runningTasks >= MAX_CONCURRENT_TASKS) return;

    // Find next pending task (FIFO by created time)
    let nextTask = null;
    for (const task of taskQueue.values()) {
        if (task.status === "pending") {
            if (!nextTask || task.created < nextTask.created) {
                nextTask = task;
            }
        }
    }
    if (!nextTask) return;

    runningTasks++;
    nextTask.status = "running";
    nextTask.startedAt = new Date().toISOString();
    await saveTask(nextTask);
    log("info", "Task started", { taskId: nextTask.id, command: nextTask.command });

    try {
        const { stdout, stderr } = await execAsync(nextTask.command, {
            cwd: nextTask.cwd || "/app",
            timeout: nextTask.timeout || COMMAND_TIMEOUT,
            maxBuffer: 1024 * 1024 * 5,
            shell: "/bin/bash",
        });
        nextTask.status = "done";
        nextTask.result = { exitCode: 0, stdout: stdout.trim(), stderr: stderr.trim() };
        nextTask.completedAt = new Date().toISOString();
        log("info", "Task completed", { taskId: nextTask.id });
    } catch (error) {
        nextTask.status = "error";
        nextTask.result = {
            exitCode: error.code || 1,
            stdout: (error.stdout || "").trim(),
            stderr: (error.stderr || error.message).trim(),
        };
        nextTask.completedAt = new Date().toISOString();
        nextTask.error = error.message;
        log("error", "Task failed", { taskId: nextTask.id, error: error.message });
    } finally {
        runningTasks--;
        await saveTask(nextTask);
        // Process next task in queue
        setImmediate(processQueue);
    }
}

// ─── Logging ────────────────────────────────────────────────────────────────────
function log(level, message, data = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...data,
    };
    console.log(JSON.stringify(entry));
}

// ─── MCP Server Setup ──────────────────────────────────────────────────────────
function createMcpServer() {
    const server = new McpServer({
        name: "mcp-bridge",
        version: "1.0.0",
    });

    // ── Tool: execute_command ───────────────────────────────────────────────────
    server.tool(
        "execute_command",
        "Execute a terminal/shell command on the bridge host. Returns stdout, stderr, and exit code.",
        {
            command: z.string().describe("The shell command to execute"),
            cwd: z.string().optional().describe("Working directory (defaults to /app)"),
            timeout: z.number().optional().describe(`Timeout in milliseconds (defaults to ${COMMAND_TIMEOUT})`),
        },
        async ({ command, cwd, timeout }) => {
            log("info", "Executing command", { command, cwd });
            try {
                const { stdout, stderr } = await execAsync(command, {
                    cwd: cwd || "/app",
                    timeout: timeout || COMMAND_TIMEOUT,
                    maxBuffer: 1024 * 1024 * 5, // 5MB
                    shell: "/bin/bash",
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(
                                { exitCode: 0, stdout: stdout.trim(), stderr: stderr.trim() },
                                null,
                                2
                            ),
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(
                                {
                                    exitCode: error.code || 1,
                                    stdout: (error.stdout || "").trim(),
                                    stderr: (error.stderr || error.message).trim(),
                                },
                                null,
                                2
                            ),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    // ── Tool: read_file ─────────────────────────────────────────────────────────
    server.tool(
        "read_file",
        "Read the contents of a file from the filesystem.",
        {
            path: z.string().describe("Absolute or relative path to the file"),
            encoding: z.string().optional().describe("File encoding (defaults to utf-8)"),
        },
        async ({ path, encoding }) => {
            log("info", "Reading file", { path });
            try {
                const resolvedPath = resolve(path);
                const fileStat = await stat(resolvedPath);
                if (fileStat.size > MAX_FILE_SIZE) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: File too large (${fileStat.size} bytes, max ${MAX_FILE_SIZE})`,
                            },
                        ],
                        isError: true,
                    };
                }
                const content = await readFile(resolvedPath, encoding || "utf-8");
                return {
                    content: [{ type: "text", text: content }],
                };
            } catch (error) {
                return {
                    content: [
                        { type: "text", text: `Error reading file: ${error.message}` },
                    ],
                    isError: true,
                };
            }
        }
    );

    // ── Tool: write_file ────────────────────────────────────────────────────────
    server.tool(
        "write_file",
        "Write content to a file. Creates parent directories if needed.",
        {
            path: z.string().describe("Absolute or relative path to the file"),
            content: z.string().describe("Content to write to the file"),
            append: z.boolean().optional().describe("If true, append instead of overwriting (defaults to false)"),
        },
        async ({ path: filePath, content, append }) => {
            log("info", "Writing file", { path: filePath, append: !!append });
            try {
                const resolvedPath = resolve(filePath);
                const dir = resolvedPath.substring(0, resolvedPath.lastIndexOf("/"));
                await mkdir(dir, { recursive: true });

                if (append) {
                    const { appendFile } = await import("fs/promises");
                    await appendFile(resolvedPath, content, "utf-8");
                } else {
                    await writeFile(resolvedPath, content, "utf-8");
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: `Successfully ${append ? "appended to" : "wrote"} file: ${resolvedPath}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        { type: "text", text: `Error writing file: ${error.message}` },
                    ],
                    isError: true,
                };
            }
        }
    );

    // ── Tool: list_directory ────────────────────────────────────────────────────
    server.tool(
        "list_directory",
        "List contents of a directory with file types and sizes.",
        {
            path: z.string().optional().describe("Absolute or relative path to the directory (defaults to /app)"),
            recursive: z.boolean().optional().describe("If true, list recursively (max depth 3, defaults to false)"),
        },
        async ({ path: dirPath, recursive }) => {
            log("info", "Listing directory", { path: dirPath });
            try {
                const resolvedPath = resolve(dirPath || "/app");
                const entries = await listDir(resolvedPath, recursive ? 3 : 1, 0);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(entries, null, 2),
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error listing directory: ${error.message}`,
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    // ── Tool: antigravity_request ───────────────────────────────────────────────
    server.tool(
        "antigravity_request",
        `Send an HTTP request to the Antigravity agent at ${ANTIGRAVITY_HOST}:${ANTIGRAVITY_PORT}. Use this to control or communicate with Antigravity.`,
        {
            method: z.enum(["GET", "POST", "PUT", "DELETE"]).describe("HTTP method"),
            path: z.string().describe("Request path (e.g. /api/status)"),
            body: z.string().optional().describe("Request body as JSON string (for POST/PUT requests)"),
            headers: z.string().optional().describe('Additional headers as JSON string (e.g. \'{"Authorization":"Bearer xxx"}\')'),
        },
        async ({ method, path: reqPath, body, headers: headersStr }) => {
            log("info", "Antigravity request", { method, path: reqPath });
            try {
                const url = `http://${ANTIGRAVITY_HOST}:${ANTIGRAVITY_PORT}${reqPath}`;
                const headers = {
                    "Content-Type": "application/json",
                    ...(headersStr ? JSON.parse(headersStr) : {}),
                };

                const response = await fetch(url, {
                    method: method || "GET",
                    headers,
                    body:
                        body && ["POST", "PUT", "PATCH"].includes(method?.toUpperCase())
                            ? body
                            : undefined,
                });

                const responseText = await response.text();
                let responseData;
                try {
                    responseData = JSON.parse(responseText);
                } catch {
                    responseData = responseText;
                }

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(
                                {
                                    status: response.status,
                                    statusText: response.statusText,
                                    headers: Object.fromEntries(response.headers.entries()),
                                    body: responseData,
                                },
                                null,
                                2
                            ),
                        },
                    ],
                    isError: response.status >= 400,
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error connecting to Antigravity: ${error.message}`,
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    // ── Tool: submit_task ──────────────────────────────────────────────────────
    server.tool(
        "submit_task",
        "Submit a command to the task queue. Returns a taskId for tracking. The task will be executed asynchronously by the background worker.",
        {
            command: z.string().describe("Shell command to execute"),
            cwd: z.string().optional().describe("Working directory (defaults to /app)"),
            timeout: z.number().optional().describe(`Timeout in ms (defaults to ${COMMAND_TIMEOUT})`),
        },
        async ({ command, cwd, timeout }) => {
            const task = {
                id: crypto.randomUUID(),
                command,
                cwd: cwd || "/app",
                timeout: timeout || COMMAND_TIMEOUT,
                status: "pending",
                created: new Date().toISOString(),
                result: null,
                error: null,
            };
            taskQueue.set(task.id, task);
            await saveTask(task);
            log("info", "Task submitted", { taskId: task.id, command });

            // Trigger worker
            setImmediate(processQueue);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ taskId: task.id, status: "pending" }, null, 2),
                    },
                ],
            };
        }
    );

    // ── Tool: get_task_result ──────────────────────────────────────────────────
    server.tool(
        "get_task_result",
        "Get the status and result of a submitted task by its taskId.",
        {
            taskId: z.string().describe("The task ID returned by submit_task"),
        },
        async ({ taskId }) => {
            const task = taskQueue.get(taskId);
            if (!task) {
                return {
                    content: [{ type: "text", text: JSON.stringify({ error: "Task not found", taskId }, null, 2) }],
                    isError: true,
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                taskId: task.id,
                                status: task.status,
                                command: task.command,
                                created: task.created,
                                startedAt: task.startedAt || null,
                                completedAt: task.completedAt || null,
                                result: task.result,
                                error: task.error,
                            },
                            null,
                            2
                        ),
                    },
                ],
            };
        }
    );

    // ── Tool: list_tasks ──────────────────────────────────────────────────────
    server.tool(
        "list_tasks",
        "List all tasks in the queue with their status. Optionally filter by status.",
        {
            status: z.enum(["pending", "running", "done", "error", "all"]).optional().describe("Filter by status (defaults to 'all')"),
            limit: z.number().optional().describe("Max number of tasks to return (defaults to 50)"),
        },
        async ({ status: filterStatus, limit }) => {
            let tasks = Array.from(taskQueue.values());

            if (filterStatus && filterStatus !== "all") {
                tasks = tasks.filter((t) => t.status === filterStatus);
            }

            // Sort by created time, newest first
            tasks.sort((a, b) => b.created.localeCompare(a.created));
            tasks = tasks.slice(0, limit || 50);

            const summary = tasks.map((t) => ({
                taskId: t.id,
                command: t.command.substring(0, 80) + (t.command.length > 80 ? "..." : ""),
                status: t.status,
                created: t.created,
                completedAt: t.completedAt || null,
            }));

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ total: taskQueue.size, showing: summary.length, tasks: summary }, null, 2),
                    },
                ],
            };
        }
    );

    return server;
}

// ─── Helper: Recursive directory listing ────────────────────────────────────
async function listDir(dirPath, maxDepth, currentDepth) {
    const entries = await readdir(dirPath, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        const info = {
            name: entry.name,
            path: fullPath,
            type: entry.isDirectory() ? "directory" : "file",
        };

        if (entry.isFile()) {
            try {
                const s = await stat(fullPath);
                info.size = s.size;
                info.modified = s.mtime.toISOString();
            } catch {
                // skip stat errors
            }
        }

        if (entry.isDirectory() && currentDepth < maxDepth - 1) {
            try {
                info.children = await listDir(fullPath, maxDepth, currentDepth + 1);
            } catch {
                info.children = [];
            }
        }

        results.push(info);
    }

    return results;
}

// ─── Express App ────────────────────────────────────────────────────────────────
const app = express();

app.use(cors());
// NOTE: Do NOT use express.json() globally — the MCP SDK's StreamableHTTPServerTransport
// reads and parses the raw request body itself. Global body parsing would consume the
// body before the transport can read it, causing "Parse error: Invalid JSON".

// Health check
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        server: "mcp-bridge",
        version: "1.0.0",
        uptime: process.uptime(),
        antigravity: {
            host: ANTIGRAVITY_HOST,
            port: ANTIGRAVITY_PORT,
        },
    });
});

// ─── MCP Transport: Streamable HTTP ─────────────────────────────────────────
// Store transports by session ID for multi-session support
const transports = {};

app.post("/mcp", async (req, res) => {
    try {
        // Check for existing session
        const sessionId = req.headers["mcp-session-id"];

        if (sessionId && transports[sessionId]) {
            // Reuse existing transport
            const transport = transports[sessionId];
            await transport.handleRequest(req, res);
            return;
        }

        // New session — create server + transport
        const server = createMcpServer();
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => crypto.randomUUID(),
        });

        transport.onclose = () => {
            const sid = transport.sessionId;
            if (sid && transports[sid]) {
                delete transports[sid];
                log("info", "Session closed", { sessionId: sid });
            }
        };

        await server.connect(transport);

        // Store transport after connection (sessionId is set during handleRequest)
        await transport.handleRequest(req, res);

        if (transport.sessionId) {
            transports[transport.sessionId] = transport;
            log("info", "New session created", { sessionId: transport.sessionId });
        }
    } catch (error) {
        log("error", "MCP POST error", { error: error.message });
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

app.get("/mcp", async (req, res) => {
    const sessionId = req.headers["mcp-session-id"];
    if (!sessionId || !transports[sessionId]) {
        res.status(400).json({ error: "Invalid or missing session ID" });
        return;
    }
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
    const sessionId = req.headers["mcp-session-id"];
    if (!sessionId || !transports[sessionId]) {
        res.status(400).json({ error: "Invalid or missing session ID" });
        return;
    }
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
    delete transports[sessionId];
    log("info", "Session terminated", { sessionId });
});

// ─── Start ──────────────────────────────────────────────────────────────────────
async function start() {
    // Load persisted tasks from disk
    await loadTasksFromDisk();

    app.listen(PORT, "0.0.0.0", () => {
        log("info", `MCP Bridge Server running on port ${PORT}`, {
            port: PORT,
            antigravityHost: ANTIGRAVITY_HOST,
            antigravityPort: ANTIGRAVITY_PORT,
        });
        log("info", "Available tools: execute_command, read_file, write_file, list_directory, antigravity_request, submit_task, get_task_result, list_tasks");
        log("info", `MCP endpoint: POST/GET/DELETE http://0.0.0.0:${PORT}/mcp`);
        log("info", `Health check:  GET http://0.0.0.0:${PORT}/health`);
        log("info", `Tasks directory: ${TASKS_DIR}`);

        // Process any pending tasks from previous run
        setImmediate(processQueue);
    });
}

start().catch((err) => {
    console.error("Failed to start:", err);
    process.exit(1);
});
