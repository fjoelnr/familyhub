# Example Analysis: WF-103 LLM Failure

This document demonstrates the application of the [Diagnostic Playbook](diagnostic_playbook.md) to a hypothetical failure in WF-103.

## 1. Incident Trigger
**User Report**: "I asked to add milk to the shopping list, but it said 'System Error'."
**Context**: Request made at ~10:05 AM.

---

## 2. Investigation Trace (SOP-001)

### Step 1: Browse Executions
**Tool Call**: `get_workflow_executions(workflowId="WF-103", limit=5)`
**Result**:
```json
[
  { "id": "2468", "startedAt": "2025-12-21T10:05:01Z", "status": "error" },
  { "id": "2467", "startedAt": "2025-12-21T09:00:00Z", "status": "success" }
]
```
**Decision**: Investigation candidate is Execution `2468`.

### Step 2: Confirm RequestId (SOP-001.2)
**Tool Call**: `get_execution_details(executionId="2468")`
**Result Snapshot**:
```json
{
  "data": {
    "startData": {
      "body": {
        "context": { "requestId": "req-demo-failure-001" },
        "payload": { "text": "Add milk to list" }
      }
    }
  }
}
```
**Match**: Confirmed. This is the correct execution.

### Step 3: Analyze Failure (SOP-002)
**Observation**: The execution stopped at node `Parse LLM Response`.
**Node Data**:
-   `executionStatus`: `error`
-   `error`: `JSON.parse: unexpected character at line 1 column 1 of the JSON data`
-   `inputData`: `"Sure! Here is the JSON: { \"action\": \"shopping.add\", \"item\": \"milk\" }"`

**Root Cause**: The LLM output included conversational text ("Sure! Here is the JSON:") before the actual JSON object, breaking the strict JSON parser.

---

## 3. Analysis Report (Artifact)

### Incident Summary
-   **RequestId**: `req-demo-failure-001`
-   **Workflow**: WF-103 (Action Router)
-   **Timestamp**: 2025-12-21T10:05:01Z

### Observations
-   **Execution Duration**: 1.2s
-   **Failed Node**: `Parse LLM Response`
-   **Error Message**: `JSON.parse: unexpected character...`
-   **Key Input**: LLM returned conversational wrapper text.

### Root Cause Analysis
-   **Primary Cause**: LLM Prompt Engineering failure. The model is not strictly adhering to "JSON ONLY" constraint.
-   **Contributing Factors**: Current model temperature might be too high (0.7) or system prompt is weak.

### Recommendations
1.  **Workflow Level**: Add `extract_json_from_text` helper function (RegEx) before parsing, OR Use n8n "Structure Output" parser which is more robust.
2.  **FamilyHub Level**: None (FamilyHub sent correct data).
3.  **UX Level**: The "System Error" message was generic. FamilyHub could map `n8n_error` to "I'm having trouble processing that thought."

### Confidence
**High**. The input string causing the parse error is clearly visible in the execution data.
