# FamilyHub Guardrail Specification

**Status**: Active
**Version**: 1.0.0

Guardrails are hard constraints that prevent the system from drifting into instability or architectural chaos.

## 1. Architectural Guardrails

### 1.1 Brain vs. Muscles
-   **FamilyHub ("The Brain")**:
    -   **MUST** be stateless regarding external side effects.
    -   **MUST NOT** hold third-party credentials (except basic auth for n8n/HA).
    -   **MUST NOT** execute long-running tasks locally.
-   **n8n / HA ("The Muscles")**:
    -   **MUST** execute all external mutations (Calendar, Notifications).
    -   **MUST** handle retries and rate limits.

### 1.2 Action Separation
-   **Read-Only**: Safe to execute anytime (L0).
-   **Side-Effecting**: Must be explicitly routed via `POST /webhook` and classified (L2/L3).
-   **Strict Ban**: No "GET" requests that modify state.

---

## 2. Forbidden Behaviors

### ❌ Silent Contract Changes
-   **Forbidden**: Changing an API response format without versioning.
-   **Consequence**: Immediate rollback.

### ❌ Bypassing n8n
-   **Forbidden**: FamilyHub directly calling the Google Calendar API or OpenAI API (for tools).
-   **Exception**: The main Chat LLM (e.g., via AI SDK) is allowed for *conversation generation only*, not for *tool execution*.

### ❌ UI-First Logic
-   **Forbidden**: Implementing business logic (e.g., "If user is premium") solely in the UI/React components.
-   **Requirement**: Logic must reside in the API/Backend or n8n workflow.

---

## 3. Mandatory Metadata

Every Request to the Execution Layer (n8n) MUST include:

| Field | Description | Example |
| :--- | :--- | :--- |
| `requestId` | Unique trace ID (UUID). | `req_abc123` |
| `timestamp` | ISO8601 time of intent. | `2025-12-22T10:00:00Z` |
| `source` | Where the request originated. | `chat_ui` |
| `workflow` | Target workflow ID. | `calendar.create` |

Requests missing these fields **MUST** be rejected by the Gateway.
