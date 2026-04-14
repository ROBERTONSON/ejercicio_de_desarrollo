# gemini.md — Project Constitution

> **This file is LAW.** All data schemas, behavioral rules, and architectural invariants are defined here.  
> Only update when: a schema changes, a rule is added, or architecture is modified.

---

## Data Schema

### Input Schema — Application State (Mock Database)

```json
{
  "users": [
    {
      "id": "string (UUID)",
      "username": "string",
      "displayName": "string",
      "email": "string",
      "role": "viewer | analyst | admin",
      "avatar": "string (URL or initials fallback)",
      "isActive": "boolean",
      "createdAt": "string (ISO-8601)"
    }
  ],
  "incidents": [
    {
      "id": "string (UUID)",
      "title": "string",
      "description": "string",
      "severity": "critical | high | medium | low",
      "status": "open | investigating | escalated | resolved | closed",
      "assigneeId": "string (UUID, nullable)",
      "reportedBy": "string (UUID)",
      "createdAt": "string (ISO-8601)",
      "updatedAt": "string (ISO-8601)",
      "lockedBy": "string (UUID, nullable)",
      "lockedAt": "string (ISO-8601, nullable)",
      "tags": ["string"],
      "affectedSystems": ["string"],
      "notes": [
        {
          "id": "string (UUID)",
          "authorId": "string (UUID)",
          "content": "string (sanitized)",
          "createdAt": "string (ISO-8601)"
        }
      ]
    }
  ],
  "auditLog": [
    {
      "id": "string (UUID)",
      "incidentId": "string (UUID)",
      "actorId": "string (UUID)",
      "action": "status_change | assignment_change | note_added | severity_change | lock_acquired | lock_released | incident_created",
      "previousValue": "string | null",
      "newValue": "string",
      "timestamp": "string (ISO-8601)",
      "metadata": "object (optional context)"
    }
  ]
}
```

### Output Schema — UI Payload

```json
{
  "dashboard": {
    "totalIncidents": "number",
    "openIncidents": "number",
    "criticalIncidents": "number",
    "mttr": {
      "value": "number (hours)",
      "trend": "up | down | stable",
      "previousPeriod": "number (hours)"
    },
    "volumeBySeverity": {
      "critical": "number",
      "high": "number",
      "medium": "number",
      "low": "number"
    },
    "volumeByStatus": {
      "open": "number",
      "investigating": "number",
      "escalated": "number",
      "resolved": "number",
      "closed": "number"
    },
    "recentActivity": ["AuditLog entries (last 10)"],
    "incidentTrend": [
      {
        "date": "string (ISO-8601 date)",
        "count": "number"
      }
    ]
  },
  "incidentList": {
    "items": ["Incident objects with computed fields"],
    "filters": {
      "severity": "string[]",
      "status": "string[]",
      "assignee": "string (UUID, optional)",
      "search": "string (optional)"
    },
    "sort": {
      "field": "string",
      "direction": "asc | desc"
    },
    "pagination": {
      "page": "number",
      "pageSize": "number",
      "total": "number"
    }
  },
  "incidentDetail": {
    "incident": "Full Incident object",
    "auditTimeline": ["AuditLog entries for this incident, chronological"],
    "isLocked": "boolean",
    "canEdit": "boolean (computed from role + lock state)"
  }
}
```

---

## Behavioral Rules

1. **Data-First Rule:** No tool code is written until the Data Schema above is confirmed.
2. **Self-Annealing:** On failure → Analyze stack trace → Patch → Test → Update architecture SOP.
3. **Deliverables vs. Intermediates:**
   - `.tmp/` = ephemeral (scraped data, logs, temp files)
   - Cloud/Payload = permanent (Sheets, DBs, UI updates)
4. **Golden Rule:** If logic changes, update the SOP in `architecture/` **before** updating code in `tools/`.
5. **Atomic Tools:** Every script in `tools/` must be deterministic, atomic, and independently testable.
6. **Exclusividad de Acción:** Un incidente NO puede ser editado por dos usuarios al mismo tiempo. El campo `lockedBy` implementa bloqueo de registro.
7. **Jerarquía de Roles (RBAC):**
   - `viewer`: Solo lectura. Bloqueo total de POST/PATCH/DELETE.
   - `analyst`: Escritura limitada a incidentes asignados, notas propias y auto-asignación.
   - `admin`: Acceso total + capacidad de Override sobre locks.
8. **Sanitización Estricta:** Todo input de texto (notas, descripciones) debe pasar por DOMPurify o equivalente para prevenir XSS.
9. **Persistencia de Auditoría:** Todo cambio de `status`, `assigneeId`, `severity`, o adición de notas genera automáticamente una entrada en `auditLog` con timestamp ISO-8601. El auditLog es **append-only** — nunca se modifica ni elimina una entrada existente.

---

## Architectural Invariants

### 3-Layer Architecture

| Layer | Location | Purpose |
|-------|----------|---------|
| **Layer 1: Architecture** | `architecture/` | Technical SOPs in Markdown — goals, inputs, tool logic, edge cases |
| **Layer 2: Navigation** | Reasoning layer | Routes data between SOPs and Tools — no complex execution |
| **Layer 3: Tools** | `tools/` | Deterministic Python scripts — atomic and testable |

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18+** | UI framework (SPA) |
| **Vite** | Build tool / dev server |
| **Tailwind CSS** | Utility-first styling (dark theme default) |
| **shadcn/ui** | Component primitives (Table, Card, Badge, Dialog, etc.) |
| **React Router v6** | Client-side routing with protected routes |
| **React Context** | Global state management (users, incidents, audit log) |
| **Recharts** | Data visualization (MTTR, severity distribution, trends) |
| **DOMPurify** | XSS sanitization for user inputs |
| **date-fns** | Date formatting (ISO-8601) |

### File Structure

```
proyecto/
├── gemini.md              # Project Constitution (THIS FILE)
├── task_plan.md            # Phases, goals, checklists
├── findings.md             # Research, discoveries, constraints
├── progress.md             # Activity log, errors, tests
├── .env                    # Environment variables / API tokens
├── architecture/           # Layer 1 — Technical SOPs
│   ├── sop-rbac.md         # RBAC logic and role definitions
│   ├── sop-audit-log.md    # Audit log append-only patterns
│   ├── sop-incident-mgmt.md# Incident lifecycle and locking
│   └── sop-sanitization.md # Input sanitization rules
├── tools/                  # Layer 3 — React SPA source
│   └── soc-dashboard/      # Vite + React project
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── contexts/    # React Context providers
│       │   ├── data/        # Mock JSON data
│       │   ├── hooks/       # Custom hooks (usePermissions, useAudit)
│       │   ├── lib/         # Utilities (sanitize, permissions, etc.)
│       │   ├── pages/       # Route-level page components
│       │   └── App.jsx      # Root component with Router
│       ├── tailwind.config.js
│       ├── package.json
│       └── vite.config.js
└── .tmp/                   # Intermediate / ephemeral files
```

---

## Maintenance Log

> Will be finalized in Phase 5 (Trigger/Deployment).

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-13 | Initialized Project Constitution — Protocol 0 |
| 2026-04-13 | Data Schema defined (Input: users/incidents/auditLog, Output: dashboard/list/detail). Behavioral rules expanded with RBAC, sanitization, lock, and audit rules. Tech stack defined. |
