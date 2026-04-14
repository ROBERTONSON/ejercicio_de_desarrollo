# SOP: Append-Only Audit Log

## Goal
Enforce an immutable trail of actions within the SOC Dashboard, capturing status changes, note additions, reassignments, and security-critical mutations (Behavioral Rule #9).

## Data Structure

Every action appended must adhere strictly to the following schema:
```javascript
{
  id: string,               // Generated aud-<uuid>
  incidentId: string,       // The affected incident
  actorId: string,          // The user performing the action
  action: string,           // Strict enum: 'status_change', 'note_added', etc.
  previousValue: any,       // The state BEFORE the mutation
  newValue: any,            // The state AFTER the mutation
  timestamp: string,        // ISO-8601 strict format
  metadata: object          // Optional context (e.g., noteId)
}
```

## Immutability Logic

1. **Context Isolation**: The `AuditContext` explicitly omits `updateEntry` and `deleteEntry` methodologies.
2. **Read Methods**: Exposes only `getEntriesForIncident(id)` and `getRecentEntries(count)`.
3. **Execution Point**: The `useIncidents` hook automatically binds `addEntry` to all of its state-mutating functions (`createIncident`, `updateStatus`, `addNote`, `acquireLock`). This ensures developers cannot accidentally mutate an incident without creating an audit trail.

## Edge Cases
- **Simultaneous edits**: (Simulated) Prevented by lock acquisition, meaning parallel overlapping audit entries for the same mutation are synthetically mitigated.
