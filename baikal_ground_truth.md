# Baikal CalDAV – Ground Truth

## Auth
- **Type**: Digest Authentication (`WWW-Authenticate: Digest realm="BaikalDAV"`)
- **Credentials**: `fjoelnir` / `{{PASSWORD}}`
- **User Principal**: `fjoelnir` (observed in URL path)

## Write Path
- **Method**: `PUT`
- **URL**: `http://192.168.178.99/dav.php/calendars/fjoelnir/valur/{uid}.ics`
- **Header**: `Content-Type: text/calendar; charset=utf-8`
- **Body**: Standard VCALENDAR 2.0 with VEVENT.
- **Success Status**: `201 Created`
- **Update Status**: `204 No Content` (if over-writing)

## Read Path (Time Range)
- **Method**: `REPORT`
- **URL**: `http://192.168.178.99/dav.php/calendars/fjoelnir/valur/`
- **Header**: `Content-Type: application/xml; charset=utf-8`
- **Header**: `Depth: 1`
- **Body**: `<c:calendar-query>` with `<c:time-range>` filter. (Standard CalDAV)
- **Response**: `207 Multi-Status` containing `<d:response>` elements with calendar data.

## Alternative Read (File Direct)
- **Method**: `GET`
- **URL**: `http://192.168.178.99/dav.php/calendars/fjoelnir/valur/{uid}.ics`
- **Response**: `200 OK` + raw ICS content.

## Implementation Notes
- The server is **SabreDAV 4.7.0**.
- `Expect: 100-continue` header from curl *may* cause issues in some environments; `Content-Length` should be non-zero.
- **IMPORTANT**: When implementing in clients (n8n/Node), ensure the XML body is sent correctly with `application/xml` content type. Empty body results in `500 Internal Server Error (Sabre\Xml\ParseException)`.
