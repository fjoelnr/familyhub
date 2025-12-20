# Chat Data Flow

**As of 2025-12-20**, the FamilyHub backend chat architecture is consolidated to a single path.

## 1. Single Entry Point
- **Route**: `app/api/chat/route.ts`
- **Method**: `POST`
- **Input**: `{ "message": "string" }`

## 2. Processing (n8n)
The API route forwards the payload directly to the n8n orchestrator.
- **Endpoint**: `http://192.168.178.20:5678/webhook/familyhub/chat`
- **Payload**:
  ```json
  {
    "workflow": "chat_hello",
    "payload": {
      "message": "User input..."
    }
  }
  ```

## 3. Response
The n8n workflow returns a JSON object which is wrapped in an `AgentResponse` structure.
- **Client Receives**:
  ```json
  {
    "type": "chat",
    "role": "assistant",
    "text": "Answer from n8n...",
    "meta": { "source": "n8n" }
  }
  ```

## 4. Deactivated Components (Legacy)
The following components have been moved to `src/_legacy/` and are **inactive**:
- `src/_legacy/agents/agentRouter.ts`
- `src/_legacy/agents/calendarAgent.ts`
- `src/_legacy/agents/explainAgent.ts`
- `src/_legacy/ai/intentClassifier.ts`
- `src/_legacy/ai/chatOrchestrator.ts`

**Reason**: Replaced by external n8n workflow logic.
**Reactivation**: If n8n infrastructure is abandoned, these files can be restored to `src/lib`.

## 5. Retained APIs
- `app/api/calendar/*`: Uses `src/lib/api/calendarSync.ts`. Pure CalDAV connector. **Active**.
