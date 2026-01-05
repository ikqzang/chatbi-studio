import type {
  ReportTemplate,
  Schedule,
  ExecutionRun,
  DeliveryLog,
  AuditEvent,
  Recipient,
  RecipientGroup,
  OrgConfig,
} from '@/types/reports';

// ============= Mock Recipients =============

export const mockUsers: Recipient[] = [
  { id: 'u1', type: 'user', name: 'John Smith', email: 'john.smith@company.com' },
  { id: 'u2', type: 'user', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
  { id: 'u3', type: 'user', name: 'Michael Chen', email: 'michael.chen@company.com' },
  { id: 'u4', type: 'user', name: 'Emily Davis', email: 'emily.davis@company.com' },
  { id: 'u5', type: 'user', name: 'Robert Wilson', email: 'robert.wilson@company.com' },
  { id: 'u6', type: 'user', name: 'Lisa Anderson', email: 'lisa.anderson@company.com' },
];

export const mockGroups: RecipientGroup[] = [
  {
    id: 'g1',
    name: 'Executive Team',
    members: [mockUsers[0], mockUsers[1], mockUsers[4]],
  },
  {
    id: 'g2',
    name: 'Sales Team',
    members: [mockUsers[2], mockUsers[3]],
  },
  {
    id: 'g3',
    name: 'Marketing Team',
    members: [mockUsers[3], mockUsers[5]],
  },
];

export const mockRecipients: Recipient[] = [
  ...mockUsers,
  { id: 'g1', type: 'group', name: 'Executive Team', memberCount: 3 },
  { id: 'g2', type: 'group', name: 'Sales Team', memberCount: 2 },
  { id: 'g3', type: 'group', name: 'Marketing Team', memberCount: 2 },
];

// ============= Mock Templates =============

export const mockTemplates: ReportTemplate[] = [
  {
    id: 't1',
    name: 'Weekly Sales Performance',
    description: 'Comprehensive weekly sales metrics including revenue, pipeline, and team performance.',
    source: 'dashboard',
    sourceId: 'd1',
    charts: [
      { id: 'c1', title: 'Revenue Trend', type: 'line', dimensions: ['date'], metrics: ['revenue'], dataSourceId: 'ds1' },
      { id: 'c2', title: 'Sales by Region', type: 'bar', dimensions: ['region'], metrics: ['sales'], dataSourceId: 'ds1' },
      { id: 'c3', title: 'Top Products', type: 'bar', dimensions: ['product'], metrics: ['units_sold'], dataSourceId: 'ds1' },
      { id: 'c4', title: 'Customer Growth', type: 'area', dimensions: ['month'], metrics: ['customers'], dataSourceId: 'ds1' },
    ],
    layout: { columns: 2, chartOrder: ['c1', 'c2', 'c3', 'c4'] },
    tags: ['sales', 'weekly', 'executive'],
    createdAt: '2024-12-15T10:30:00Z',
    createdBy: 'John Smith',
    updatedAt: '2024-12-20T14:45:00Z',
  },
  {
    id: 't2',
    name: 'Marketing Campaign ROI',
    description: 'Monthly marketing performance analysis with ROI breakdown by channel.',
    source: 'dashboard',
    sourceId: 'd2',
    charts: [
      { id: 'c5', title: 'Campaign Performance', type: 'bar', dimensions: ['campaign'], metrics: ['conversions', 'spend'], dataSourceId: 'ds2' },
      { id: 'c6', title: 'Channel ROI', type: 'pie', dimensions: ['channel'], metrics: ['roi'], dataSourceId: 'ds2' },
    ],
    layout: { columns: 2, chartOrder: ['c5', 'c6'] },
    tags: ['marketing', 'monthly', 'roi'],
    createdAt: '2024-12-01T09:00:00Z',
    createdBy: 'Emily Davis',
    updatedAt: '2024-12-01T09:00:00Z',
  },
  {
    id: 't3',
    name: 'Daily Operations Snapshot',
    description: 'Quick daily view of operational KPIs and alerts.',
    source: 'chat',
    sourceId: 'chat1',
    charts: [
      { id: 'c7', title: 'Daily Active Users', type: 'line', dimensions: ['hour'], metrics: ['active_users'], dataSourceId: 'ds3' },
    ],
    tags: ['operations', 'daily'],
    createdAt: '2024-12-10T08:00:00Z',
    createdBy: 'Michael Chen',
    updatedAt: '2024-12-18T11:30:00Z',
  },
  {
    id: 't4',
    name: 'Executive Financial Summary',
    description: 'Monthly financial overview for board meetings.',
    source: 'dashboard',
    sourceId: 'd4',
    charts: [
      { id: 'c8', title: 'Revenue vs Budget', type: 'bar', dimensions: ['month'], metrics: ['revenue', 'budget'], dataSourceId: 'ds4' },
      { id: 'c9', title: 'Expense Breakdown', type: 'pie', dimensions: ['category'], metrics: ['amount'], dataSourceId: 'ds4' },
      { id: 'c10', title: 'Cash Flow', type: 'area', dimensions: ['week'], metrics: ['inflow', 'outflow'], dataSourceId: 'ds4' },
    ],
    layout: { columns: 2, chartOrder: ['c8', 'c9', 'c10'] },
    tags: ['finance', 'monthly', 'executive', 'board'],
    createdAt: '2024-11-20T16:00:00Z',
    createdBy: 'Robert Wilson',
    updatedAt: '2024-12-22T10:15:00Z',
  },
];

// ============= Mock Schedules =============

export const mockSchedules: Schedule[] = [
  {
    id: 's1',
    name: 'Weekly Sales Report',
    templateId: 't1',
    templateName: 'Weekly Sales Performance',
    frequency: 'weekly',
    dayOfWeek: 'monday',
    time: '09:00',
    timezone: 'America/New_York',
    startDate: '2024-12-01',
    format: 'pdf',
    recipients: [
      { id: 'g1', type: 'group', name: 'Executive Team', memberCount: 3 },
      { id: 'u2', type: 'user', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    ],
    emailSubject: '[Chat BI Studio] Weekly Sales Report - {{date}}',
    emailBody: 'Please find attached the weekly sales performance report.',
    includeSummary: true,
    status: 'active',
    lastRun: '2025-01-06T09:00:00Z',
    nextRun: '2025-01-13T09:00:00Z',
    createdAt: '2024-12-01T10:00:00Z',
    createdBy: 'John Smith',
    updatedAt: '2024-12-20T15:00:00Z',
  },
  {
    id: 's2',
    name: 'Monthly Executive Summary',
    templateId: 't4',
    templateName: 'Executive Financial Summary',
    frequency: 'monthly',
    dayOfMonth: 1,
    time: '08:00',
    timezone: 'UTC',
    startDate: '2024-12-01',
    format: 'pdf',
    recipients: [
      { id: 'u1', type: 'user', name: 'John Smith', email: 'john.smith@company.com' },
      { id: 'u5', type: 'user', name: 'Robert Wilson', email: 'robert.wilson@company.com' },
    ],
    emailSubject: '[Chat BI Studio] Monthly Financial Summary - {{month}} {{year}}',
    includeSummary: true,
    status: 'active',
    lastRun: '2025-01-01T08:00:00Z',
    nextRun: '2025-02-01T08:00:00Z',
    createdAt: '2024-11-25T11:00:00Z',
    createdBy: 'Robert Wilson',
    updatedAt: '2024-11-25T11:00:00Z',
  },
  {
    id: 's3',
    name: 'Daily Operations Alert',
    templateId: 't3',
    templateName: 'Daily Operations Snapshot',
    frequency: 'daily',
    time: '07:00',
    timezone: 'America/Los_Angeles',
    startDate: '2024-12-10',
    format: 'png',
    recipients: [
      { id: 'u3', type: 'user', name: 'Michael Chen', email: 'michael.chen@company.com' },
    ],
    emailSubject: '[Chat BI Studio] Daily Ops Snapshot - {{date}}',
    includeSummary: false,
    status: 'paused',
    lastRun: '2025-01-03T07:00:00Z',
    nextRun: '-',
    createdAt: '2024-12-10T08:30:00Z',
    createdBy: 'Michael Chen',
    updatedAt: '2025-01-03T10:00:00Z',
  },
  {
    id: 's4',
    name: 'Marketing Monthly ROI',
    templateId: 't2',
    templateName: 'Marketing Campaign ROI',
    frequency: 'monthly',
    dayOfMonth: 5,
    time: '10:00',
    timezone: 'Europe/London',
    startDate: '2024-12-05',
    format: 'pdf',
    recipients: [
      { id: 'g3', type: 'group', name: 'Marketing Team', memberCount: 2 },
      { id: 'g1', type: 'group', name: 'Executive Team', memberCount: 3 },
    ],
    emailSubject: '[Chat BI Studio] Marketing ROI Report - {{month}}',
    emailBody: 'Attached is the monthly marketing ROI analysis.',
    includeSummary: true,
    status: 'active',
    lastRun: '2025-01-05T10:00:00Z',
    nextRun: '2025-02-05T10:00:00Z',
    createdAt: '2024-12-01T14:00:00Z',
    createdBy: 'Emily Davis',
    updatedAt: '2024-12-15T09:30:00Z',
  },
];

// ============= Mock Execution Runs =============

export const mockExecutionRuns: ExecutionRun[] = [
  {
    id: 'r1',
    scheduleId: 's1',
    scheduleName: 'Weekly Sales Report',
    templateId: 't1',
    templateName: 'Weekly Sales Performance',
    status: 'completed',
    triggeredBy: 'schedule',
    triggeredAt: '2025-01-06T09:00:00Z',
    renderStartedAt: '2025-01-06T09:00:02Z',
    renderCompletedAt: '2025-01-06T09:00:15Z',
    deliveryStartedAt: '2025-01-06T09:00:16Z',
    completedAt: '2025-01-06T09:00:45Z',
    artifactUrl: '/reports/r1/sales-report.pdf',
    artifactType: 'attachment',
    warnings: [],
    recipientCount: 4,
    successfulDeliveries: 4,
    failedDeliveries: 0,
  },
  {
    id: 'r2',
    scheduleId: 's2',
    scheduleName: 'Monthly Executive Summary',
    templateId: 't4',
    templateName: 'Executive Financial Summary',
    status: 'completed',
    triggeredBy: 'schedule',
    triggeredAt: '2025-01-01T08:00:00Z',
    renderStartedAt: '2025-01-01T08:00:03Z',
    renderCompletedAt: '2025-01-01T08:00:25Z',
    deliveryStartedAt: '2025-01-01T08:00:26Z',
    completedAt: '2025-01-01T08:01:10Z',
    artifactUrl: '/reports/r2/financial-summary.pdf',
    artifactType: 'attachment',
    warnings: [],
    recipientCount: 2,
    successfulDeliveries: 2,
    failedDeliveries: 0,
  },
  {
    id: 'r3',
    scheduleId: 's1',
    scheduleName: 'Weekly Sales Report',
    templateId: 't1',
    templateName: 'Weekly Sales Performance',
    status: 'completed',
    triggeredBy: 'send_now',
    triggeredAt: '2025-01-04T14:30:00Z',
    renderStartedAt: '2025-01-04T14:30:02Z',
    renderCompletedAt: '2025-01-04T14:30:18Z',
    deliveryStartedAt: '2025-01-04T14:30:19Z',
    completedAt: '2025-01-04T14:30:52Z',
    artifactUrl: '/reports/r3/sales-report.pdf',
    artifactType: 'attachment',
    warnings: [
      { chartId: 'c3', chartTitle: 'Top Products', type: 'restricted', message: 'Chart access restricted for some recipients' },
    ],
    recipientCount: 4,
    successfulDeliveries: 3,
    failedDeliveries: 1,
  },
  {
    id: 'r4',
    scheduleId: 's4',
    scheduleName: 'Marketing Monthly ROI',
    templateId: 't2',
    templateName: 'Marketing Campaign ROI',
    status: 'completed',
    triggeredBy: 'schedule',
    triggeredAt: '2025-01-05T10:00:00Z',
    renderStartedAt: '2025-01-05T10:00:01Z',
    renderCompletedAt: '2025-01-05T10:00:12Z',
    deliveryStartedAt: '2025-01-05T10:00:13Z',
    completedAt: '2025-01-05T10:00:38Z',
    artifactUrl: '/reports/r4/marketing-roi.pdf',
    artifactType: 'attachment',
    warnings: [],
    recipientCount: 5,
    successfulDeliveries: 5,
    failedDeliveries: 0,
  },
  {
    id: 'r5',
    scheduleId: 's1',
    scheduleName: 'Weekly Sales Report',
    templateId: 't1',
    templateName: 'Weekly Sales Performance',
    status: 'failed',
    triggeredBy: 'send_test',
    triggeredAt: '2025-01-05T16:00:00Z',
    renderStartedAt: '2025-01-05T16:00:02Z',
    renderCompletedAt: '2025-01-05T16:00:08Z',
    deliveryStartedAt: '2025-01-05T16:00:09Z',
    completedAt: '2025-01-05T16:00:35Z',
    warnings: [
      { chartId: 'c2', chartTitle: 'Sales by Region', type: 'missing', message: 'Chart data source unavailable' },
    ],
    recipientCount: 1,
    successfulDeliveries: 0,
    failedDeliveries: 1,
  },
];

// ============= Mock Delivery Logs =============

export const mockDeliveryLogs: DeliveryLog[] = [
  { id: 'dl1', runId: 'r1', recipientId: 'u1', recipientName: 'John Smith', recipientEmail: 'john.smith@company.com', status: 'sent', attempts: 1, sentAt: '2025-01-06T09:00:25Z' },
  { id: 'dl2', runId: 'r1', recipientId: 'u2', recipientName: 'Sarah Johnson', recipientEmail: 'sarah.johnson@company.com', status: 'sent', attempts: 1, sentAt: '2025-01-06T09:00:28Z' },
  { id: 'dl3', runId: 'r1', recipientId: 'u5', recipientName: 'Robert Wilson', recipientEmail: 'robert.wilson@company.com', status: 'sent', attempts: 1, sentAt: '2025-01-06T09:00:32Z' },
  { id: 'dl4', runId: 'r1', recipientId: 'u2', recipientName: 'Sarah Johnson', recipientEmail: 'sarah.johnson@company.com', status: 'sent', attempts: 1, sentAt: '2025-01-06T09:00:45Z' },
  { id: 'dl5', runId: 'r3', recipientId: 'u1', recipientName: 'John Smith', recipientEmail: 'john.smith@company.com', status: 'sent', attempts: 1, sentAt: '2025-01-04T14:30:30Z' },
  { id: 'dl6', runId: 'r3', recipientId: 'u2', recipientName: 'Sarah Johnson', recipientEmail: 'sarah.johnson@company.com', status: 'sent', attempts: 2, lastAttemptAt: '2025-01-04T14:30:38Z', sentAt: '2025-01-04T14:30:42Z' },
  { id: 'dl7', runId: 'r3', recipientId: 'u5', recipientName: 'Robert Wilson', recipientEmail: 'robert.wilson@company.com', status: 'sent', attempts: 1, sentAt: '2025-01-04T14:30:48Z' },
  { id: 'dl8', runId: 'r3', recipientId: 'u2', recipientName: 'Sarah Johnson', recipientEmail: 'sarah.johnson@company.com', status: 'failed', attempts: 5, lastAttemptAt: '2025-01-04T14:30:52Z', errorMessage: 'Email server timeout' },
  { id: 'dl9', runId: 'r5', recipientId: 'u1', recipientName: 'John Smith', recipientEmail: 'john.smith@company.com', status: 'failed', attempts: 5, lastAttemptAt: '2025-01-05T16:00:35Z', errorMessage: 'Render output too large, fallback link generation failed' },
];

// ============= Mock Audit Events =============

export const mockAuditEvents: AuditEvent[] = [
  { id: 'a1', action: 'schedule_created', entityType: 'schedule', entityId: 's1', entityName: 'Weekly Sales Report', userId: 'u1', userName: 'John Smith', timestamp: '2024-12-01T10:00:00Z' },
  { id: 'a2', action: 'template_created', entityType: 'template', entityId: 't1', entityName: 'Weekly Sales Performance', userId: 'u1', userName: 'John Smith', timestamp: '2024-12-01T09:55:00Z' },
  { id: 'a3', action: 'report_sent', entityType: 'schedule', entityId: 's1', entityName: 'Weekly Sales Report', userId: 'system', userName: 'System', timestamp: '2025-01-06T09:00:45Z' },
  { id: 'a4', action: 'schedule_paused', entityType: 'schedule', entityId: 's3', entityName: 'Daily Operations Alert', userId: 'u3', userName: 'Michael Chen', timestamp: '2025-01-03T10:00:00Z' },
  { id: 'a5', action: 'test_sent', entityType: 'schedule', entityId: 's1', entityName: 'Weekly Sales Report', userId: 'u1', userName: 'John Smith', timestamp: '2025-01-05T16:00:00Z' },
  { id: 'a6', action: 'schedule_updated', entityType: 'schedule', entityId: 's4', entityName: 'Marketing Monthly ROI', userId: 'u4', userName: 'Emily Davis', timestamp: '2024-12-15T09:30:00Z' },
  { id: 'a7', action: 'template_updated', entityType: 'template', entityId: 't4', entityName: 'Executive Financial Summary', userId: 'u5', userName: 'Robert Wilson', timestamp: '2024-12-22T10:15:00Z' },
];

// ============= Mock Org Config =============

export const mockOrgConfig: OrgConfig = {
  maxRecipientsPerSchedule: 50,
  executionRetentionDays: 180,
  artifactRetentionDays: 180,
  customCronEnabled: false,
};

// ============= Mock Dashboards for Template Creation =============

export const mockDashboardsForTemplate = [
  { id: 'd1', name: 'Sales Overview', chartCount: 4, charts: [
    { id: 'c1', title: 'Revenue Trend' },
    { id: 'c2', title: 'Sales by Region' },
    { id: 'c3', title: 'Top Products' },
    { id: 'c4', title: 'Customer Growth' },
  ]},
  { id: 'd2', name: 'Marketing Analytics', chartCount: 6, charts: [
    { id: 'c5', title: 'Campaign Performance' },
    { id: 'c6', title: 'Channel ROI' },
    { id: 'c7', title: 'Lead Sources' },
    { id: 'c8', title: 'Conversion Funnel' },
    { id: 'c9', title: 'Ad Spend' },
    { id: 'c10', title: 'Click-through Rate' },
  ]},
  { id: 'd3', name: 'Operations Dashboard', chartCount: 5, charts: [
    { id: 'c11', title: 'System Uptime' },
    { id: 'c12', title: 'Response Time' },
    { id: 'c13', title: 'Error Rate' },
    { id: 'c14', title: 'Active Users' },
    { id: 'c15', title: 'Request Volume' },
  ]},
  { id: 'd4', name: 'Finance Summary', chartCount: 3, charts: [
    { id: 'c16', title: 'Revenue vs Budget' },
    { id: 'c17', title: 'Expense Breakdown' },
    { id: 'c18', title: 'Cash Flow' },
  ]},
];

// ============= Helper Functions =============

export function computeNextRuns(schedule: Schedule, count: number = 5): string[] {
  // Mock implementation - in real app would use proper date math
  const runs: string[] = [];
  const baseDate = new Date();
  
  for (let i = 0; i < count; i++) {
    const runDate = new Date(baseDate);
    if (schedule.frequency === 'daily') {
      runDate.setDate(runDate.getDate() + i + 1);
    } else if (schedule.frequency === 'weekly') {
      runDate.setDate(runDate.getDate() + (i + 1) * 7);
    } else if (schedule.frequency === 'monthly') {
      runDate.setMonth(runDate.getMonth() + i + 1);
      runDate.setDate(schedule.dayOfMonth || 1);
    }
    runs.push(runDate.toISOString());
  }
  
  return runs;
}

export function expandRecipients(recipients: Recipient[]): Recipient[] {
  const expanded: Recipient[] = [];
  
  recipients.forEach(r => {
    if (r.type === 'user') {
      expanded.push(r);
    } else {
      const group = mockGroups.find(g => g.id === r.id);
      if (group) {
        expanded.push(...group.members);
      }
    }
  });
  
  // Deduplicate by id
  return expanded.filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i);
}
