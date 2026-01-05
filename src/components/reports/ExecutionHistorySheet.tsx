import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockExecutionRuns, mockDeliveryLogs } from "@/data/mockReportData";
import type { Schedule } from "@/types/reports";
import {
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  RefreshCw,
  Mail,
} from "lucide-react";

interface ExecutionHistorySheetProps {
  schedule: Schedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExecutionHistorySheet({ schedule, open, onOpenChange }: ExecutionHistorySheetProps) {
  if (!schedule) return null;

  const scheduleRuns = mockExecutionRuns.filter(r => r.scheduleId === schedule.id);
  const latestRun = scheduleRuns[0];
  const runDeliveryLogs = latestRun ? mockDeliveryLogs.filter(l => l.runId === latestRun.id) : [];

  const formatDuration = (start: string, end: string) => {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Execution History
          </SheetTitle>
          <SheetDescription>
            {schedule.name} — {scheduleRuns.length} execution{scheduleRuns.length !== 1 ? 's' : ''} recorded
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <Tabs defaultValue="runs">
            <TabsList>
              <TabsTrigger value="runs">Execution Runs</TabsTrigger>
              <TabsTrigger value="delivery">Delivery Logs</TabsTrigger>
            </TabsList>

            {/* Execution Runs Tab */}
            <TabsContent value="runs" className="mt-4">
              {scheduleRuns.length === 0 ? (
                <Card className="p-8 text-center">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium">No execution history</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This schedule hasn't run yet.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {scheduleRuns.map((run) => (
                    <Card key={run.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <StatusBadge
                            status={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'error' : 'info'}
                            label={run.status}
                          />
                          <Badge variant="outline" className="text-xs capitalize">
                            {run.triggeredBy.replace('_', ' ')}
                          </Badge>
                        </div>
                        {run.artifactUrl && (
                          <a
                            href={run.artifactUrl}
                            className="text-sm text-primary flex items-center gap-1 hover:underline"
                          >
                            View artifact
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Triggered</span>
                          <p>{new Date(run.triggeredAt).toLocaleString()}</p>
                        </div>
                        {run.completedAt && (
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Duration</span>
                            <p>{formatDuration(run.triggeredAt, run.completedAt)}</p>
                          </div>
                        )}
                      </div>

                      <Separator className="my-3" />

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{run.recipientCount} recipients</span>
                        </div>
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{run.successfulDeliveries} delivered</span>
                        </div>
                        {run.failedDeliveries > 0 && (
                          <div className="flex items-center gap-2 text-destructive">
                            <XCircle className="h-4 w-4" />
                            <span>{run.failedDeliveries} failed</span>
                          </div>
                        )}
                      </div>

                      {/* Warnings */}
                      {run.warnings.length > 0 && (
                        <div className="mt-3 p-3 bg-warning/10 rounded-md">
                          <div className="flex items-center gap-2 text-sm font-medium text-warning mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            Warnings ({run.warnings.length})
                          </div>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {run.warnings.map((warning, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="font-medium">{warning.chartTitle}:</span>
                                <span>{warning.message}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Delivery Logs Tab */}
            <TabsContent value="delivery" className="mt-4">
              {runDeliveryLogs.length === 0 ? (
                <Card className="p-8 text-center">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium">No delivery logs</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Delivery logs will appear after the schedule runs.
                  </p>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Attempts</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {runDeliveryLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.recipientName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{log.recipientEmail}</TableCell>
                          <TableCell>
                            <StatusBadge
                              status={log.status === 'sent' ? 'success' : log.status === 'failed' ? 'error' : 'info'}
                              label={log.status}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                              {log.attempts}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {log.sentAt
                              ? new Date(log.sentAt).toLocaleString()
                              : log.lastAttemptAt
                              ? new Date(log.lastAttemptAt).toLocaleString()
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}

              {/* Error Details */}
              {runDeliveryLogs.some(l => l.status === 'failed') && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-destructive flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Failed Deliveries
                  </h4>
                  {runDeliveryLogs
                    .filter(l => l.status === 'failed')
                    .map((log) => (
                      <Card key={log.id} className="p-3 border-destructive/50 bg-destructive/5">
                        <div className="text-sm">
                          <span className="font-medium">{log.recipientName}:</span>{' '}
                          <span className="text-muted-foreground">{log.errorMessage}</span>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
