# Forensic Integration Report: WF-201 CalDAV

**Status**: CRITICAL FAILURE
**Agent**: Forensic Integration Assistant
**Date**: 2025-12-25
**Subject**: Discrepancy between Manual Curl (Success) and n8n Workflow (Failure)

---

## A. CalDAV Ground Truth (Bestätigung)

Basierend auf der Analyse von `curl_read_today.sh` (Source of Truth):

- **URL**: `http://192.168.178.99/dav.php/calendars/fjoelnir/valur/`
- **HTTP-Methode**: `REPORT`
- **Auth-Methode**: **Digest Authentication** (`--digest`)
- **Header**:
    - `Content-Type: application/xml; charset=utf-8`
    - `Depth: 1`
- **Request-Body**:
    ```xml
    <c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
        <d:prop>
            <d:getetag />
            <c:calendar-data />
        </d:prop>
        <c:filter>
            <c:comp-filter name="VCALENDAR">
                <c:comp-filter name="VEVENT">
                    <c:time-range start="..." end="..."/>
                </c:comp-filter>
            </c:comp-filter>
        </c:filter>
    </c:calendar-query>
    ```

---

## B. n8n HTTP Request Node – Realität

Analyse des Nodes "CalDAV Query" aus `WF_201_CALENDAR_READ.json`:

- **Node-Typ**: `n8n-nodes-base.httpRequest` (Version 4.1)
- **Konfiguration**:
    - **Method**: `REPORT` (Expression: `={{ 'REPORT' }}`)
    - **URL**: `http://192.168.178.99/dav.php/calendars/fjoelnir/valur/`
    - **Auth-Type**: **Basic Auth** (`authentication: "basicAuth"`)
    - **Header**:
        - `Content-Type`: `application/xml; charset=utf-8`
        - `Depth`: `1`
    - **Body-Mode**: RAW / XML (`sendBody: true`, `contentType: "raw"`, `rawContentType: "application/xml..."`)
    - **Internal Transformation**: n8n sendet den Body als String-Expression.

**Diskrepanz-Analyse**:
1.  **Auth**: Ground Truth verlangt explizit **Digest**. n8n sendet **Basic**.
2.  **Method**: Beide nutzen `REPORT`.
3.  **Hinweis**: n8n unterstützt Digest Auth im HTTP Request Node prinzipiell, aber die Kombination aus `REPORT` Method + Body + Digest Auth ist oft problematisch, da n8n (oder die zugrunde liegende Library) den Body beim Initial Challenge (401) manchmal verwirft, bevor der autorisierte Request gesendet wird.

---

## C. Konkrete Fehlersignale

**Status**: ❌ NICHT VERIFIZIERBAR (Kein Zugriff auf Logs)

Aufgrund fehlender Berechtigungen (`docker logs` failed, `logs/` directory missing) und fehlender historischer Debug-Dateien (`WF_201_CALENDAR_READ_debug.md` missing) können keine exakten Statuscodes aus der n8n-Instanz extrahiert werden.

**Logische Ableitung**:
Da Baikal typischerweise Digest erwartet (siehe curl script) und n8n Basic sendet, ist ein **HTTP 401 Unauthorized** der wahrscheinlichste Fehler, sofern Baikal nicht explizit für Basic freigeschaltet wurde.

---

## D. Annahmen & Unsicherheiten

- **Annahme**: Der `curl_read_today.sh` Script funktioniert aktuell tatsächlich (konnte mangels Credentials nicht "live" ausgeführt werden, wird aber als Ground Truth behandelt).
- **Unsicherheit**: Ob Baikal *nur* Digest akzeptiert oder auch Basic erlauben würde (Server-Config unbekannt).
- **Unsicherheit**: Ob n8n bei Umstellung auf "Digest Auth" den XML-Body korrekt bei `REPORT` mitsendet (bekanntes Verhalten bei manchen Clients: Body wird beim ersten "Unauthorized" Response verworfen und beim zweiten "Authorized" Request nicht erneut gesendet).

---

## E. n8n-Limitierungen

- **HTTP Request Node**:
    - Unterstützt `REPORT`: **Ja** (via Custom Method).
    - Unterstützt Digest Auth: **Ja**.
    - **Bekanntes Problem**: Kombination aus **Digest Auth** + **Custom Method (REPORT)** + **Body payload**. Viele HTTP-Libraries scheitern hier beim automatischen Re-Send des Bodies nach dem Auth-Challenge.

---

## F. Entscheidungsvorbereitung

1.  **Wahrscheinlichste Ursache**:
    Auth-Mismatch. Baikal verlangt Digest (bewiesen durch curl), n8n sendet Basic.

2.  **Zweitwahrscheinlichste Ursache**:
    Falls n8n auf Digest umgestellt wird: Verlust des XML-Bodies während des Digest-Handshakes (Library-Limitierung).

3.  **Technisch sauberste nächste Option**:
    **Custom HTTP (raw)** oder **Eigenen Mini-Service**.
    Da Standard-Nodes bei "Digest + Body + Custom Method" oft unzuverlässig sind, ist ein simpler `curl`-Wrapper (via Execute Command Node, falls erlaubt) oder ein dedizierter Microservice oft stabiler als das Debuggen des n8n-Request-Nodes in Randfällen.

---
**Ende des Reports.**
