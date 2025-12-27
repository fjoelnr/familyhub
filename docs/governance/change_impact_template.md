# Change Impact Template

**Target**: `docs/contracts/change_log.md` (or specific PR description)

Before modifying critical paths (Routing, n8n, State Logic), fill this out.

## 1. Change Summary
-   **Goal**: What user problem are we solving? (Link to Requirement ID)
-   **Scope**: [ ] Backend API  [ ] n8n Workflow  [ ] UI State  [ ] Database

## 2. Guardrail Check
*Answer YES/NO. If any are "VIOLATION", stop.*

-   [ ] Does this move logic from n8n to FamilyHub (Brain)? (Should be NO)
-   [ ] Does this remove existing functionality? (Should be NO)
-   [ ] Does this change the API Contract (v1)? (Should be NO or Versioned)
-   [ ] Are `requestId` and `timestamp` preserved? (Should be YES)

## 3. Risk Assessment
-   **Risk Level**: [ ] Low (L2)  [ ] High (L3)  [ ] Critical
-   **Worst Case**: What breaks if this fails? (e.g., "User executes calendar delete twice")
-   **Rollback Plan**: How do we undo this in < 1 minute?

## 4. Verification Plan
-   [ ] New Unit Test
-   [ ] Manual Re-Verification of Affected Workflow
-   [ ] Check Diagnostic Tracing (Phase E)

---
**Signed By Agent**: [Agent Name/ID]
