import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  CalendarClock,
  Plus,
  MoreVertical,
  Mail,
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
} from "lucide-react";

// Mock data for dashboards
const mockDashboards = [
  { id: "1", name: "Sales Overview", charts: 4 },
  { id: "2", name: "Marketing Analytics", charts: 6 },
  { id: "3", name: "Operations Dashboard", charts: 5 },
  { id: "4", name: "Finance Summary", charts: 3 },
];

// Mock data for scheduled reports
const mockScheduledReports = [
  {
    id: "1",
    name: "Weekly Sales Report",
    dashboard: "Sales Overview",
    frequency: "weekly",
    day: "Monday",
    time: "09:00",
    recipients: ["exec@company.com", "sales@company.com"],
    status: "active",
    lastSent: "2024-01-15 09:00",
    nextRun: "2024-01-22 09:00",
    format: "pdf",
  },
  {
    id: "2",
    name: "Monthly Executive Summary",
    dashboard: "Finance Summary",
    frequency: "monthly",
    day: "1",
    time: "08:00",
    recipients: ["ceo@company.com", "cfo@company.com", "board@company.com"],
    status: "active",
    lastSent: "2024-01-01 08:00",
    nextRun: "2024-02-01 08:00",
    format: "pdf",
  },
  {
    id: "3",
    name: "Daily Operations Snapshot",
    dashboard: "Operations Dashboard",
    frequency: "daily",
    day: null,
    time: "07:00",
    recipients: ["ops@company.com"],
    status: "paused",
    lastSent: "2024-01-14 07:00",
    nextRun: "-",
    format: "excel",
  },
];

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const formatOptions = [
  { value: "pdf", label: "PDF Report" },
  { value: "excel", label: "Excel Spreadsheet" },
  { value: "csv", label: "CSV Data" },
];

export default function ScheduleReports() {
  const [reports, setReports] = useState(mockScheduledReports);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState("");
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");
  const [recipients, setRecipients] = useState("");

  const handleCreateReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Your executive report has been scheduled successfully.",
    });
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDashboard("");
    setSelectedCharts([]);
    setFrequency("weekly");
    setRecipients("");
  };

  const handleToggleStatus = (id: string) => {
    setReports(reports.map(r => 
      r.id === id 
        ? { ...r, status: r.status === "active" ? "paused" : "active" }
        : r
    ));
    toast({
      title: "Status Updated",
      description: "Report schedule status has been updated.",
    });
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
    toast({
      title: "Report Deleted",
      description: "Scheduled report has been removed.",
    });
  };

  const handleSendNow = (name: string) => {
    toast({
      title: "Report Sent",
      description: `${name} is being generated and sent to recipients.`,
    });
  };

  return (
    <MainLayout title="Schedule Reports" subtitle="Create and manage scheduled executive reports.">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <CalendarClock className="h-3 w-3" />
              {reports.filter(r => r.status === "active").length} Active Schedules
            </Badge>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Scheduled Report</DialogTitle>
                <DialogDescription>
                  Configure a new executive report to be sent automatically.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Report Name */}
                <div className="space-y-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input id="report-name" placeholder="e.g., Weekly Sales Executive Report" />
                </div>

                {/* Dashboard Selection */}
                <div className="space-y-2">
                  <Label>Select Dashboard</Label>
                  <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a dashboard" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDashboards.map((dashboard) => (
                        <SelectItem key={dashboard.id} value={dashboard.id}>
                          {dashboard.name} ({dashboard.charts} charts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Chart Selection */}
                {selectedDashboard && (
                  <div className="space-y-3">
                    <Label>Include Charts</Label>
                    <Card className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox id="all-charts" />
                          <Label htmlFor="all-charts" className="font-medium">Include All Charts</Label>
                        </div>
                        <div className="border-t pt-3 space-y-2">
                          {["Revenue Trend", "Sales by Region", "Top Products", "Customer Growth"].map((chart, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Checkbox id={`chart-${i}`} />
                              <Label htmlFor={`chart-${i}`} className="font-normal">{chart}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Schedule Configuration */}
                <div className="space-y-4">
                  <Label>Schedule</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Frequency</Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {frequency === "weekly" && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Day of Week</Label>
                        <Select defaultValue="Monday">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {weekDays.map((day) => (
                              <SelectItem key={day} value={day}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {frequency === "monthly" && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Day of Month</Label>
                        <Select defaultValue="1">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 28 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1}{i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Time</Label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                </div>

                {/* Report Format */}
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Recipients */}
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Textarea
                    id="recipients"
                    placeholder="Enter email addresses, separated by commas"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple email addresses with commas
                  </p>
                </div>

                {/* Email Settings */}
                <div className="space-y-4">
                  <Label>Email Settings</Label>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm text-muted-foreground">Subject Line</Label>
                    <Input id="subject" placeholder="e.g., [Chat BI Studio] Weekly Sales Report" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm text-muted-foreground">Custom Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Add a custom message to include in the email body..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-3">
                  <Label>Additional Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="font-normal">Include Summary</Label>
                        <p className="text-xs text-muted-foreground">Add an AI-generated executive summary</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="font-normal">Send Test Email First</Label>
                        <p className="text-xs text-muted-foreground">Receive a test email before activating</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReport} className="gap-2">
                  <CalendarClock className="h-4 w-4" />
                  Create Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scheduled Reports Table */}
        {reports.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No scheduled reports"
            description="Create your first scheduled report to automatically send dashboards as executive reports."
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
                Manage your automated executive report schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Dashboard</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.dashboard}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="capitalize">{report.frequency}</span>
                          {report.day && (
                            <span className="text-muted-foreground">
                              ({report.day})
                            </span>
                          )}
                          <span className="text-muted-foreground">{report.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{report.recipients.length} recipient(s)</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase text-xs">
                          {report.format}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge 
                          status={report.status === "active" ? "success" : "warning"} 
                          label={report.status === "active" ? "Active" : "Paused"}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {report.nextRun}
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
                            <DropdownMenuItem onClick={() => handleSendNow(report.name)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview Report
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(report.id)}>
                              {report.status === "active" ? (
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
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteReport(report.id)}
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Reports Sent This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Total Recipients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent">
                  <CalendarClock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Active Schedules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
