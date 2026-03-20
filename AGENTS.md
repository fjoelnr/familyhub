# AGENTS.md

## Purpose

This repository contains FamilyHub, a family-oriented dashboard and assistant surface for shared information, planning, and memory.

It combines a Next.js frontend with integration work around calendars, weather, and agent-assisted family workflows.

## Repository Map

- `app/` Next.js app routes and page entrypoints
- `components/` UI building blocks and shell components
- `lib/` app services, contexts, and integration logic
- `docs/` architecture, governance, MCP, and n8n material
- `mcp-bridge/` integration bridge experiments
- `scripts/` helper scripts
- `public/` static assets

## Working Rules

- keep the human-facing product concept clearer than the framework details
- treat debug artifacts and ad-hoc investigation outputs as non-source material
- update docs when integration behavior or governance rules change
- keep `develop` as the integration branch and `main` as the promotion branch
