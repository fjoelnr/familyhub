# CI/CD Pipeline

This project uses GitHub Actions for Continuous Integration.

## Workflow Overview
The workflow is defined in `.github/workflows/ci.yml` and triggers on:
- **Push** to `main` branch
- **Pull Request** to any branch

## Jobs
1.  **Lint**: Runs `npm run lint` (ESLint)
2.  **Test**: Runs `npm test` (Jest) with `USE_MOCK_DATA=true`
3.  **Build**: Runs `npm run build` (Next.js build) with `USE_MOCK_DATA=true`

## Environment Variables
- `USE_MOCK_DATA=true`: Configured globally in the workflow to ensure tests and builds use mock data and do not require external API keys.

## How to Run locally

To verify your changes before pushing, you can run the same commands locally:

```bash
# 1. Install dependencies (clean install recommended)
npm ci

# 2. Run Lint
npm run lint

# 3. Run Tests (Mock Mode)
# Windows (PowerShell)
$env:USE_MOCK_DATA="true"; npm test
# Mac/Linux
USE_MOCK_DATA=true npm test

# 4. Build (Mock Mode)
# Windows (PowerShell)
$env:USE_MOCK_DATA="true"; npm run build
# Mac/Linux
USE_MOCK_DATA=true npm run build
```

## Troubleshooting
- If `npm ci` fails locally, delete `node_modules` and run `npm install` to update `package-lock.json`, then try `npm ci` again.
- Ensure no real API calls are attempted during `test` or `build`. Check `src/lib/api` to ensure `USE_MOCK_DATA` is respected.
