# Task Plan — BLAST Framework: SOC Dashboard

> **Status:** 🟢 Phase 4 Completed — System Online

---

## Phase 0: Initialization ✅
- [x] Create `task_plan.md`
- [x] Create `findings.md`
- [x] Create `progress.md`
- [x] Create `gemini.md` (Project Constitution)
- [x] Create directory structure (`tools/`, `architecture/`, `.tmp/`)
- [x] Halt execution — no scripts until Blueprint approved

## Phase 1: B — Blueprint (Vision & Logic) ✅
- [x] Ask Discovery Questions (5 questions)
- [x] Receive and document answers in `findings.md`
- [x] Define JSON Data Schema (Input/Output) in `gemini.md`
- [x] Research: GitHub repos, RBAC patterns, audit log patterns, UI stack
- [x] Document research in `findings.md`
- [x] **USER APPROVAL: Confirm Data Schema and Blueprint**
- [x] Confirm Tailwind CSS version preference (v4 used for latest Vite config)

## Phase 2: L — Link (Connectivity) ✅
- [x] Initialize Vite + React project in `tools/soc-dashboard/`
- [x] Install dependencies (Tailwind 4, React Router, Recharts, DOMPurify, date-fns)
- [x] Configure Tailwind dark theme + custom design tokens (`index.css`)
- [x] Verify dev server runs successfully

## Phase 3: A — Architect (The 3-Layer Build) ✅
- [x] **Layer 1 — SOPs:**
  - [x] `architecture/sop-rbac.md` — Role hierarchy, permission matrix, route protection
  - [x] `architecture/sop-audit-log.md` — Append-only event model, action types
  - [x] `architecture/sop-incident-mgmt.md` — Lifecycle, statuses, locking, assignment
  - [x] `architecture/sop-sanitization.md` — XSS rules, DOMPurify config
- [x] **Layer 3 — Tools (React components):**
  - [x] `data/` — Mock JSON seed data (users, incidents, audit entries)
  - [x] `contexts/` — AuthContext, IncidentContext, AuditContext
  - [x] `lib/` — permissions.js, sanitize.js, utils.js
  - [x] `hooks/` — usePermissions
  - [x] `components/` — Layout, Sidebar, Header, IncidentTable, Badge, StatusChip, ProtectedRoute, Can
  - [x] `pages/` — LoginPage, DashboardPage, IncidentListPage, IncidentDetailPage, ForceUnlock, ForbiddenPage

## Phase 4: S — Stylize (Refinement & UI) ✅
- [x] Dark theme cybersecurity aesthetic (dark grays, custom palette from branding docs)
- [x] Responsive layout (desktop-first, fluid containers)
- [x] Micro-animations: fade-ins, stagger children, critical pulse
- [x] Professional severity color mapping (red/critical, orange/high, yellow/medium, blue/low)
- [x] Recharts integration for dashboard metrics (Bar chart for severity)
- [x] Present stylized results for user testing

## Phase 5: T — Trigger (Deployment)
- [ ] Production build + optimization (`npm run build`)
- [ ] Documentation — Maintenance Log in `gemini.md`
- [ ] Deployment strategy (TBD with user)

---

## Blueprint

### 🎯 North Star
A functional, reactive SOC Dashboard that centralizes incident management with RBAC and immutable audit logging, enabling analysts to visualize and act on threats in real-time.

### 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React SPA (Vite)                      │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ AuthCtx  │  │ IncidentCtx  │  │    AuditCtx       │  │
│  │ (RBAC)   │  │ (CRUD+Lock)  │  │ (Append-Only Log) │  │
│  └────┬─────┘  └──────┬───────┘  └────────┬──────────┘  │
│       │               │                   │              │
│  ┌────▼───────────────▼───────────────────▼──────────┐  │
│  │              React Router v6                       │  │
│  │  /login  /dashboard  /incidents  /incidents/:id    │  │
│  └────────────────────┬──────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼──────────────────────────────┐  │
│  │         Component Layer (shadcn/ui-inspired)       │  │
│  │  Sidebar │ Header │ Tables │ Cards │ Badges │ etc. │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Utility Layer (lib/)                       │  │
│  │  permissions.js │ sanitize.js │ audit.js │ utils   │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```
