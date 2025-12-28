# WF-300: Chat Backbone

## Overview
**ID**: `WF-300_CHAT_BACKBONE`
**Description**: The central entry point for all chat messages from FamilyHub. It acts as a "dumb pipe" connecting the frontend to the primary intelligence layer (currently a simple LLM or Echo fallback).
**Trigger**: `POST /webhook/familyhub/chat-backbone`

## Scope
### Status: ACTIVE (Phase I-1)

### What it DOES:
1.  **Validate Input**: Ensures `message` string exists.
2.  **Generate RequestId**: If not provided by input.
3.  **Forward to LLM**: Sends message to Ollama `llama3:latest`.
4.  **Fallback**: If LLM fails/timeouts, returns `Echo: <message>`.
5.  **Strict Output**: Returns standardized JSON Structure.

### What it does NOT (Explicit Non-Goals):
1.  **Interpret Intents**: No keyword routing or intent classification.
2.  **Route to Calendar**: Does *not* trigger calendar workflows (even for "Kalender" queries).
3.  **Manage State**: No context retention or session management.
4.  **Enrich Context**: No external sensor data added.

## Contract
### Input (JSON)
```json
{
  "message": "Hello World",
  "requestId": "optional-uuid-from-client"
}
```

### Output (JSON)
```json
{
  "status": "ok",
  "reply": "Hello! How can I help?",
  "requestId": "uuid-mirror",
  "actionResult": null
}
```
*Note: `actionResult` is strictly `null` in Phase I-1, or an object if extended in future phases.*

## Error Handling
- **Invalid Payload**: Returns HTTP 400.
- **LLM Failure**: Returns HTTP 200 with "Echo: <message>".
