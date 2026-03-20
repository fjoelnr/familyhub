# WF-200 Calendar Diagnostic (Strict Mode)

**ID**: `WF-200`
**Type**: Low-Level Connectivity Diagnostic
**Purpose**: Verify bidirectional (Write/Read) connectivity to Baikal with **zero parsing logic**.
**Philosophy**: "Raw Truth" - Pass/Fail is determined by HTTP Status Codes only.

## Usage

1. **Import**: Import `WF_200_CALENDAR_DIAGNOSTIC.json` into n8n.
2. **Setup**: Ensure credentials `baikal_creds` (Basic Auth) exist in n8n.
3. **Trigger**:
   ```bash
   curl -X POST http://localhost:5678/webhook/diagnostic/calendar \
     -H "Content-Type: application/json" \
     -d '{"requestId": "run-002"}'
   ```

## Workflow Steps

1. **Create Event** (`PUT`):
   - Tries to create `diag-run-002.ics` in Baikal.
   - **Body**: Minimal Valid VCALENDAR (RFC 5545).
   - **Expectation**: HTTP 201 Created or 204 No Content.
2. **Read Events** (`REPORT`):
   - Queries for *all* events today.
   - **Expectation**: HTTP 207 Multi-Status.
3. **Format Report**:
   - Aggregates raw statuses and bodies.
   - **NO PARSING**: Returns raw XML snippet for human inspection.

## Expected Output (Success)

```json
{
  "status": "PASS",
  "reason": "Write and Read executed cleanly",
  "diagnostic": {
    "requestId": "run-002",
    "step1_write": {
      "status": 201, // or 204, 200
      "error": null
    },
    "step2_read": {
      "status": 207, // Multi-Status is key for CalDAV
      "raw_body_snippet": "<?xml ... <d:response> ... diag-run-002 ..."
    }
  },
  "meta": {
    "mode": "strict_raw"
  }
}
```

## Expected Output (Auth Failure)

```json
{
  "status": "FAIL",
  "reason": "Write failed with HTTP 401: ...",
  "diagnostic": {
    "step1_write": {
      "status": 401,
      "error": "The service refused the connection..."
    }
  }
}
```

## Troubleshooting

- **Write Status 401**: Baikal rejected credentials. 
    - *Action*: Check `baikal_creds`. Try Digest Auth if server requires it (n8n Limitation: Basic only? Check server config).
- **Read Body Empty**: 
    - *Action*: Check date range in `REPORT` body vs. server timezone.
