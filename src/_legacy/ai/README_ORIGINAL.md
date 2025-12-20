# AI Module

This module handles all interaction with LLMs, including orchestration, provider selection, and intent classification.

## Components

### Chat Orchestrator (`chatOrchestrator.ts`)
Routes messages to the appropriate AI provider (Ollama, OpenAI, or Mock).
- **Default Strategy**: Try Ollama first, fallback to OpenAI.
- **Mock Mode**: Set `USE_MOCK_DATA=true` to bypass LLMs.
- **Context**: Automatically injects `ContextSnapshot` into the system prompt.
- **System Prompt Override**: Use `systemPromptOverride` in options to bypass the default persona (useful for classification).

### Intent Classifier (`intentClassifier.ts`)
Analyzes user input to determine the *type* of request before any action is taken. This acts as the router for future agents.

#### Intent Types
- `smalltalk`: Casual greetings, generic questions.
- `information`: General knowledge requests.
- `planning`: Brainstorming, drafting lists.
- `calendar_action`: Managing events.
- `explanation`: Deep explanations of topics.
- `unknown`: Everything else.

#### Usage
```typescript
import { classifyIntent } from "@/lib/ai/intentClassifier";
import { getContextSnapshot } from "@/lib/context/getContextSnapshot";

const context = getContextSnapshot();
const result = await classifyIntent("Schedule a dentist appointment", context);

if (result.intent === "calendar_action") {
    // Delegate to Calendar Agent
}
```

#### How it works
1. **Mock Mode Check**: Returns fast, deterministic responses if mocking is on.
2. **Deterministic Rules**: Checks for common phrases (e.g. "hi") to save latency/cost.
3. **LLM Analysis**: Sends a strict JSON-enforced prompt to the Chat Orchestrator to categorize complex inputs.
