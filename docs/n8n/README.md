# n8n Workflows for FamilyHub

This directory contains the n8n workflow definitions for the FamilyHub chat extension.

## Workflows

### 1. WF-102: Echo + Metadata
- **File**: `WF_102_CHAT_ECHO.json`
- **Purpose**: Debugging and Observability. Echos the input message with metadata.
- **Endpoint**: `POST /webhook/familyhub/chat-echo`

### 2. WF-103: LLM Clean Chat (Ollama)
- **File**: `WF_103_CHAT_LLM.json`
- **Purpose**: LLM interaction via Ollama with specific personas.
- **Endpoint**: `POST /webhook/familyhub/chat-llm`

## Import Steps

1.  Open your n8n instance (e.g., `http://192.168.178.20:5678`).
2.  Go to **Workflows**.
3.  Click **Add Workflow** -> **Import from File**.
4.  Select `WF_102_CHAT_ECHO.json` or `WF_103_CHAT_LLM.json`.
5.  **Save** and **Activate** the workflow.

## Usage & Curl Examples

### Echo (WF-102)

**Linux/Mac:**
```bash
curl -X POST http://192.168.178.20:5678/webhook/familyhub/chat-echo \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": "chat_echo",
    "requestId": "test-req-1",
    "payload": { "message": "Hello World" },
    "context": { "uiMode": "nerdy", "dayPhase": "morning" }
  }'
```

**Windows (PowerShell/CMD):**
```cmd
curl.exe -X POST "http://192.168.178.20:5678/webhook/familyhub/chat-echo" ^
  -H "Content-Type: application/json" ^
  -d "{\"workflow\":\"chat_echo\",\"requestId\":\"test-req-1\",\"payload\":{\"message\":\"Hello Echo\"},\"context\":{\"uiMode\":\"calm\"}}"
```

### LLM Chat (WF-103)

**Linux/Mac:**
```bash
curl -X POST http://192.168.178.20:5678/webhook/familyhub/chat-llm \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": "chat_llm",
    "requestId": "test-req-2",
    "payload": { "message": "Why is the sky blue?" },
    "context": { "uiMode": "calm" }
  }'
```

**Windows (PowerShell/CMD):**
```cmd
curl.exe -X POST "http://192.168.178.20:5678/webhook/familyhub/chat-llm" ^
  -H "Content-Type: application/json" ^
  -d "{\"workflow\":\"chat_llm\",\"requestId\":\"test-req-2\",\"payload\":{\"message\":\"Why is the sky blue?\"},\"context\":{\"uiMode\":\"calm\"}}"
```

## Error Handling

- **Invalid Payload (HTTP 400)**: If `payload.message` is missing.
  ```json
  { "status":"error", "errorType":"invalid_payload", "reply":"Invalid message", ... }
  ```
- **Ollama Unreachable (HTTP 502)**: If Model API is down (WF-103).
  ```json
  { "status":"error", "errorType":"ollama_unreachable", "reply":"LLM backend unreachable", ... }
  ```

## Debugging

- Check Execution History in n8n.
- Ensure Ollama is running at `http://192.168.178.40:11434`.
- Check n8n Webhook URL matches the curl command.
