# n8n Workflow Architecture Specification (FamilyHub)

**Status**: Draft
**Version**: 0.2.0
**Date**: 2025-12-20
**Author**: n8n Workflow Architect

## 1. Architecture Overview (Diagram)

```mermaid
graph TD
    User((User)) -->|Voice/Chat| FH[FamilyHub Core]
    
    subgraph "The Brain (FamilyHub)"
        FH -->|Intent: calendar.create| API_Call
    end

    subgraph "The Muscles (n8n)"
        API_Call[Webhook Call] -->|POST JSON| N8N_GW[n8n Gateway / Webhooks]
        
        N8N_GW -->|Route| WF1[WF-001: Calendar Create]
        N8N_GW -->|Route| WF2[WF-002: Calendar Query]
        N8N_GW -->|Route| WF3[WF-003: Reminder Schedule]
        
        WF1 -->|Write| BK[Baikal (CalDAV)]
        WF1 -->|Notify| HA[Home Assistant]
        
        WF2 -->|Read/Report| BK
        
        WF3 -->|Wait/Delay| WF3_Delay[Wait Node]
        WF3_Delay -->|Notify| HA
    end

    subgraph "Truth & Authority"
        BK[(Baikal Calendar)]
        HA[(Home Assistant)]
    end
```

## 2. API Schema (Standardized Interface)

**Endpoint:** `http://192.168.178.20:5678/webhook/familyhub-gateway` (Recommended Single Entry)
**Method:** `POST`
**Headers:**
- `Content-Type`: `application/json`
- `X-FamilyHub-Auth`: `[SECRET_TOKEN]` (Placeholder)

### Request Envelope
```json
{
  "workflow": "calendar.create", 
  "payload": {
    // Workflow specific data
  },
  "context": {
    "user": "Andre",
    "locale": "de-DE",
    "requestId": "123e4567-e89b-12d3-a456-426614174000",
    "confidence": 0.98
  }
}
```

### Standard Response Envelope
**Success (200 OK):**
```json
{
  "status": "success",
  "data": {
    "eventId": "123456789.ics",
    "link": "..."
  }
}
```

**Error / Correction Needed (200 OK or 4xx):**
```json
{
  "status": "error", // or "correction_needed"
  "error": {
    "code": "SLOT_OCCUPIED",
    "message": "The time slot is already taken.",
    "details": {
      "conflictingEvent": "Meeting with Boss"
    }
  }
}
```

---

## 3. Workflow Definitions

All workflows are compatible with n8n v2.0.3.

### WF-001: calendar.create
**Purpose**: Create a new calendar event and notify HA.
**Trigger**: Webhook (POST) → Filter `body.workflow == 'calendar.create'`

| Step | Node Type (n8n v2) | Configuration Notes |
|---|---|---|
| 1. Validate | `Code` / `Schema` | Validate `payload.summary`, `start`, `end` exist and are ISO8601. |
| 2. Resolve Cal | `Set` | Map user "Andre" to correct CalDAV URL (e.g. `/calendars/andre/default/`). |
| 3. Create Event | `HTTP Request` | Method: `PUT`, URL: `{{calUrl}}{{uuid}}.ics`, Body: `BEGIN:VCALENDAR...` (Construct ICS format). |
| 4. Check Result | `If` | Check HTTP 201 Created. If 409/Error → Output Error JSON. |
| 5. Notify HA | `HTTP Request` | Call HA API `/api/services/notify/mobile_app_andre` with "Event created". |
| 6. Respond | `Respond to Webhook` | Return schema with `eventId`. |

**Risks**: Timezone mismatch. Ensure FamilyHub sends UTC or explicit offsets.

### WF-002: calendar.query
**Purpose**: Query events for a time range.
**Trigger**: Webhook (POST) → Filter `body.workflow == 'calendar.query'`

| Step | Node Type | Configuration Notes |
|---|---|---|
| 1. Defaults | `Set` | If `start`/`end` missing, set to Now / Now+7d. |
| 2. Query Cal | `HTTP Request` | Method: `REPORT`. Body: CalDAV XML `<c:calendar-query>`. |
| 3. Parse XML | `XML to JSON` | Built-in node or `Code` node for robust parsing. |
| 4. Normalize | `Code` | Transform complex CalDAV structure into flat JSON List `[{summary, start, end}]`. |
| 5. Respond | `Respond to Webhook` | Return JSON List. |

### WF-003: reminder.schedule
**Purpose**: Schedule a notification for the future.
**Trigger**: Webhook (POST) → Filter `body.workflow == 'reminder.schedule'`

| Step | Node Type | Configuration Notes |
|---|---|---|
| 1. Calc Delay | `Date & Time` | Calculate difference between `now` and `triggerAt`. |
| 2. Ack | `Respond to Webhook` | Send "Scheduled" success immediately (don't keep HTTP open). |
| 3. Wait | `Wait` | Mode: `Resume on specific date` or `After time interval`. |
| 4. Notify | `HTTP Request` | Call HA Notify service. |

---

## 4. Prioritization & Roadmap

1.  **Phase 1 (Critical)**: `WF-001` (Create) & `WF-003` (Reminders). These involve mutations and time logic (FamilyHub Weaknesses).
2.  **Phase 2 (Functionality)**: `WF-002` (Query). FamilyHub can currently read simple sources, but n8n robustifies it.

## 5. Deliverable Summary
- **Architecture**: n8n Gateway Model.
- **Contract**: JSON Envelope.
- **Workflows**: Defined with Standard Nodes.
