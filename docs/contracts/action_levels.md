# Action Level Taxonomy

**Status**: Active
**Version**: 1.0.0

This document defines the strict taxonomy for all FamilyHub actions (backend and n8n). Every workflow MUST be classified into one of these levels.

## 1. Taxonomy

| Level | Name | Description | Automation Allowed? | Confirmation Required? |
| :--- | :--- | :--- | :--- | :--- |
| **L0** | `read_only` | Pure data retrieval. No state change. Safe to retry infinitely. | ✅ Yes | ❌ No |
| **L1** | `side_effect_free` | internal computation or logging. No external mutation. | ✅ Yes | ❌ No |
| **L2** | `automated_action` | Low-risk external mutation (e.g., adding to a shopping list). Reversible using L2/L3 actions. | ✅ Yes | ❌ No (Notify Only) |
| **L3** | `user_confirmed_action` | High-risk or costly mutation (e.g., deleting a calendar event, sending an email, turning off heating). | ❌ No | ✅ **YES** |
| **L4** | `system_maintenance` | Admin-level operations (migrating DB, updating n8n). Never exposed to normal agents. | ❌ No | 🔒 Admin Console Only |

---

## 2. Classification Rules

### 2.1 Default to L3
By default, **ALL** external mutations are **L3 (User Confirmed)** unless explicitly proven safe for L2.

### 2.2 Reversibility Test
To qualify for **L2 (Automated)**:
-   Can the user undo it easily? (e.g., "Delete that item")
-   Is the cost of error low? (e.g., wrong item on list vs. missed Dentist appointment)

### 2.3 n8n Workflow Metadata
All n8n workflows MUST declare their level in the Workflow Settings or Tagging system (e.g., tag: `action-level:L2`).

---

## 3. Existing Workflow Mapping

| Workflow | ID | Current Level | Rationale |
| :--- | :--- | :--- | :--- |
| **Calendar List** | `calendar.list` | **L0** | Read-only query. |
| **Availability Check** | `calendar.free_busy` | **L0** | Read-only query. |
| **Notification** | `reminder.schedule` | **L2** | Low risk. Worst case: user gets an annoying notification. |
| **Calendar Create** | `calendar.create` | **L3** | **High Risk**. Errors can cause missed appointments. _(Candidate for L2 only with robust "Draft" mode)_ |
| **Calendar Delete** | `calendar.delete` | **L3** | Destructive. |
| **Action Router** | `action.router` | **Mixed** | Depends on the target tool. Router itself is L1, downstream is binding. |
