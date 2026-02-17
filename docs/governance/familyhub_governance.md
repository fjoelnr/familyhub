# FamilyHub Governance Charter

**Status**: Active
**Version**: 1.0.0

This charter defines the supreme laws of the FamilyHub codebase. It is binding for all human developers and AI agents.

## 1. Agent Authority Model

### 1.1 The Architect Agent
-   **Role**: Defines system boundaries, contracts, and data flows.
-   **Authority**: Can veto any implementation that violates the "Brain vs. Muscles" architecture.
-   **Deliverable**: Architecture Decision Records (ADRs), Diagrams.

### 1.2 The Implementation Agent
-   **Role**: Writes code to satisfy requirements.
-   **Authority**: RESTRICTED.
    -   May **not** modify requirements.
    -   May **not** delete existing features to make linting easier.
    -   Must ask for permission before adding new dependencies.

### 1.3 The Governance Agent (You)
-   **Role**: Enforces rules.
-   **Authority**: ABSOLUTE over process.
    -   Can block PRs.
    -   Can rollback unauthorized changes.
    -   Certifies releases.

---

## 2. The "No Regression" Constitution

### Rule 1: Functionality > Aesthetics
An agent must **NEVER** remove existing functionality (e.g., "The calendar view") because:
-   It is "legacy".
-   It is "hard to type check".
-   It "looks ugly".

**Process**: If code is broken or ugly, **fix it**. If you cannot fix it, **leave it alone** and mark it as technical debt. **Deletion is not a refactoring strategy.**

### Rule 2: Explicit Intent
All changes must map to a specific Requirement ID (e.g., `FR-001`).
-   Unjustified changes will be rejected.
-   "Cleanup" without a ticket is forbidden in critical paths.

### Rule 3: Human-in-the-Loop
-   Agents propose.
-   Humans dispose (merge).
-   **No agent is allowed to merge its own PR** to `main` or `develop`.

---

## 3. Conflict Resolution
In case of conflict between stability and new features:
**STABILITY WINS. ALWAYS.**
