# Resource & Workflow Allocation Report: FamilyHub

## 1. Resource Inventory

| Name | Typ | Endpoint/IP | Stabilitätsgrad | Zugriffstyp | Latenz | Single Source of Truth? |
|------|-----|-------------|-----------------|-------------|--------|-------------------------|
| **FamilyHub** | UI + Brain (Agent Router) | N/A (Localhost) | Usable (Dev) | Read/Write | <10ms | ❌ (Aggregator) |
| **Ollama** | AI Backend (Logic/NLU) | `192.168.178.40:11434` | Stable | Read-Only | ~200-500ms | ❌ (Processor) |
| **OpenAI** | AI Backend (Fallback) | Cloud API | Stable | Read-Only | ~500ms+ | ❌ (Processor) |
| **n8n** | Workflow Engine | `192.168.178.20:5678` | Stable (Prod) | Event-Driven / Webhook | ~50-100ms | ❌ (Orchestrator) |
| **Home Assistant** | State Authority / IoT | `192.168.178.23:8123` | Stable (Prod) | Read/Write/Event | ~20-50ms | ✅ (House State) |
| **Baikal** | Data Source (Cal/Card) | `192.168.178.99` | Stable (Prod) | Read/Write (Dav) | ~20-50ms | ✅ (Calendar/Contacts) |
| **AdGuard** | Infrastructure | `192.168.178.0/24` | Stable | Network | <1ms | ✅ (DNS) |

---

## 2. Requirements Mapping

| Resource | Relevante Requirements | Status | Anmerkung |
|----------|------------------------|--------|-----------|
| **FamilyHub** | SR-001 (Agent Arch), UR-001..007 (UI), AR-001 (Intent) | 🟢 Erfüllbar | Kernverantwortung für UI und "Brain". |
| **n8n** | SR-003 (Safe Execution), NFR-003 (Degradation) | 🟢 Erfüllbar | Ideal für komplexe Aktionsketten nach Bestätigung. |
| **Home Assistant**| UR-002 (Calm -> Context), NFR-003 | 🟢 Erfüllbar | Liefert Haus-Kontext (Anwesenheit, Zeit, Events). |
| **Ollama** | AR-001 (Classification), AR-003 (Orchestration) | 🟢 Erfüllbar | Lokale Intelligenz. |
| **Baikal** | AR-002 (Calendar Agent) | 🟡 Teils | Daten sind da, Integrationslogik derzeit (zu) komplex in FamilyHub. |

---

## 3. Capability Allocation (Soll-Architektur)

### 🧠 FamilyHub Core Intelligence
*Verantwortlich für: "Verstehen, Planen und Bestätigen"*
*   **Intent Understanding**: Was will der User? (Parsing via Ollama).
*   **Kontextbildung**: Aggregation von Zeit, Ort (aus HA) und User-Status.
*   **Entscheidungslogik**: Soll ich nachfragen? Fehlen Informationen?
*   **UI / Interaktion**: Darstellung des Chats, der Bestätigungs-Dialoge (SR-003) und Feedback.
*   **CalDAV Read (Simple)**: Schnelles Lesen des heutigen Tages für das Dashboard (Latenz-Gründe).

### ⚙️ n8n Workflow / Automation
*Verantwortlich für: "Ausführen, Verbinden und Reagieren"*
*   **Komplexe Kalender-Mutationen**: "Neuen Termin anlegen und Partner benachrichtigen".
*   **Benachrichtigungen (Fan-out)**: Email, Push, Haus-Durchsage parallel.
*   **Verkettungen**: "Wenn Termin 'Urlaub' erstellt, dann Heizung absenken (via HA)".
*   **Fehler-Handling**: Retry-Logik, wenn Baikal kurz weg ist.
*   **Langläufer**: "Erinnere mich in 2 Stunden" (Timer läuft in n8n, nicht im Browser).

### 🏠 Home Assistant
*Verantwortlich für: "Wahrheit und Physis"*
*   **Anwesenheit**: Wer ist zuhause?
*   **Haus-Zustand**: Ist das Licht an? Wie warm ist es?
*   **Trigger**: Tür geht auf, Sonne geht unter.
*   **Aktoren**: Licht schalten (via Befehl von n8n oder FamilyHub).

---

## 4. n8n Workflow-Skizzen

### Workflow A: "Neuer Termin mit Konsequenzen"
*Ziel: Termin anlegen und ggf. Vorbereitungen treffen.*
1.  **Trigger**: Webhook von FamilyHub (`POST /webhook/calendar/create`) mit Payload `{ title, start, end, category }`.
2.  **Logic**:
    *   Node: CalDAV (Create Event in Baikal).
    *   Switch: Wenn `category == 'travel'`, dann...
    *   Action: Home Assistant (Setze 'Pre-Travel Mode').
3.  **Response**: JSON an FamilyHub (`{ status: 'success', id: '...' }`).

### Workflow B: "Morgen-Briefing Vorbereitung"
*Ziel: Daten aggregieren, damit FamilyHub sie nur anzeigen muss.*
1.  **Trigger**: Zeitplan (Täglich 06:00).
2.  **Logic**:
    *   Get Calendar (Baikal, Heute).
    *   Get Weather (Home Assistant).
    *   Get Trash Schedule (Home Assistant / Local Integration).
    *   LLM (Ollama): "Fasse den Tag zusammen".
3.  **Result**: Speichern in einer lokalen Variable/Cache oder Push an FamilyHub (via Server-Sent Events wenn vorhanden, sonst Polling-Ready in DB).

---

## 5. Gaps & Risiken

1.  **Redundanz im Kalender-Zugriff**: FamilyHub hat aktuell `calendarSync.ts` (eigener CalDAV Client). Ein paralleler n8n-Workflow könnte zu Race Conditions führen oder doppelter I/O-Logik.
    *   *Risiko*: Wartbarkeit der TypeScript CalDAV-Implementierung ist hoch.
2.  **Fehlende Kontakte-Integration**: Baikal hat Kontakte, aber FamilyHub nutzt sie noch nicht.
    *   *Gap*: Soll FamilyHub CardDAV selbst sprechen oder einfach n8n fragen "Wer hat heute Geburtstag?"
3.  **Zustandshoheit**: Wenn FamilyHub einen internen State (State Machine) pflegt, der nicht mit Home Assistant abgeglichen ist (z.B. "User schläft"), entstehen Inkonsistenzen.

---

## 6. Ergänzungsvorschläge für `familyhub.toml`

Empfehlung zur Aufnahme in `familyhub.toml`, um die n8n-Rolle zu formalisieren:

```toml
[resources.n8n]
role = "Automation & Execution Layer"
endpoint = "http://192.168.178.20:5678"
responsibility = ["Complex Actions", "Notifications", "System Glues"]

[capabilities.calendar]
read_fast_path = "FamilyHub -> Baikal (Direct)"
write_complex_path = "FamilyHub -> n8n -> Baikal"
```
