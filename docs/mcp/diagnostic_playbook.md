# Diagnostic Playbook for n8n

## 1. Introduction
This playbook defines the Standard Operating Procedures (SOPs) for diagnosing n8n workflow issues using the **read-only MCP interface**.
**Goal**: Identify root causes within 60 seconds without mutating state or accessing the n8n UI.

## 2. Core Diagnostic Tools (MCP)
-   `list_workflows()`: Map Workflow Names to IDs.
-   `get_workflow_executions(workflowId, limit)`: customizable history.
-   `get_execution_details(executionId)`: Deep inspection of node data.

---

## 3. Standard Operating Procedures (SOPs)

### SOP-001: Trace by RequestId
**Trigger**: "What happened to RequestId `X`?"

1.  **Identify Workflow**:
    -   If unknown, call `list_workflows()` and search for logical match (e.g., `calendar`).
2.  **Locate Execution**:
    -   `get_workflow_executions(workflowId=..., limit=20)`
    -   Iterate results: `get_execution_details(executionId=...)`
    -   **Check**: `data.startData.body.context.requestId == X`
3.  **Analyze Outcome**:
    -   If `status == 'success'` but user claims failure: Check **Effect Nodes** (e.g., Baikal Call) output.
    -   If `status == 'error'`: Identify the **Stopped Node**.

### SOP-002: Analyze Execution Failure
**Trigger**: Execution found with `status: error`.

1.  **Identify Failed Node**:
    -   In `execution_details`, find the node where `executionStatus` is `error` or has `error` output.
2.  **Inspect Input**:
    -   Look at `runData[NodeName][0].data.main[0][0].json`.
    -   Is the input malformed? Missing fields?
3.  **Inspect Error**:
    -   Look at `runData[NodeName][0].error`.
    -   Common codes: `401 Unauthorized`, `timeout`, `ECONNREFUSED`.

### SOP-003: "It didn't trigger"
**Trigger**: No execution found for the expected timeframe.

1.  **Verify Webhook**:
    -   FamilyHub logs should show a `200 OK` from the n8n Gateway.
    -   If FamilyHub sent it, n8n received it.
2.  **Check Filters**:
    -   Does the workflow have a `Filter` or `If` node early on?
    -   Did the execution start but stop silently (success state but logical ignore)?
3.  **Global Search**:
    -   `get_workflow_executions(limit=50)` (no workflowId) to see if it went to the wrong workflow.

---

## 4. Common Failure Modes & Decision Tree

### 4.1 "Something went wrong" (Generic Error)
-   **Is there an execution ID?**
    -   **Yes**: Go to [SOP-002](#sop-002-analyze-execution-failure).
    -   **No**: Go to [SOP-003](#sop-003-it-didnt-trigger).

### 4.2 LLM / AI Failure (WF-103)
-   **Symptom**: "I said X but it did Y."
-   **Check Node**: `LLM Model` or `Structure Output`.
-   **Inspect**:
    -   **Input Prompt**: Was the context variable correctly injected?
    -   **Output**: Did the LLM allow hallucination?
    -   **Resolution**: Usually requires Prompt Engineering (Phase C/D).

### 4.3 Service Unreachable (HTTP 500/Timeout)
-   **Check Node**: `HTTP Request`.
-   **Root Cause**: Target service (Baikal, HA) is down.
-   **Action**: Restart target service (out of n8n scope).

---

## 5. Artifacts
-   **Analysis Report**: Fill out `docs/mcp/analysis_report_template.md` for every incident.
