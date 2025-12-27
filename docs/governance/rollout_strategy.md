# Rollout Strategy

**Status**: Active
**Version**: 1.0.0

This document defines the governance for introducing new n8n workflows and features to FamilyHub.

## 1. Lifecycle Stages

Every workflow must pass through these stages.

### 1.1 Experimental (`alpha`)
-   **Scope**: Developer only.
-   **Gate**: `ENABLE_EXPERIMENTAL_FEATURES=true` in `.env`.
-   **Requirements**:
    -   Basic happy-path implementation.
    -   No destructive L3 actions.
-   **UX**: Hidden from main menu, accessible via Debug Console or special Intent keywords.

### 1.2 Beta (`beta`)
-   **Scope**: FamilyHub "Power Users" (Admins).
-   **Gate**: Feature Flag (e.g., `NEXT_PUBLIC_FEATURE_SHOPPING_LIST=true`).
-   **Requirements**:
    -   Passes [MCP Diagnostics](../mcp/diagnostic_playbook.md) check.
    -   Has mapped L2/L3 classification.
    -   Has explicit failure handling.
-   **UX**: Visible but marked with a "Lab" icon.

### 1.3 Stable (`stable`)
-   **Scope**: All Users.
-   **Gate**: Enabled by default.
-   **Requirements**:
    -   Run in Beta for > 1 week without critical incidents.
    -   Full Observability (Phase E) confirmed.
    -   Zero "Unknown Error" rates.

---

## 2. Feature Flags

FamilyHub uses a simple ENV-based feature flag system.

**Convention**: `ENABLE_FEATURE_[NAME]`

**Example**:
```bash
# .env
ENABLE_FEATURE_VOICE_MODE=true
ENABLE_FEATURE_SMART_HOME_WRITE=false # Safety Guard
```

---

## 3. Safe Defaults

1.  **Read-Only by Default**: New integrations start as L0/L1. Write permissions (L2/L3) are added only after proving stability.
2.  **Opt-In**: New workflows that send notifications or change state MUST be opt-in via config.
