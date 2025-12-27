# WF-201G: Google Calendar Read-Only Reference

This is the canonical reference workflow for reading calendar events from Google Calendar in FamilyHub.
It adheres to the strict "No Experimentation" rule and uses only official n8n nodes.

## Status: PASS / REFERENCE (Phase H)

## Specification

*   **ID**: `WF-201G_CALENDAR_READ_GOOGLE`
*   **Trigger**: `POST /webhook/familyhub/calendar-read-google`
*   **Security**: Internal only. Read-only.
*   **Dependencies**: 
    *   Google Calendar Credential (OAuth2).
    *   Environment Variable `N8N_CALENDAR_READ_GOOGLE_URL` in FamilyHub backend.

## Input

```json
{
  "range": "today"
}
```

(The workflow calculates "today" rigidly based on Europe/Berlin time, ignoring the input parameter value, to ensure stability.)

## Output

```json
{
  "status": "ok",
  "count": 2,
  "events": [
    {
      "title": "Meeting",
      "start": "2025-12-27T10:00:00+01:00",
      "end": "2025-12-27T11:00:00+01:00",
      "allDay": false,
      "location": null,
      "description": null
    }
  ]
}
```

## Setup Instructions

1.  **Import**: Load `WF_201G_CALENDAR_READ_GOOGLE.json` into n8n.
2.  **Credential**: Open the **Google Calendar** node and select your "Google Calendar Account" credential.
3.  **Calendar Selection**:
    *   The workflow defaults to the **Primary** calendar.
    *   **CRITICAL**: If your events are in a specific calendar (e.g., "AI-Kalender"), you **MUST** open the node and select "AI-Kalender" from the **Calendar** dropdown list.
4.  **Activate**: Toggle the workflow to **Active**.
5.  **Configure Backend**:
    *   Ensure `.env` in FamilyHub contains:
        `N8N_CALENDAR_READ_GOOGLE_URL=http://<n8n-ip>:5678/webhook/familyhub/calendar-read-google`

## Verification

### 1. Manual Verification (Script)
Run standard verification script `verify_wf201g_google.sh`.

### 2. Integration Verification (Chat)
Ask FamilyHub: *"Was steht heute an?"* or *"Zeig mir meinen Kalender"*
*   **Success**: The bot replies with "Heute hast du X Termine" and shows the calendar widget.

## Abgrenzung
*   **Baikal / CalDAV**: These workflows are experimental/legacy and **not** part of the productive Phase H.
*   **Future Scope**: Create/Update events (Phase I+).
