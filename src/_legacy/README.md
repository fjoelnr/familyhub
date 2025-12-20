# Legacy Code Storage

This directory contains code that was replaced by the n8n integration layer as of December 2025.

**Do not import these files in active code.**

## Contents
- `agents/`: Old TypeScript agent logic (Router, Calendar, Explain)
- `ai/`: Old Intent Classifiers and LLM providers

## Rationale
We consolidated all chat logic to `app/api/chat/route.ts` which forwards to n8n. These files are kept for reference or potential future partial reactivation if needed.
