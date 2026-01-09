# Rollen- und Verantwortlichkeitsmatrix (MCP-orientiert)

Diese Matrix beschreibt die klar getrennten Rollen, Verantwortlichkeiten und Grenzen im FamilyHub-Ökosystem. Sie dient als **architektonische Referenz** und als spätere Grundlage für eine MCP-Implementierung.

---

## Überblick

Leitprinzip:
**Kein Akteur darf gleichzeitig entscheiden, ausführen und darstellen.**

---

## Rolle 1: Human Operator (Souverän)

**Beispiele:** Fjölnir

**Verantwortung**

* Zieldefinition
* Priorisierung
* Freigabe strategischer Entscheidungen
* Bewertung von Ergebnissen

**Darf**

* Architektur ändern
* Capabilities erlauben oder verbieten
* Entscheidungen final freigeben

**Darf nicht**

* Teil der Runtime sein
* Automatisierte Aktionen ausführen

---

## Rolle 2: External Advisor

**Beispiele:** ChatGPT

**Verantwortung**

* Architekturdenken
* Systemische Analyse
* Identifikation von Anti-Patterns
* Strukturierung komplexer Entscheidungen

**Darf**

* Vorschläge machen
* Alternativen aufzeigen
* Risiken benennen

**Darf nicht**

* Entscheidungen treffen
* Capabilities nutzen
* Teil von Runtime-Flows sein

---

## Rolle 3a: Planning / Reasoning Agent

**Beispiele:** Antigravity (Planner) auf PC

**Verantwortung**

* Analyse
* Planung
* Architekturvorschläge
* Ableitung von Handlungsabsichten

**Darf**

* Capabilities entdecken
* Tool-Aufrufe anfragen (über MCP)
* Ergebnisse interpretieren

**Darf nicht**

* Capabilities selbst ausführen
* Eigene Arbeit final abnehmen

---

## Rolle 3b: Verification / Testing Agent

**Beispiele:** Antigravity (Verifier) auf Laptop

**Verantwortung**

* Erstellen von Testfällen
* Durchführen von Tests (UI, Flow, Integration)
* Validierung von Abnahmekriterien

**Darf**

* Systeme benutzen
* Klickpfade ausführen
* Testberichte erstellen

**Darf nicht**

* Lösungen entwerfen
* Architektur ändern
* Eigene Tests relativieren

---

## Rolle 4: Inference Engine

**Beispiele:** Ollama (192.168.178.40), LM Studio

**Verantwortung**

* Reine Inferenz
* Textverarbeitung
* Klassifikation, Zusammenfassung

**Darf**

* Text generieren
* Muster erkennen

**Darf nicht**

* Entscheidungen treffen
* Capabilities auswählen
* Systemzustände kennen

---

## Rolle 5: Orchestrator / Tool Server

**Beispiele:** n8n (192.168.178.20 / n8n.valur.site)

**Verantwortung**

* Ausführung von Capabilities
* Zugriff auf reale Systeme (Kalender, Listen, APIs)
* Fehlerbehandlung auf Tool-Ebene

**Darf**

* Lesen und Schreiben
* Systeme verbinden

**Darf nicht**

* Entscheidungen treffen
* UI-Logik enthalten

---

## Rolle 6: Runtime Environment

**Beispiele:** Docker Desktop (PC/Laptop), Docker Host (192.168.178.26)

**Verantwortung**

* Isolation
* Stabilität
* Reproduzierbarkeit

**Darf**

* Services hosten

**Darf nicht**

* Logik enthalten
* Entscheidungen treffen

---

## Rolle 7: User Interface

**Beispiele:** FamilyHub (hub.valur.site)

**Verantwortung**

* Darstellung
* Interaktion
* Kontextualisierung für Menschen
* Einholen expliziter Zustimmung

**Darf**

* Anzeigen
* Fragen
* Ergebnisse rendern

**Darf nicht**

* Capabilities ausführen
* Entscheidungen treffen
* Text als Aktion interpretieren

---

## Kontrollregel

Bei jeder neuen Idee müssen folgende Fragen eindeutig beantwortet sein:

1. Wer entscheidet?
2. Wer führt aus?
3. Wer sieht das Ergebnis?
4. Wer trägt die Verantwortung bei Fehlern?

Mehrfachzuordnungen deuten auf einen Architekturfehler hin.
