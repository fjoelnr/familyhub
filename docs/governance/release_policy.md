# FamilyHub Release Policy

**Status**: Active
**Version**: 1.0.0

This policy dictates how code moves from an Agent's brain to production.

## 1. Branching Strategy

| Branch | Purpose | Protection Rule |
| :--- | :--- | :--- |
| `main` | **Production Code**. Always deployable. Pure golden state. | **LOCKED**. No direct commits. PR Required. |
| `develop` | **Integration**. Working beta state. | **LOCKED**. PR Required. |
| `feature/*` | **New Functionality**. Agents/Humans play here. | Open for Agent commits. |
| `fix/*` | **Hotfixes**. Urgent repairs. | Open for Agent commits. |

## 2. The Merge Protocol

### 2.1 Agent Role
1.  **Checkout** a new branch (`feature/my-cool-feature`).
2.  **Implement** changes.
3.  **Verify** locally (Tests, Lint, Build).
4.  **Create PR** proposal (via `notify_user` or artifact).

### 2.2 Human Role
1.  **Review** the Agent's PR.
2.  **Approve/Reject**.
3.  **Merge** to `develop` / `main`.

**CRITICAL RULE**: Agents generally **DO NOT** have write access to `main` without explicit, per-task human confirmation tool calls.

---

## 3. Versioning & tagging

-   **Releases**: Must be tagged `vX.Y.Z` (Semantic Versioning).
-   **Changelog**: `CHANGELOG.md` must be updated for every non-trivial merge.

## 4. Rollback Expectations

If a deployment to `main` causes a **Sev-1 Incident** (e.g., n8n unreachability):
1.  **Immediate Revert**: `git revert <commit-hash>`
2.  **No "Fix Forward"**: Do not try to patch it in production. Roll back first, then fix in dev.
