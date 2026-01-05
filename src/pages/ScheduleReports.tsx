import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { KPICard } from "@/components/shared/KPICard";
import { CreateScheduleDialog } from "@/components/reports/CreateScheduleDialog";
import { ScheduleDetailsSheet } from "@/components/reports/ScheduleDetailsSheet";
import { ExecutionHistorySheet } from "@/components/reports/ExecutionHistorySheet";
import { mockSchedules, mockExecutionRuns } from "@/data/mockReportData";
import type { Schedule } from "@/types/reports";
import {
  CalendarClock,
  Plus,
  MoreVertical,
  Clock,
  Calendar,
  FileText,
  Users,
  Send,
  Pause,
  Play,
  Trash2,
  Edit,
  Copy,
  Eye,
  Search,
  History,
  TestTube,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function ScheduleReports() {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("schedules");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const filteredSchedules = schedules.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSchedules = schedules.filter(s => s.status === 'active');
  const pausedSchedules = schedules.filter(s => s.status === 'paused');
  const totalRecipients = schedules.reduce((acc, s) => {
    return acc + s.recipients.reduce((sum, r) => sum + (r.memberCount || 1), 0);
  }, 0);

  const handleToggleStatus = (id: string) => {
    setSchedules(schedules.map(s =>
      s.id === id
        ? { ...s, status: s.status === 'active' ? 'paused' : 'active', nextRun: s.status === 'active' ? '-' : new Date().toISOString() }
        : s
    ));
    const schedule = schedules.find(s => s.id === id);
    toast({
      title: schedule?.status === 'active' ? "Schedule Paused" : "Schedule Resumed",
      description: `"${schedule?.name}" has been ${schedule?.status === 'active' ? 'paused' : 'resumed'}.`,
    });
  };

  const handleDeleteSchedule = (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    setSchedules(schedules.filter(s => s.id !== id));
    toast({
      title: "Schedule Deleted",
      description: `"${schedule?.name}" has been removed.`,
    });
  };

  const handleSendNow = (schedule: Schedule) => {
    toast({
      title: "Report Queued",
      description: `"${schedule.name}" is being generated and will be sent shortly.`,
    });
  };

  const handleSendTest = (schedule: Schedule) => {
    toast({
      title: "Test Email Sent",
      description: "A test report has been sent to your email address.",
    });
  };

  const handleViewDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailsOpen(true);
  };

  const handleViewHistory = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsHistoryOpen(true);
  };

  const formatFrequency = (schedule: Schedule) => {
    if (schedule.frequency === 'daily') return 'Daily';
    if (schedule.frequency === 'weekly') return `Weekly (${schedule.dayOfWeek})`;
    if (schedule.frequency === 'monthly') return `Monthly (Day ${schedule.dayOfMonth})`;
    return schedule.frequency;
  };

  const formatNextRun = (schedule: Schedule) => {
    if (schedule.status === 'paused' || schedule.nextRun === '-') return '-';
    return new Date(schedule.nextRun).toLocaleString();
  };

  return (
    <MainLayout title="Schedule Reports" subtitle="Create and manage scheduled report delivery.">
      <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard
            title="Active Schedules"
            value={activeSchedules.length}
            icon={CalendarClock}
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="Paused Schedules"
            value={pausedSchedules.length}
            icon={Pause}
          />
          <KPICard
            title="Total Recipients"
            value={totalRecipients}
            icon={Users}
          />
          <KPICard
            title="Reports Sent (Month)"
            value={mockExecutionRuns.filter(r => r.status === 'completed').length}
            icon={Send}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList>
              <TabsTrigger value="schedules">Schedules</TabsTrigger>
              <TabsTrigger value="history">Execution History</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schedules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                Create Schedule
              </Button>
            </div>
          </div>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="mt-6">
            {filteredSchedules.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="No schedules found"
                description={searchQuery ? "Try adjusting your search." : "Create your first schedule to automate report delivery."}
                actionLabel="Create Schedule"
                onAction={() => setIsCreateDialogOpen(true)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Scheduled Reports
                  </CardTitle>
                  <CardDescription>
                    {filteredSchedules.length} schedule{filteredSchedules.length !== 1 ? 's' : ''} configured
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Schedule Name</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Timezone</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Run</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">{schedule.name}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{schedule.templateName}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{formatFrequency(schedule)}</span>
                              <span className="text-muted-foreground">{schedule.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Globe className="h-3.5 w-3.5" />
                              {schedule.timezone.split('/').pop()?.replace('_', ' ')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">
                                {schedule.recipients.reduce((sum, r) => sum + (r.memberCount || 1), 0)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="uppercase text-xs">
                              {schedule.format}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              status={schedule.status === 'active' ? 'success' : 'warning'}
                              label={schedule.status === 'active' ? 'Active' : 'Paused'}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">{formatNextRun(schedule)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(schedule)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewHistory(schedule)}>
                                  <History className="h-4 w-4 mr-2" />
                                  Execution History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleSendNow(schedule)}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Now
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendTest(schedule)}>
                                  <TestTube className="h-4 w-4 mr-2" />
                                  Send Test
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Schedule
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(schedule.id)}>
                                  {schedule.status === 'active' ? (
                                    <>
                                      <Pause className="h-4 w-4 mr-2" />
                                      Pause Schedule
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-4 w-4 mr-2" />
                                      Resume Schedule
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteSchedule(schedule.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Execution History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Execution History
                </CardTitle>
                <CardDescription>
                  Recent report generation and delivery runs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Triggered</TableHead>
                      <TableHead>Trigger Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Warnings</TableHead>
                      <TableHead>Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockExecutionRuns.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell className="font-medium">{run.scheduleName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(run.triggeredAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs capitalize">
                            {run.triggeredBy.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'error' : 'info'}
                            label={run.status}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{run.recipientCount}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1 text-success">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {run.successfulDeliveries}
                            </div>
                            {run.failedDeliveries > 0 && (
                              <div className="flex items-center gap-1 text-destructive">
                                <XCircle className="h-3.5 w-3.5" />
                                {run.failedDeliveries}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {run.warnings.length > 0 ? (
                            <Badge variant="outline" className="text-xs text-warning border-warning">
                              {run.warnings.length} warning{run.warnings.length !== 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {run.completedAt ? new Date(run.completedAt).toLocaleString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Schedule Dialog */}
      <CreateScheduleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={(schedule) => {
          setSchedules([...schedules, schedule]);
        }}
      />

      {/* Schedule Details Sheet */}
      <ScheduleDetailsSheet
        schedule={selectedSchedule}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      {/* Execution History Sheet */}
      <ExecutionHistorySheet
        schedule={selectedSchedule}
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
    </MainLayout>
  );
}
