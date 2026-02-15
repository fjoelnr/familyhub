# MCP Bridge Server 🌉

MCP (Model Context Protocol) Bridge Server als Docker Container. Stellt Tools via HTTP/SSE bereit, damit Gnomi2 mit Antigravity kommunizieren kann.

```
┌────────┐  HTTP   ┌─────────────┐  stdio  ┌────────────┐
│ Gnomi2 │────────▶│ MCP Bridge  │───────▶│ Antigravity│
│.30     │ :8080   │ Container   │        │    .40     │
└────────┘         └─────────────┘         └────────────┘
```

## Quick Start

```bash
cd mcp-bridge
docker-compose up -d
```

Prüfen ob es läuft:

```bash
# Health Check
curl http://localhost:8080/health

# Logs
docker-compose logs -f mcp-bridge
```

## MCP Endpoint

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| `POST` | `/mcp` | JSON-RPC Requests (initialisiert Session) |
| `GET` | `/mcp` | SSE Stream (mit `mcp-session-id` Header) |
| `DELETE` | `/mcp` | Session beenden |
| `GET` | `/health` | Health Check |

## Tools

| Tool | Beschreibung |
|------|-------------|
| `execute_command` | Shell-Befehle ausführen (stdout, stderr, exit code) |
| `read_file` | Datei lesen |
| `write_file` | Datei schreiben/erstellen (mit auto-mkdir) |
| `list_directory` | Verzeichnisinhalt auflisten |
| `antigravity_request` | HTTP Requests an Antigravity senden |

## Konfiguration (Environment Variables)

| Variable | Default | Beschreibung |
|----------|---------|-------------|
| `PORT` | `8080` | Server Port |
| `ANTIGRAVITY_HOST` | `192.168.178.40` | Antigravity IP |
| `ANTIGRAVITY_PORT` | `3000` | Antigravity Port |
| `COMMAND_TIMEOUT` | `30000` | Command Timeout (ms) |
| `MAX_FILE_SIZE` | `10485760` | Max. Dateigröße zum Lesen (bytes) |

## Beispiel: MCP Session starten

```bash
# 1. Initialize
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": { "name": "test-client", "version": "1.0" }
    }
  }'

# 2. Tool aufrufen (Session-ID aus Response Header verwenden)
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: <SESSION_ID>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "execute_command",
      "arguments": { "command": "echo Hello from MCP Bridge!" }
    }
  }'
```

## Stoppen

```bash
docker-compose down
```

## Workspace Volumes

Um dem Container Zugriff auf Host-Dateien zu geben, Volume-Mount in `docker-compose.yml` aktivieren:

```yaml
volumes:
  - /path/to/workspace:/workspace
```
