# FamilyHub Agents

This directory contains the "Action Agents" and the central **Agent Router**.

## Architecture

The flow for a user command is:

1.  **UI/Widget**: Captures user input (text/voice).
2.  **Intent Classifier**: Analyzes input to determine intent (e.g., `calendar_action`, `smalltalk`).
3.  **Agent Router (`agentRouter.ts`)**: Dispatches the intent to the correct handler.
4.  **Agents**:
    *   **CalendarActionAgent**: Handles calendar listing and creation.
    *   **ChatOrchestrator**: Handles smalltalk, Q&A, and planning.
    *   **ExplainAgent**: Specialized tutor for explanation intents.

### Agent Router (`agentRouter.ts`)

The central entry point for processing user requests.

*   **Input**: `IntentResult`, `ContextSnapshot`.
*   **Output**: `AgentResponse`
    ```typescript
    interface AgentResponse {
        type: 'chat' | 'action_request' | 'error';
        text?: string;
        actionResult?: ActionResult;
        requiresConfirmation?: boolean;
    }
    ```

### Calendar Agent (`calendarAgent.ts`)

Handles all calendar interactions.

*   **Inputs**: Intent, User Message, Context.
*   **Outputs**: `ActionResult` (Status, Summary, Payload).
*   **Safety**:
    *   **Listing**: Auto-executed (safe read).
    *   **Creation**: Returns `confirmation_needed`. NEVER auto-executes in v1.

### Explain Agent (`explainAgent.ts`)

A specialized agent for teaching and explaining concepts.

*   **Inputs**: Intent (entity: `audience`), UI Mode (calm/nerdy/manga).
*   **Outputs**: `AgentResponse` (Chat).
*   **Behavior**:
    *   Adapts persona based on `uiMode` (e.g., "Senpai" for Manga mode).
    *   Adapts simplicity based on audience hints (e.g., "kid", "child").

## Usage Example

```typescript
import { classifyIntent } from '@/lib/ai/intentClassifier';
import { getContextSnapshot } from '@/lib/context/getContextSnapshot';
import { routeIntent } from '@/lib/agents/agentRouter';

// 1. Get Context
const context = getContextSnapshot();

// 2. Classify
const intent = await classifyIntent(userInput, context);

// 3. Route
const response = await routeIntent(intent, userInput, context);

// 4. Handle Response
if (response.type === 'chat') {
  console.log("Bot:", response.text);
} else if (response.type === 'action_request') {
  if (response.requiresConfirmation) {
     // Show confirmation UI
  }
}
```
