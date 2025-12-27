# Failure & Rollback Semantics

**Status**: Active
**Version**: 1.0.0

This document defines how FamilyHub handles failures during workflow execution, ensuring system stability and data integrity.

## 1. Failure Categories

| Category | Definition | Example | Recovery Strategy |
| :--- | :--- | :--- | :--- |
| **Transient** | Temporary network or service glitch. | `ECONNRESET` from Baikal. | **Retry (n8n)** with backoff. |
| **Permanent** | Logical error or invalid data. | `400 Bad Request` (Invalid Date). | **Fail Fast**. Notify User. |
| **Partial** | Multi-step flow where one step succeeded, next failed. | Calendar deleted, but notification failed. | **Degrade Gracefully**. Report partial success. |
| **Critical** | System inconsistency potential. | Money deducted but order not placed (not applicable yet). | **Manual Intervention**. Alert Admin. |

---

## 2. Retry Policy (The "No Ghost" Rule)

### 2.1 Idempotency IS HARD
Assume most downstream APIs are **NOT** idempotent unless proven otherwise.

### 2.2 n8n Configuration
-   **L0 (Read Only)**: Retry 3x allowed.
-   **L1 (Side Effect Free)**: Retry 3x allowed.
-   **L2 (Automated Action)**: Retry **ONCE** only if error is strictly network-related.
-   **L3 (Confirmed Action)**: **NEVER AUTO-RETRY** on application error.
    -   *Why?* We don't want to double-book a dentist simply because the ACK packet was dropped.
    -   *Action*: Fail, tell user "I'm not sure if that worked. Please check."

---

## 3. Degradation Strategy

### 3.1 "Fail Fast"
For the primary intent (e.g., "Create Event"), if the main action fails, the whole request fails.
-   **Do not** pretend success.
-   **Do not** fall back to a local mock if the real calendar is down.

### 3.2 "Degrade Gracefully"
For secondary effects (e.g., "Send Notification" after "Create Event"):
-   If `Calendar Create` = Success AND `Notify` = Fail:
-   **Outcome**: `Success (with Warning)`
-   **UI Message**: "Event created, but I couldn't send the notification."

---

## 4. Rollback
FamilyHub currently **DOES NOT** support automated two-phase commit or transactional rollback across n8n nodes.
**Implication**: Workflows must be designed linearly where the Critical Action is the *last* step, or steps are independent.
