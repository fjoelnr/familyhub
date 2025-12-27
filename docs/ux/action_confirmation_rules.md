# Action Confirmation Rules

**Status**: Active
**Version**: 1.0.0

This document defines the User Experience (UX) rules for handling `L3 (User Confirmed)` and ambiguous `L2` actions.

## 1. The Confirmation Trust Boundary

FamilyHub MUST NEVER assume consent for high-stake actions.
The boundary is implemented in the **UI State Machine**, not just the backend.

### 1.1 Trigger Conditions
Confirmation is triggered when:
1.  **Action Level is L3**: The workflow explicitly requires it.
2.  **Ambiguity**: The Agent (LLM) is < 90% confident in the parameters.
3.  **Destructive Op**: keywords like `delete`, `cancel`, `remove` are detected in valid contexts.

---

## 2. UI Presentation Rules

### 2.1 The "Awaiting Action" State
When confirmation is required, the UI MUST switch to `awaiting_action` mode.

-   **Visuals**: Distinct card, distinct color (e.g., Amber/Blue), pulsating border.
-   **Content**:
    -   **Headline**: Clear Verb + Object (e.g., "Delete Appointment?")
    -   **Details**: Date, Time, Subject (The exact parameters passed to n8n).
    -   **Risk Warning**: If destructive, show "This cannot be undone."
-   **Controls**:
    -   **[Confirm]**: Primary Action. Triggers execution.
    -   **[Cancel]**: Secondary Action. Aborts workflow.

### 2.2 Passive vs. Active
-   **L2 Actions**: Show a "Toast" or "Ephemeral Message" *after* initiation. ("Added milk to list"). Allow Undo if possible.
-   **L3 Actions**: Block interaction until resolved.

---

## 3. n8n Implementation Contract

For L3 Workflows:
1.  **Phase 1 (Draft)**: FamilyHub calls n8n to "Preview" or validate input. (Optional).
2.  **Phase 2 (Hold)**: FamilyHub UI holds the state. n8n is **NOT** running a waiting execution (stateless).
3.  **Phase 3 (Execute)**: User clicks Confirm -> FamilyHub sends the definitive `POST /webhook/...` with `confirmed: true`.

**Anti-Pattern**: DO NOT start an n8n workflow that pauses and waits for a callback for minutes. This causes timeout issues. State should reside in the App/Client.
