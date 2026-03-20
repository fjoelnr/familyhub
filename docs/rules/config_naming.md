# Konfigurations- & Naming-Regeln

## *Workflow, Dokumente & Artefakte*

### Verbindliches Naming-Schema

```
<GRUPPE>.<Thema>.<Aktion>[.<Detail>]
```

### Gruppen (fix)

| Gruppe | Bedeutung            |
| ------ | -------------------- |
| WF.300 | Backbone & Transport |
| WF.310 | Routing / Decision   |
| WF.320 | Calendar             |
| WF.330 | Mail                 |
| WF.340 | Notes / Knowledge    |
| WF.399 | Fallback             |

---

### Beispiele (rückwirkend gültig)

| Alt                          | Neu                      |
| ---------------------------- | ------------------------ |
| WF_201G_CALENDAR_READ_GOOGLE | **WF.320.calendar.read** |
| WF_300_CHAT_BACKBONE         | **WF.300.chat.backbone** |
| irgendein Kalenderworkflow   | **WF.320.calendar.***    |

➡️ Alte Namen dürfen vorerst bleiben, **müssen aber dokumentiert gemappt werden**.

---

### Dokumentationsstruktur (verbindlich)

```
docs/
 ├─ architecture/
 │   └─ capability_router.md
 ├─ naming/
 │   └─ workflows.md
 ├─ n8n/
 │   └─ WF.xxx.<name>.md
```

---

### Konfigurationsregeln

* **Keine Credentials** in JSON
* **Keine IPs** im Code, nur ENV
* Jede Capability:

  * genau **eine Aufgabe**
  * genau **ein Output-Typ**
* Kein Workflow darf:

  * mehrere Capabilities kombinieren
  * Entscheidungen „heimlich“ treffen
