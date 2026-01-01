# Architekturbeschreibung

## *FamilyHub Capability Router Architecture (ab Phase I-2)*

### Ziel der Architektur

FamilyHub soll **kein Entscheider** mehr sein, sondern ein **stabiler Transportlayer**.
Alle semantischen Entscheidungen („Was will der Nutzer?“) und alle Fähigkeiten („Was kann das System?“) leben **ausschließlich in n8n**.

---

## Gesamtübersicht

```
[ UI ]
   ↓
[ FamilyHub Backend ]
   ↓  (dumb pipe)
[ WF.300.chat.backbone.v2 ]
   ↓
[ WF.310.capability.router.v1 ]
   ├─ WF.320.calendar.read.v1
   ├─ WF.330.mail.read.v1
   ├─ WF.340.notes.create.v1
   └─ WF.399.fallback.chat.v1
```

---

## Verantwortlichkeiten (strikt)

### FamilyHub Backend

**Darf:**

* Requests validieren (Payload vorhanden?)
* requestId erzeugen
* An *einen* n8n-Endpunkt weiterleiten
* Antwort 1:1 zurückgeben

**Darf NICHT:**

* Keywords erkennen
* Capabilities auswählen
* Workflows unterscheiden
* Feature-Logik enthalten

➡️ *FamilyHub = Leitung, nicht Gehirn*

---

### WF.300.chat.backbone

**Rolle:** Stabiler Einstiegspunkt

**Aufgaben:**

* Einheitliches Request-Schema erzwingen
* Weiterleitung an Capability Router (WF.310)

**Garantien:**

* Antwortet **immer**
* Bricht nie still ab
* Liefert konsistentes JSON

---

### WF.310.capability.router

**Rolle:** Zentrale Entscheidungsinstanz

**Aufgaben:**

* Nutzerintention erkennen
* Genau **eine** Capability auswählen
* Confidence bestimmen
* Bei Unsicherheit → Fallback

**Wichtig:**

* Router liefert **keine Fachlogik**
* Router kennt nur *Namen* von Capabilities

---

### Capability Workflows (WF.32x, WF.33x, …) v1

**Rolle:** Reine Funktionsmodule

**Aufgaben:**

* Eine klar definierte Fähigkeit ausführen
* Strukturierte Daten zurückgeben
* Keine Chat-Texte generieren

➡️ *Capabilities sprechen Daten, nicht Sprache.*

---

### WF.399.fallback.chat

**Rolle:** Sicherheitsnetz

**Wann genutzt:**

* Keine Capability erkannt
* Confidence zu niedrig
* Fehler in Capability

**Aufgabe:**

* Immer eine sinnvolle Chat-Antwort liefern

---

## Datenvertrag (verbindlich)

### Einheitlicher Input (an alle Capabilities)

```json
{
  "requestId": "uuid",
  "message": "User input",
  "context": {}
}
```

### Einheitlicher Output (von allen Workflows)

```json
{
  "status": "ok | error",
  "reply": "Chat-Antwort (optional)",
  "actionResult": {
    "type": "calendar_events | none",
    "payload": {}
  },
  "meta": {
    "workflow": "WF.xxx.v1",
    "confidence": 0.0
  }
}
```
