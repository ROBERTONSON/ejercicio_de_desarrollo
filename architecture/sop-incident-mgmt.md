# SOP: Incident Lifecycle & Locking

## Goal
Manage the transition states of cybersecurity incidents while enforcing an "Action Exclusivity" (Exclusividad de Acción) constraint via explicit locks to prevent concurrent Analyst collision (Behavioral Rule #6).

## Status Lifecycle

Allowed `status` transitions:
`open` → `investigating` → `escalated` → `resolved` → `closed`
*(Note: Sandbox permits arbitrary jumping between these states for demonstration, but production SIEMs would lock the state progression).*

## Locking Mechanisms

An Incident object contains:
- `lockedBy`: `userId` or `null`
- `lockedAt`: ISO-8601 timestamp

1. **Acquiring a Lock (`acquireLock`)**:
   - Only permitted if `lockedBy` is `null`.
   - Analyst must explicitly click "Acquire Edit Lock" to begin working.
   
2. **Mutations while Locked (`canEditIncident`)**:
   - If `lockedBy !== currentUser.id`, all interactive elements (status dropdowns, severity, notes) are disabled.
   - Return `{ canEdit: false, reason: "Incident is locked by another user" }`.

3. **Releasing a Lock (`releaseLock`)**:
   - The user who holds the lock clicks "Release Edit Lock".
   - Sets `lockedBy: null`.

4. **Admin Override (`forceReleaseLock`)**:
   - Resolves deadlocks (e.g., Analyst goes home early without releasing lock).
   - Generates an `adminOverride: true` metadata flag in the Audit Log when triggered.
