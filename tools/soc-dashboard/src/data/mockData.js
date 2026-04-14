// Mock data seed — simulates relational database
// Schema defined in gemini.md (Project Constitution)

export const users = [
  {
    id: 'usr-001',
    username: 'cruiz',
    displayName: 'Carlos Ruiz',
    email: 'carlos.ruiz@soc-ops.com',
    role: 'admin',
    avatar: null,
    isActive: true,
    createdAt: '2025-06-15T08:00:00Z'
  },
  {
    id: 'usr-002',
    username: 'mlopez',
    displayName: 'María López',
    email: 'maria.lopez@soc-ops.com',
    role: 'analyst',
    avatar: null,
    isActive: true,
    createdAt: '2025-07-20T09:30:00Z'
  },
  {
    id: 'usr-003',
    username: 'jgarcia',
    displayName: 'Juan García',
    email: 'juan.garcia@soc-ops.com',
    role: 'viewer',
    avatar: null,
    isActive: true,
    createdAt: '2025-09-01T10:00:00Z'
  }
];

export const incidents = [
  {
    id: 'inc-001',
    title: 'Ransomware Detection — Finance Server',
    description: 'Suspicious file encryption activity detected on finance-srv-03. Multiple .locked file extensions observed across shared directories. Endpoint protection triggered alerts at 02:14 UTC.',
    severity: 'critical',
    status: 'investigating',
    assigneeId: 'usr-002',
    reportedBy: 'usr-001',
    createdAt: '2026-04-12T02:14:00Z',
    updatedAt: '2026-04-12T06:30:00Z',
    lockedBy: 'usr-002',
    lockedAt: '2026-04-12T06:25:00Z',
    tags: ['ransomware', 'encryption', 'finance'],
    affectedSystems: ['finance-srv-03', 'nas-finance-01'],
    notes: [
      {
        id: 'note-001',
        authorId: 'usr-002',
        content: 'Isolated finance-srv-03 from network. Beginning forensic analysis on encrypted files.',
        createdAt: '2026-04-12T03:00:00Z'
      },
      {
        id: 'note-002',
        authorId: 'usr-001',
        content: 'Escalated to CISO. Legal team notified. Backup integrity being verified.',
        createdAt: '2026-04-12T04:15:00Z'
      }
    ]
  },
  {
    id: 'inc-002',
    title: 'Brute Force Attack — SSH Gateway',
    description: 'Over 15,000 failed SSH login attempts detected from IP range 185.220.x.x targeting bastion-01. Rate limiting triggered but attack is ongoing.',
    severity: 'high',
    status: 'contained',
    assigneeId: 'usr-002',
    reportedBy: 'usr-002',
    createdAt: '2026-04-11T14:22:00Z',
    updatedAt: '2026-04-12T10:00:00Z',
    lockedBy: null,
    lockedAt: null,
    tags: ['brute-force', 'ssh', 'external'],
    affectedSystems: ['bastion-01'],
    notes: [
      {
        id: 'note-003',
        authorId: 'usr-002',
        content: 'Blocked IP range 185.220.0.0/16 at perimeter firewall. Monitoring for rotation.',
        createdAt: '2026-04-11T15:00:00Z'
      }
    ]
  },
  {
    id: 'inc-003',
    title: 'Phishing Campaign — Executive Targets',
    description: 'Coordinated phishing attempt targeting C-suite via spoofed vendor emails. 3 of 12 recipients clicked the link. Credential harvesting page detected.',
    severity: 'high',
    status: 'investigating',
    assigneeId: 'usr-002',
    reportedBy: 'usr-001',
    createdAt: '2026-04-10T09:45:00Z',
    updatedAt: '2026-04-11T16:00:00Z',
    lockedBy: null,
    lockedAt: null,
    tags: ['phishing', 'social-engineering', 'executive'],
    affectedSystems: ['email-gw-01', 'o365-tenant'],
    notes: [
      {
        id: 'note-004',
        authorId: 'usr-001',
        content: 'Forced password reset for affected accounts. MFA verification ongoing.',
        createdAt: '2026-04-10T11:00:00Z'
      }
    ]
  },
  {
    id: 'inc-004',
    title: 'Unauthorized API Access — Customer Portal',
    description: 'Anomalous API call patterns detected from authenticated session. User session hijacking suspected via stolen JWT token.',
    severity: 'critical',
    status: 'open',
    assigneeId: null,
    reportedBy: 'usr-002',
    createdAt: '2026-04-13T01:30:00Z',
    updatedAt: '2026-04-13T01:30:00Z',
    lockedBy: null,
    lockedAt: null,
    tags: ['api', 'session-hijacking', 'jwt'],
    affectedSystems: ['api-gw-02', 'customer-portal'],
    notes: []
  },
  {
    id: 'inc-005',
    title: 'DNS Tunneling — Internal Workstation',
    description: 'Suspicious DNS query patterns from workstation WS-DEV-042. High volume of TXT record queries to unusual domains suggest data exfiltration via DNS tunneling.',
    severity: 'medium',
    status: 'investigating',
    assigneeId: 'usr-002',
    reportedBy: 'usr-002',
    createdAt: '2026-04-09T17:20:00Z',
    updatedAt: '2026-04-10T08:00:00Z',
    lockedBy: null,
    lockedAt: null,
    tags: ['dns-tunneling', 'exfiltration', 'internal'],
    affectedSystems: ['ws-dev-042', 'dns-srv-01'],
    notes: [
      {
        id: 'note-005',
        authorId: 'usr-002',
        content: 'Captured DNS logs for analysis. Identified 47 unique domains used in tunneling pattern.',
        createdAt: '2026-04-09T18:30:00Z'
      }
    ]
  },
  {
    id: 'inc-006',
    title: 'Malware — Marketing USB Device',
    description: 'USB device connected by marketing intern triggered malware detection. Emotet variant identified. Device quarantined by EDR.',
    severity: 'medium',
    status: 'resolved',
    assigneeId: 'usr-002',
    reportedBy: 'usr-001',
    createdAt: '2026-04-08T11:00:00Z',
    updatedAt: '2026-04-09T14:00:00Z',
    lockedBy: null,
    lockedAt: null,
    tags: ['malware', 'usb', 'emotet'],
    affectedSystems: ['ws-mkt-007'],
    notes: [
      {
        id: 'note-006',
        authorId: 'usr-002',
        content: 'Full system scan completed. No lateral movement detected. USB policy reminder sent to department.',
        createdAt: '2026-04-09T13:00:00Z'
      }
    ]
  },
  {
    id: 'inc-007',
    title: 'Certificate Expiration — Production Load Balancer',
    description: 'TLS certificate for *.soc-ops.com expires in 48 hours. Auto-renewal failed due to DNS validation issue.',
    severity: 'low',
    status: 'resolved',
    assigneeId: 'usr-001',
    reportedBy: 'usr-001',
    createdAt: '2026-04-07T08:00:00Z',
    updatedAt: '2026-04-07T12:00:00Z',
    lockedBy: null,
    lockedAt: null,
    tags: ['certificate', 'tls', 'infrastructure'],
    affectedSystems: ['lb-prod-01'],
    notes: [
      {
        id: 'note-007',
        authorId: 'usr-001',
        content: 'Manual renewal completed. DNS records updated. Auto-renewal re-configured.',
        createdAt: '2026-04-07T11:30:00Z'
      }
    ]
  },
  {
    id: 'inc-008',
    title: 'DDoS Attack — Public Website',
    description: 'Volumetric DDoS targeting www.soc-ops.com. Peak traffic at 45 Gbps. CDN mitigations activated.',
    severity: 'high',
    status: 'closed',
    assigneeId: 'usr-001',
    reportedBy: 'usr-002',
    createdAt: '2026-04-05T20:00:00Z',
    updatedAt: '2026-04-06T08:00:00Z',
    lockedBy: null,
    lockedAt: null,
    tags: ['ddos', 'volumetric', 'cdn'],
    affectedSystems: ['cdn-edge-01', 'www-srv-01'],
    notes: [
      {
        id: 'note-008',
        authorId: 'usr-001',
        content: 'CDN scrubbing center absorbed attack. Origin servers unaffected. Post-mortem scheduled.',
        createdAt: '2026-04-06T02:00:00Z'
      }
    ]
  },
  {
    id: 'inc-009',
    title: 'Privilege Escalation — Dev Environment',
    description: 'Developer account granted admin privileges via misconfigured IAM policy. Detected during routine access review.',
    severity: 'medium',
    status: 'closed',
    assigneeId: 'usr-001',
    reportedBy: 'usr-001',
    createdAt: '2026-04-04T10:00:00Z',
    updatedAt: '2026-04-04T14:00:00Z',
    lockedBy: null,
    lockedAt: null,
    tags: ['privilege-escalation', 'iam', 'misconfiguration'],
    affectedSystems: ['iam-prod', 'dev-env-01'],
    notes: [
      {
        id: 'note-009',
        authorId: 'usr-001',
        content: 'IAM policy corrected. Access review process updated to run weekly instead of monthly.',
        createdAt: '2026-04-04T13:00:00Z'
      }
    ]
  },
  {
    id: 'inc-010',
    title: 'Suspicious Login — VPN Gateway',
    description: 'Successful VPN login from unusual geographic location (Eastern Europe) for user account that typically connects from LATAM.',
    severity: 'low',
    status: 'open',
    assigneeId: null,
    reportedBy: 'usr-002',
    createdAt: '2026-04-13T07:00:00Z',
    updatedAt: '2026-04-13T07:00:00Z',
    lockedBy: null,
    lockedAt: null,
    tags: ['suspicious-login', 'vpn', 'geolocation'],
    affectedSystems: ['vpn-gw-01'],
    notes: []
  }
];

export const auditLog = [
  {
    id: 'aud-001',
    incidentId: 'inc-001',
    actorId: 'usr-001',
    action: 'incident_created',
    previousValue: null,
    newValue: 'Ransomware Detection — Finance Server',
    timestamp: '2026-04-12T02:14:00Z',
    metadata: { severity: 'critical' }
  },
  {
    id: 'aud-002',
    incidentId: 'inc-001',
    actorId: 'usr-001',
    action: 'assignment_change',
    previousValue: null,
    newValue: 'usr-002',
    timestamp: '2026-04-12T02:20:00Z',
    metadata: {}
  },
  {
    id: 'aud-003',
    incidentId: 'inc-001',
    actorId: 'usr-002',
    action: 'status_change',
    previousValue: 'open',
    newValue: 'investigating',
    timestamp: '2026-04-12T02:45:00Z',
    metadata: {}
  },
  {
    id: 'aud-004',
    incidentId: 'inc-001',
    actorId: 'usr-002',
    action: 'note_added',
    previousValue: null,
    newValue: 'Isolated finance-srv-03 from network.',
    timestamp: '2026-04-12T03:00:00Z',
    metadata: { noteId: 'note-001' }
  },
  {
    id: 'aud-005',
    incidentId: 'inc-001',
    actorId: 'usr-001',
    action: 'note_added',
    previousValue: null,
    newValue: 'Escalated to CISO. Legal team notified.',
    timestamp: '2026-04-12T04:15:00Z',
    metadata: { noteId: 'note-002' }
  },
  {
    id: 'aud-006',
    incidentId: 'inc-001',
    actorId: 'usr-002',
    action: 'lock_acquired',
    previousValue: null,
    newValue: 'usr-002',
    timestamp: '2026-04-12T06:25:00Z',
    metadata: {}
  },
  {
    id: 'aud-007',
    incidentId: 'inc-002',
    actorId: 'usr-002',
    action: 'incident_created',
    previousValue: null,
    newValue: 'Brute Force Attack — SSH Gateway',
    timestamp: '2026-04-11T14:22:00Z',
    metadata: { severity: 'high' }
  },
  {
    id: 'aud-008',
    incidentId: 'inc-002',
    actorId: 'usr-002',
    action: 'status_change',
    previousValue: 'open',
    newValue: 'investigating',
    timestamp: '2026-04-11T14:30:00Z',
    metadata: {}
  },
  {
    id: 'aud-009',
    incidentId: 'inc-002',
    actorId: 'usr-002',
    action: 'note_added',
    previousValue: null,
    newValue: 'Blocked IP range 185.220.0.0/16.',
    timestamp: '2026-04-11T15:00:00Z',
    metadata: { noteId: 'note-003' }
  },
  {
    id: 'aud-010',
    incidentId: 'inc-002',
    actorId: 'usr-002',
    action: 'status_change',
    previousValue: 'investigating',
    newValue: 'contained',
    timestamp: '2026-04-12T10:00:00Z',
    metadata: {}
  },
  {
    id: 'aud-011',
    incidentId: 'inc-003',
    actorId: 'usr-001',
    action: 'incident_created',
    previousValue: null,
    newValue: 'Phishing Campaign — Executive Targets',
    timestamp: '2026-04-10T09:45:00Z',
    metadata: { severity: 'high' }
  },
  {
    id: 'aud-012',
    incidentId: 'inc-003',
    actorId: 'usr-001',
    action: 'assignment_change',
    previousValue: null,
    newValue: 'usr-002',
    timestamp: '2026-04-10T09:50:00Z',
    metadata: {}
  },
  {
    id: 'aud-013',
    incidentId: 'inc-003',
    actorId: 'usr-001',
    action: 'note_added',
    previousValue: null,
    newValue: 'Forced password reset for affected accounts.',
    timestamp: '2026-04-10T11:00:00Z',
    metadata: { noteId: 'note-004' }
  },
  {
    id: 'aud-014',
    incidentId: 'inc-004',
    actorId: 'usr-002',
    action: 'incident_created',
    previousValue: null,
    newValue: 'Unauthorized API Access — Customer Portal',
    timestamp: '2026-04-13T01:30:00Z',
    metadata: { severity: 'critical' }
  },
  {
    id: 'aud-015',
    incidentId: 'inc-005',
    actorId: 'usr-002',
    action: 'incident_created',
    previousValue: null,
    newValue: 'DNS Tunneling — Internal Workstation',
    timestamp: '2026-04-09T17:20:00Z',
    metadata: { severity: 'medium' }
  },
  {
    id: 'aud-016',
    incidentId: 'inc-006',
    actorId: 'usr-001',
    action: 'incident_created',
    previousValue: null,
    newValue: 'Malware — Marketing USB Device',
    timestamp: '2026-04-08T11:00:00Z',
    metadata: { severity: 'medium' }
  },
  {
    id: 'aud-017',
    incidentId: 'inc-006',
    actorId: 'usr-002',
    action: 'status_change',
    previousValue: 'investigating',
    newValue: 'resolved',
    timestamp: '2026-04-09T14:00:00Z',
    metadata: {}
  },
  {
    id: 'aud-018',
    incidentId: 'inc-007',
    actorId: 'usr-001',
    action: 'incident_created',
    previousValue: null,
    newValue: 'Certificate Expiration — Production Load Balancer',
    timestamp: '2026-04-07T08:00:00Z',
    metadata: { severity: 'low' }
  },
  {
    id: 'aud-019',
    incidentId: 'inc-007',
    actorId: 'usr-001',
    action: 'status_change',
    previousValue: 'open',
    newValue: 'resolved',
    timestamp: '2026-04-07T12:00:00Z',
    metadata: {}
  },
  {
    id: 'aud-020',
    incidentId: 'inc-008',
    actorId: 'usr-002',
    action: 'incident_created',
    previousValue: null,
    newValue: 'DDoS Attack — Public Website',
    timestamp: '2026-04-05T20:00:00Z',
    metadata: { severity: 'high' }
  },
  {
    id: 'aud-021',
    incidentId: 'inc-008',
    actorId: 'usr-001',
    action: 'status_change',
    previousValue: 'contained',
    newValue: 'closed',
    timestamp: '2026-04-06T08:00:00Z',
    metadata: {}
  },
  {
    id: 'aud-022',
    incidentId: 'inc-009',
    actorId: 'usr-001',
    action: 'incident_created',
    previousValue: null,
    newValue: 'Privilege Escalation — Dev Environment',
    timestamp: '2026-04-04T10:00:00Z',
    metadata: { severity: 'medium' }
  },
  {
    id: 'aud-023',
    incidentId: 'inc-009',
    actorId: 'usr-001',
    action: 'status_change',
    previousValue: 'resolved',
    newValue: 'closed',
    timestamp: '2026-04-04T14:00:00Z',
    metadata: {}
  },
  {
    id: 'aud-024',
    incidentId: 'inc-010',
    actorId: 'usr-002',
    action: 'incident_created',
    previousValue: null,
    newValue: 'Suspicious Login — VPN Gateway',
    timestamp: '2026-04-13T07:00:00Z',
    metadata: { severity: 'low' }
  }
];
