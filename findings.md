# Findings — BLAST Framework

> Research, discoveries, and constraints are logged here.

---

## Discovery Answers

| # | Question | Answer |
|---|----------|--------|
| 1 | **North Star** | Dashboard SOC funcional y reactivo que centralice gestión de incidentes. Analistas visualizan y actúan sobre amenazas en tiempo real. RBAC + AuditLog inmutable. |
| 2 | **Integrations** | Sin APIs externas inicialmente (arquitectura desacoplada para futuras conexiones SIEM: Splunk/Elastic). Firecrawl MCP para extracción visual. Shadcn/React UI. |
| 3 | **Source of Truth** | Estado Global (React Context / Local State) alimentado por JSON schema robusto definido en `gemini.md`. Simula BD relacional: incidentes ↔ usuarios ↔ audit logs. |
| 4 | **Delivery Payload** | SPA React + Tailwind CSS + variables centralizadas. Rutas protegidas. Panel métricas (MTTR, volumen). Timeline de auditoría en vista detalle. |
| 5 | **Behavioral Rules** | Exclusividad de acción (lock de registro). Jerarquía: Viewer (solo lectura) → Analyst (escritura limitada) → Admin (acceso total + override). Sanitización XSS. AuditLog automático con ISO-8601. |

---

## Research

### SOC Dashboard References

- **joupify/soc-cert-dashboard** (GitHub) — Open source SOC/CERT dashboard for incident tracking and certificate management. Useful reference architecture.

### RBAC Best Practices (React)

- **Centralize permissions** via Context API or Zustand — avoid scattered `if (role === 'admin')` checks.
- Use `<Can permission={...}>` component pattern for clean JSX.
- Use `ProtectedRoute` wrapper for route-level enforcement.
- Disable vs. Hide strategy depending on feature visibility needs.
- **Frontend RBAC is UX only** — real enforcement must be backend-side (for our mock, we simulate server validation in our state layer).

### Immutable Audit Log Patterns

- **Event Producer Model**: Frontend emits structured events → API validates → Append-only storage.
- For our mock: Use a reducer-based pattern where audit entries are **append-only** (no update/delete actions on the audit state).
- Each entry includes: `actor_id`, `action`, `resource_id`, `previous_value`, `new_value`, `timestamp` (ISO-8601).
- Hash chaining (optional stretch goal): Include hash of previous entry for tamper detection.

### UI Stack (shadcn/ui + Tailwind)

- **Dark theme by default** — standard for SOC environments (long monitoring shifts).
- Key components: `Table`, `Card`, `Sidebar`, `Badge`, `Dialog`, `Sheet`, `Select`.
- Pair with **Recharts** for metrics visualization (MTTR graphs, severity distribution).
- Pair with **TanStack Table** for sortable/filterable incident lists.
- **React Hook Form + Zod** for validated input forms.

---

## Constraints & Edge Cases

| Constraint | Detail |
|------------|--------|
| No backend | All data is mock JSON in React state. Audit log immutability is simulated via append-only reducer. |
| XSS sanitization | Must sanitize all user text inputs (notes, descriptions). Use DOMPurify or equivalent. |
| Record locking | Simulated — incident editing sets a `locked_by` field. Other users see it as read-only. |
| Concurrent access | Not truly supported (single browser). Lock is a UX simulation for demonstration. |
| Tailwind CSS | User explicitly requested. Need to confirm version (v3 vs v4). |
| Shadcn/UI | Copy-paste model — components will be added to the project source. |

---

## Changelog

| Date | Entry |
|------|-------|
| 2026-04-13 | Initialized `findings.md` — Protocol 0 complete. |
| 2026-04-13 | Discovery answers recorded. Research completed (SOC refs, RBAC, audit logs, UI stack). |
