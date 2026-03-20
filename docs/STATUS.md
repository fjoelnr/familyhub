# Status

## Purpose

FamilyHub is a shared family dashboard and assistant surface for information, planning, and memory.

The repository combines a Next.js application with integration work around weather, calendars, and workflow automation.

## Current State

- product direction: active concept with implementation in progress
- frontend stack: Next.js + React + TypeScript
- integration areas: CalDAV, weather, MCP/n8n workflow experiments
- test/tooling baseline: lint, test, build CI present

## What Needs Ongoing Care

- keep the root README product-oriented instead of framework-oriented
- separate stable source files from temporary debug artifacts
- keep governance and workflow docs aligned with actual integration behavior

## Branching

- `develop` is the integration branch
- `main` is the promotion branch
- normal flow remains `feature -> develop -> main`
