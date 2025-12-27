# WF-201 Read-only Calendar (Docs)

> [!WARNING]
> **DEPRECATED**. Use [WF-201B](WF_201B_CALENDAR_READ_CURL.md) instead.
> This workflow uses Basic Auth which is not supported by the Baikal configuration. It remains for historical comparison only.


## Overview
Workflow zur Abfrage der heutigen Kalendereinträge via CalDAV.

- **Status**: IMPLEMENTED (Basic Auth Strategy)
- **Type**: Read-only
- **Auth**: Basic (`baikal_basic`)

## Strategy: Basic Auth
Utilizes Standard `REPORT` method with **Basic Authentication**.
- **Reason**: Digest Authentication in n8n/Node can cause the XML body to be dropped during the challenge-response handshake when using non-standard methods like `REPORT`. Basic Auth sends the header immediately, preserving the body.

## Ground Truth Reference
Basierend auf validierten Requests aus `curl_read_today.sh`.

- **Method**: `REPORT` (via Expression `={{ 'REPORT' }}`)
- **URL**: `http://192.168.178.99/dav.php/calendars/fjoelnir/valur/`
- **Header**:
  - `Content-Type: application/xml; charset=utf-8`
  - `Depth: 1`
- **Body**: XML `calendar-query` string.

## Credential Placement
- **n8n**: Requires `basicAuth` credential. Suggested name: `baikal_basic`.
- **JSON**: Reference ID `baikal_basic`.

## Usage
1. Import `WF_201_CALENDAR_READ.json` into n8n.
2. Ensure you have a **Basic Auth** credential created.
   - If named `baikal_basic`, it maps automatically.
   - If named differently (e.g. "Unnamed credential 2"), select it manually in the Node settings.
3. Call Webhook `POST /webhook/familyhub/calendar-read`.
