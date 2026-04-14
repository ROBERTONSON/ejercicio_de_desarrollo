# SOP: RBAC Architecture (Role-Based Access Control)

## Goal
Implement a rigid 3-tier authorization model (Viewer, Analyst, Admin) across the SOC Dashboard to restrict data mutation and ensure operational security per Project Constitution Behavioral Rule #7.

## Roles & Capabilities

| Role | Responsibility | Capabilities |
|------|----------------|--------------|
| **Admin** | Full system oversight | Full Read/Write. Override locks. Delete/Assign any incident. Escalate, reassign, create/delete. |
| **Analyst** | Triage and investigation | Read all. Write ONLY on assigned incidents + self-assignment. |
| **Viewer** | Monitoring and awareness | Read-only access. Full Dashboard visibility, zero mutation access. |

## Implementation Logic

1. **Hierarchy Integer Mapping `(Viewer=0, Analyst=1, Admin=2)`**:
   Used in `hasMinRole()` to determine if a user hits the base threshold for an action.

2. **Assignment Checks (`requiresAssignment: true`)**:
   Even if an Analyst has the `change_status` capability, the function `canPerform()` checks if `incident.assigneeId === currentUser.id`. If not, access is denied.

3. **Routing (`<ProtectedRoute />`)**:
   Intercepts page-level access before rendering. If unauthorized, routes to `/forbidden`. 
   *Note: Dashboard and list endpoints are open to Viewer+.*

4. **Component Guards (`<Can />`)**:
   Conditionally renders buttons, dropdowns, and input areas.

## Exceptions & Edge Cases
- **Admin Override**: `Admin` roles bypass all `requiresAssignment` and `lock` checks explicitly.
- **Null User State**: An unauthenticated state rejects all `canPerform` checks globally.
