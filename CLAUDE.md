# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektphilosophie

**FamilyHub ist ein langfristiges, persönliches Haussystem** – kein Produkt, kein Dashboard, kein Assistent.

Leitprinzip: **Calm Intelligence** – Das beste System ist das, das man nicht mehr bemerkt.

### Kernregeln für alle Code-Änderungen

**NIEMALS:**
- Funktionalität erweitern ohne explizite Anweisung
- Architektur "verbessern", wenn sie bereits funktioniert
- Code "modernisieren", nur weil es möglich ist
- Visuelle Änderungen ohne klaren Nutzen einführen
- Annahmen über Nutzerpräferenzen treffen

**ERLAUBT:**
- Bugs beheben, die Nutzer wirklich spüren
- Inkonsistenzen entfernen
- Barrieren abbauen (a11y, Verständlichkeit)
- Dinge vereinfachen
- Nichts tun, wenn alles gut ist ✓

**Code-Haltung:**
- Weniger Code > eleganter Code
- Langweilige Lösungen > clevere Lösungen
- Lesbarkeit > Abstraktion
- Stabilität > Flexibilität

Siehe `AGENT_FOUNDATION.md` für vollständige Details.

---

## Build & Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server (localhost:3000)
npm run build            # Production build
npm start                # Start production server

# Testing
npm test                 # Run Jest unit tests
npm run test:watch       # Jest in watch mode

# Linting & UI
npm run lint             # Run ESLint
npm run storybook        # Start Storybook (localhost:6006)
npm run build-storybook  # Build Storybook static site

# Docker Deployment (target platform)
docker compose up -d --build
```

---

## High-Level Architecture

### Tech Stack
- **Next.js 16** (App Router) + **React 19** (mit React Compiler)
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** (PostCSS-Plugin)
- **n8n** als externes Chat Backbone (Webhooks)
- **CalDAV** (tsdav) für Kalender-Integration
- **iCal.js** für Event-Parsing

### Verzeichnisstruktur

```
/app                      # Next.js App Router (Server-side)
├── api/
│   ├── chat/route.ts     # POST /api/chat → n8n Webhook-Proxy
│   ├── calendar/route.ts # CalDAV CRUD API (GET/POST/PUT/DELETE)
│   └── weather/route.ts  # Weather API (mock)
├── layout.tsx            # Root Layout mit Metadaten
└── page.tsx              # Root Page (wraps Provider)

/src
├── components/           # React-Komponenten
│   ├── shell/            # Layout-Container (HubShell, NavigationRail, Section)
│   ├── zones/            # Hauptbereiche (AmbientCanvas, FluidStage, InputDeck, OrientationHeader, StatusRail)
│   └── widgets/          # Dashboard-Widgets (Calendar, Task, Activity, Context, Weather)
├── lib/
│   ├── api/              # API-Services (calendarSync, fetchWeather)
│   ├── contexts/         # React Context (FamilyHubContext, AgentRuntimeContext)
│   ├── hooks/            # Custom Hooks (useUiInteraction)
│   ├── contracts/        # TypeScript-Interfaces (agents.ts, calendar.ts, context.ts, weather.ts)
│   ├── ui/               # UI-Utilities (sendChatMessage)
│   ├── data/             # Mock-Daten (mockCalendar, mockTasks, mockContext)
│   └── context/          # Context-Utilities (getContextSnapshot)
├── stories/              # Storybook-Stories
└── _legacy/              # Deprecated Code (NICHT importieren)

/docs/n8n/                # n8n-Workflow-Dokumentation
```

### Path Aliases (tsconfig.json)
- `@/app/*` → `./app/*`
- `@/*` → `./src/*`

---

## State Management (Context-basiert)

### 1. FamilyHubContext (Globaler App-State)
**Location:** `src/lib/contexts/FamilyHubContext.tsx`

**Managed:**
- Aktuelle Zeit, Datum, Tagesphase (`dayPhase: morning|afternoon|evening|night`)
- UI-Modus (`uiMode: calm|nerdy|manga`)
- Präsenz (`presence: {home: boolean}`)

**Updates:** Automatisch jede Minute via `useEffect` Timer

**Usage:**
```typescript
const { context, setUiMode, addAgentResponse } = useFamilyHub();
```

### 2. AgentRuntimeContext (Chat & Interaction State)
**Location:** `src/lib/contexts/AgentRuntimeContext.tsx`

**Managed:**
- Chat-Nachrichtenverlauf (`messages: AgentResponse[]`)
- Aktivitätsstatus (`activityStatus: idle|sending|waiting_for_response|error`)
- UI-Zustand (`uiState: idle|chat|awaiting_action`)

**State Machine (via `useUiInteraction` Hook):**
```
idle → startInteraction() → chat → scheduleIdleReturn() → idle
     → setActionPending() → awaiting_action → resetToIdle() → idle
```

**Auto-Reset:** 15 Sekunden nach letzter Interaktion zurück zu `idle`

**Usage:**
```typescript
const { state, uiState, pushResponse } = useAgentRuntime();
```

---

## n8n Chat Integration (Wichtig!)

### Flow
```
User Input (InputDeck)
    ↓
sendChatMessage() → POST /api/chat/route.ts
    ↓
Forwards to N8N_CHAT_BACKBONE_URL (env var)
    ↓
n8n Workflow (WF-300) processes message
    ↓
Response → AgentRuntimeContext.pushResponse()
    ↓
FluidStage re-renders
```

### API Contract (`/api/chat`)
**Request:**
```json
{
  "message": "Benutzer-Nachricht",
  "context": {
    "date": "2026-01-28",
    "time": "14:30:00",
    "dayPhase": "afternoon",
    "uiMode": "calm"
  }
}
```

**Response:**
```json
{
  "type": "chat|error|action_request",
  "role": "assistant|user",
  "text": "Antwort-Text",
  "actionResult": {"type": "...", "payload": {...}},
  "meta": {
    "source": "FamilyHub|n8n",
    "requestId": "uuid",
    "durationMs": 123,
    "workflow": "WF-300"
  }
}
```

**Error Handling:**
- HTTP 400: Ungültige Payload
- HTTP 502: n8n Webhook-Fehler
- HTTP 504: Timeout (15s)
- HTTP 500: Netzwerk-/Serverfehler

**Environment Variables:**
```env
N8N_CHAT_BACKBONE_URL=http://192.168.178.20:5678/webhook/familyhub/chat-backbone
```

**Dokumentation:** Siehe `docs/n8n/README.md` für Workflow-Details (WF-102, WF-103, WF-300, WF-201B)

---

## CalDAV/Calendar Integration

### Service: CalendarSync
**Location:** `src/lib/api/calendarSync.ts`

**Features:**
- CalDAV-Protokoll via `tsdav` Library
- Mock-Modus für Offline-Entwicklung (`USE_MOCK_DATA=true`)
- Parst iCal-Format zu `CalendarEvent` Objekten

### API Routes: `/api/calendar`
- **GET** `?start=2026-01-28&end=2026-02-04` → Liste von Events
- **POST** → Create Event
- **PUT** → Update Event
- **DELETE** → Delete Event

**Environment Variables:**
```env
CALDAV_URL=https://your-baikal-server/dav/calendars/user/calendar/
CALDAV_USERNAME=user
CALDAV_PASSWORD=pass
USE_MOCK_DATA=false  # true für Mock-Daten
```

**Type Contract** (`src/lib/contracts/calendar.ts`):
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: string;      // ISO date
  end: string;        // ISO date
  allDay: boolean;
  calendar: string;
  source: 'caldav' | 'mock' | 'error';
  location?: string;
  recurrence?: {...};
  attendees?: string[];
}
```

---

## UI State Machine

### 3 Haupt-Zustände (`uiState`)

1. **`idle`**: Dashboard-Ansicht
   - Zeigt: AmbientCanvas mit Kalender, Tasks, Activity Feed
   - Komponente: `FluidStage` rendert Dashboard-Widgets

2. **`chat`**: Aktive Konversation
   - Zeigt: Chat-Historie mit Message-Bubbles
   - Komponente: `FluidStage` rendert Chat-Liste

3. **`awaiting_action`**: Aktion-Bestätigung
   - Zeigt: Confirmation Prompt für destruktive Aktionen
   - Komponente: `ActionConfirmationCard`

### Transitions (via `useUiInteraction`)
```typescript
startInteraction()      // → chat
setActionPending()      // → awaiting_action
scheduleIdleReturn()    // Queue idle-return nach 15s
resetToIdle()           // Sofort zurück zu idle
```

---

## Styling & Theming

### Tailwind CSS v4 (PostCSS-basiert)
- Config: `postcss.config.mjs`
- Globals: `app/globals.css`

### CSS Custom Properties (Theme)
```css
--valur-red: #d02020           /* Brand-Farbe */
--interaction-blue: #0070f3    /* CTA/Interaction */
--accent-gold: #ffb400         /* Accent */

--background-dark: #0f172a     /* Page BG (Slate 900) */
--surface-dark: #1e293b        /* Component BG (Slate 800) */
--surface-highlight: #334155   /* Hover/Active (Slate 700) */
--border: #1f2933              /* Border */

--text-primary: #e5e7eb        /* Main Text (Gray 200) */
--text-secondary: #9ca3af      /* Secondary (Gray 400) */
```

**Usage:** `bg-[var(--surface-dark)]`, `text-[var(--text-primary)]`

### Animationen
- `fadeIn`: Opacity-Transition
- `slideUp`: Slide + Fade
- `scaleIn`: Scale + Bounce

**Usage:** Tailwind's `animate-in` utilities

---

## Type Contracts (wichtige Interfaces)

### AgentResponse (`src/lib/contracts/agents.ts`)
```typescript
interface AgentResponse {
  type: 'chat' | 'action_request' | 'clarification_needed' | 'error';
  role: 'assistant' | 'user';
  text: string;
  actionResult?: { type: string; payload: unknown };
  requiresConfirmation?: boolean;
  meta?: { source?, requestId?, durationMs?, ...};
}
```

### ContextSnapshot (`src/lib/contracts/context.ts`)
```typescript
interface ContextSnapshot {
  date: string;              // YYYY-MM-DD
  time: string;              // HH:mm:ss
  dayPhase: 'morning' | 'afternoon' | 'evening' | 'night';
  dayType: 'schoolDay' | 'weekend' | 'schoolHoliday' | 'holiday';
  regionalHoliday: string | null;
  schoolHolidayRange: {start, end} | null;
  uiMode: 'calm' | 'nerdy' | 'manga';
  presence: {home: boolean};
}
```

**Generator:** `src/lib/context/getContextSnapshot.ts` (für n8n Context-Forwarding)

---

## Testing

```bash
npm test                # Jest Unit Tests
npm run test:watch      # Jest Watch Mode
npm run storybook       # Storybook für Component-Tests
```

**Test-Setup:**
- Jest mit JSDOM Environment (`jest.setup.js`)
- Testing Library für React-Tests
- Vitest mit Playwright für Browser-Tests
- Tests neben Dateien als `.test.ts` oder in `__tests__/`

---

## Architektur-Entscheidungen (Key Design Choices)

| Entscheidung | Rationale | Location |
|--------------|-----------|----------|
| **Context statt Redux** | Einfacher für kleine App | `FamilyHubContext`, `AgentRuntimeContext` |
| **n8n Webhook Integration** | Trennt AI-Logik von Frontend | `app/api/chat/route.ts` |
| **Mock-Modus** | Offline-Entwicklung, Testing | `USE_MOCK_DATA` in Services |
| **Zone-basiertes Layout** | Klare Separation (ambient/fluid/input) | Shell-Komponenten |
| **CSS Custom Properties** | Theme-Flexibilität ohne CSS-in-JS | `app/globals.css` |
| **Strict TypeScript** | Frühe Bug-Erkennung | `tsconfig.json` strict: true |
| **React Compiler** | Performance-Optimierung | `next.config.ts` reactCompiler: true |

---

## Legacy Code

**`src/_legacy/`** enthält alte, nicht mehr verwendete Code (seit Dez 2025):
- `agents/`: Alte TypeScript-Agent-Logik (Router, Calendar, Explain)
- `ai/`: Alte Intent-Classifier & LLM-Provider

**⚠️ NICHT importieren!** Diese Dateien sind via `tsconfig.json` ausgeschlossen.

Alle Chat-Logik ist jetzt in `app/api/chat/route.ts` → n8n konsolidiert.

---

## Workflow: Feature hinzufügen

1. **Komponente erstellen:** `src/components/{shell|widgets|zones}/YourComponent.tsx`
2. **Type-Contract definieren:** `src/lib/contracts/yourtype.ts`
3. **API-Route (falls nötig):** `app/api/yourfeature/route.ts`
4. **Context anbinden:** `useFamilyHub()` oder `useAgentRuntime()`
5. **Styling:** Tailwind + CSS-Variablen
6. **Storybook Story:** `src/stories/YourComponent.stories.tsx`
7. **Tests:** Jest oder Storybook-Tests

**Vor jeder Änderung:** Lies `AGENT_FOUNDATION.md` – ist das wirklich nötig?

---

## Environment Variables

```env
# n8n Integration
N8N_CHAT_BACKBONE_URL=http://192.168.178.20:5678/webhook/familyhub/chat-backbone
N8N_WEBHOOK_URL=http://192.168.178.20:5678/webhook/familyhub/...
N8N_CALENDAR_READ_GOOGLE_URL=...

# CalDAV (Baïkal)
CALDAV_URL=https://your-baikal-server/dav/calendars/user/calendar/
CALDAV_USERNAME=your_username
CALDAV_PASSWORD=your_password

# Weather (OpenWeatherMap)
OPENWEATHER_API_KEY=your_api_key_here

# Development
USE_MOCK_DATA=false  # true für Offline-Entwicklung
NODE_ENV=development|production
```

**Lokale Entwicklung:** `.env.local` (nicht im Git)

---

## Deployment (Target Platform)

```bash
git pull
docker compose up -d --build
```

**Docker Config:** `docker-compose.yml` (Port 3000, Production Build)

**Build-Modus:** Next.js Standalone Output (`next.config.ts`: `output: 'standalone'`)
