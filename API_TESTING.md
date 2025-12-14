# API Testing Guide

This guide describes how to test the newly created API endpoints for the Valur Family Hub using `curl`.

## Weather API

### Get Current Weather
Retrieves mock weather data.

```bash
curl http://localhost:3000/api/weather
```

**Expected Response (JSON):**
```json
{
  "locationName": "New York",
  "temperature": 72,
  "condition": "Partly Cloudy",
  "icon": "partly-cloudy-day",
  "forecast": [...]
}
```

## Calendar API

### List Events
Retrieves all calendar events.

```bash
curl http://localhost:3000/api/calendar
```

### Create Event
Adds a new event.

```bash
curl -X POST http://localhost:3000/api/calendar \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Meeting", "start": "2024-01-01T10:00:00Z", "end": "2024-01-01T11:00:00Z"}'
```

### Update Event
Updates an existing event. Replace `YOUR_EVENT_ID` with an ID from the list response (e.g. '1').

```bash
curl -X PUT http://localhost:3000/api/calendar \
  -H "Content-Type: application/json" \
  -d '{"id": "1", "title": "Updated Meeting Title"}'
```

### Delete Event
Deletes an event by ID.

```bash
curl -X DELETE "http://localhost:3000/api/calendar?id=1"
```
