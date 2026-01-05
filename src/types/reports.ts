// Report Templates & Scheduling Types based on BRD

// ============= Core Entities =============

export type TemplateSource = 'chat' | 'dashboard';
export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'table';
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type ExportFormat = 'pdf' | 'png';
export type ScheduleStatus = 'active' | 'paused';
export type RunStatus = 'pending' | 'rendering' | 'delivering' | 'completed' | 'failed';
export type DeliveryStatus = 'pending' | 'sent' | 'failed';

// ============= Report Template =============

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  dimensions: string[];
  metrics: string[];
  filters?: Record<string, string>;
  dataSourceId: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  source: TemplateSource;
  sourceId: string; // dashboardId or chatId
  charts: ChartConfig[];
  layout?: {
    columns: number;
    chartOrder: string[];
  };
  tags: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

// ============= Recipients =============

export interface Recipient {
  id: string;
  type: 'user' | 'group';
  name: string;
  email?: string;
  memberCount?: number; // for groups
}

export interface RecipientGroup {
  id: string;
  name: string;
  members: Recipient[];
}

// ============= Schedule =============

export interface Schedule {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  frequency: Frequency;
  cronExpression?: string; // for custom frequency
  dayOfWeek?: string; // for weekly
  dayOfMonth?: number; // for monthly
  time: string;
  timezone: string;
  startDate: string;
  format: ExportFormat;
  recipients: Recipient[];
  emailSubject: string;
  emailBody?: string;
  includeSummary: boolean;
  status: ScheduleStatus;
  lastRun?: string;
  nextRun: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

// ============= Execution & Delivery =============

export interface RenderWarning {
  chartId: string;
  chartTitle: string;
  type: 'missing' | 'restricted';
  message: string;
}

export interface ExecutionRun {
  id: string;
  scheduleId: string;
  scheduleName: string;
  templateId: string;
  templateName: string;
  status: RunStatus;
  triggeredBy: 'schedule' | 'send_now' | 'send_test';
  triggeredAt: string;
  renderStartedAt?: string;
  renderCompletedAt?: string;
  deliveryStartedAt?: string;
  completedAt?: string;
  artifactUrl?: string;
  artifactType?: 'attachment' | 'link';
  warnings: RenderWarning[];
  recipientCount: number;
  successfulDeliveries: number;
  failedDeliveries: number;
}

export interface DeliveryLog {
  id: string;
  runId: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  status: DeliveryStatus;
  attempts: number;
  lastAttemptAt?: string;
  sentAt?: string;
  errorMessage?: string;
}

// ============= Audit =============

export type AuditAction = 
  | 'template_created' 
  | 'template_updated' 
  | 'template_deleted'
  | 'schedule_created' 
  | 'schedule_updated' 
  | 'schedule_deleted'
  | 'schedule_paused'
  | 'schedule_resumed'
  | 'report_sent'
  | 'test_sent';

export interface AuditEvent {
  id: string;
  action: AuditAction;
  entityType: 'template' | 'schedule';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  timestamp: string;
}

// ============= Usage Credits =============

export interface UsageStats {
  renderUnitsUsed: number;
  renderUnitsLimit: number;
  deliveryUnitsUsed: number;
  deliveryUnitsLimit: number;
  period: string;
}

// ============= Configuration =============

export interface OrgConfig {
  maxRecipientsPerSchedule: number;
  executionRetentionDays: number;
  artifactRetentionDays: number;
  customCronEnabled: boolean;
}

// ============= Timezones =============

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

export const WEEK_DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];
