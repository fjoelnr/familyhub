# WF-201B Read-only Calendar (Curl)

> [!IMPORTANT]
> **REFERENCE IMPLEMENTATION**. This workflow is the authoritative source for connecting to Baikal CalDAV. It bypasses n8n's native HTTP Request constraints by using system `curl` with Digest Authentication.

## Overview
- **Status**: ACTIVE / REFERENCE
- **Method**: System `curl` via `Execute Command` Node
- **Auth**: Digest Authentication (handled by `curl --digest`)
- **Key Feature**: Robust handling of `REPORT` method + XML Body + Digest Auth which fails in standard Node.js HTTP clients.

## Implementation Details
1. **Webhook**: `POST /webhook/familyhub/calendar-read`
2. **Range Calculation**: Computes `rangeStart` and `rangeEnd` (UTC).
3. **Execute Command**:
   - Generates XML body into a temporary file: `/tmp/n8n_caldav_query_<executionId>.xml`
   - Executes `curl` with:
     - `--digest`
     - `--user "$BAIKAL_USER:$BAIKAL_PASSWORD"`
     - `--data-binary @/tmp/...`
     - Flags: `--silent --show-error --fail-with-body`
   - **Environment Variables**: `BAIKAL_USER` and `BAIKAL_PASSWORD` must be set in the n8n container environment.
   - **URL**: Hardcoded to `http://192.168.178.99/dav.php/calendars/fjoelnir/valur/`.

## Prerequisites
The n8n instance/container **must** have:
1. `curl` installed.
2. Environment variables set:
   - `BAIKAL_USER`
   - `BAIKAL_PASSWORD`

## Output
Returns a JSON object:
```json
{
  "status": "ok",
  "rawXml": "<...calendar data...>",
  "httpCode": "(Check stdout)",
  "meta": {
    "handledBy": "WF-201B (Curl)",
    "method": "REPORT (Digest)"
  }
}
```
Does **not** parse the XML. Parsing is out of scope for this diagnostic layer.
