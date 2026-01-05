import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { mockTemplates, mockRecipients, expandRecipients, computeNextRuns, mockOrgConfig } from "@/data/mockReportData";
import { TIMEZONES, WEEK_DAYS } from "@/types/reports";
import type { Schedule, Recipient } from "@/types/reports";
import {
  CalendarClock,
  Users,
  X,
  Check,
  ChevronsUpDown,
  Clock,
  Mail,
  AlertCircle,
  Calendar,
  Eye,
} from "lucide-react";

interface CreateScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (schedule: Schedule) => void;
}

export function CreateScheduleDialog({ open, onOpenChange, onSuccess }: CreateScheduleDialogProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dayOfWeek, setDayOfWeek] = useState("monday");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [time, setTime] = useState("09:00");
  const [timezone, setTimezone] = useState("America/New_York");
  const [format, setFormat] = useState<'pdf' | 'png'>('pdf');
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [includeSummary, setIncludeSummary] = useState(true);
  const [recipientPopoverOpen, setRecipientPopoverOpen] = useState(false);

  const selectedTemplate = mockTemplates.find(t => t.id === templateId);
  const expandedRecipientCount = expandRecipients(selectedRecipients).length;
  const exceedsRecipientLimit = expandedRecipientCount > mockOrgConfig.maxRecipientsPerSchedule;

  const handleAddRecipient = (recipient: Recipient) => {
    if (!selectedRecipients.find(r => r.id === recipient.id)) {
      setSelectedRecipients([...selectedRecipients, recipient]);
    }
    setRecipientPopoverOpen(false);
  };

  const handleRemoveRecipient = (recipientId: string) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== recipientId));
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast({ title: "Error", description: "Please enter a schedule name.", variant: "destructive" });
      return;
    }
    if (!templateId) {
      toast({ title: "Error", description: "Please select a template.", variant: "destructive" });
      return;
    }
    if (selectedRecipients.length === 0) {
      toast({ title: "Error", description: "Please add at least one recipient.", variant: "destructive" });
      return;
    }
    if (exceedsRecipientLimit) {
      toast({ title: "Error", description: `Recipient limit exceeded (max ${mockOrgConfig.maxRecipientsPerSchedule}).`, variant: "destructive" });
      return;
    }

    const schedule: Schedule = {
      id: `s${Date.now()}`,
      name: name.trim(),
      templateId,
      templateName: selectedTemplate?.name || 'Unknown',
      frequency,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
      time,
      timezone,
      startDate: new Date().toISOString().split('T')[0],
      format,
      recipients: selectedRecipients,
      emailSubject: emailSubject || `[Chat BI Studio] ${name} - {{date}}`,
      emailBody,
      includeSummary,
      status: 'active',
      nextRun: computeNextRuns({ frequency, dayOfWeek, dayOfMonth, time } as Schedule, 1)[0],
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      updatedAt: new Date().toISOString(),
    };

    onSuccess(schedule);
    toast({
      title: "Schedule Created",
      description: `"${schedule.name}" will run ${frequency}.`,
    });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setName("");
    setTemplateId("");
    setFrequency('weekly');
    setDayOfWeek("monday");
    setDayOfMonth(1);
    setTime("09:00");
    setTimezone("America/New_York");
    setFormat('pdf');
    setSelectedRecipients([]);
    setEmailSubject("");
    setEmailBody("");
    setIncludeSummary(true);
    onOpenChange(false);
  };

  const canProceedStep1 = templateId && name.trim();
  const canProceedStep2 = selectedRecipients.length > 0 && !exceedsRecipientLimit;

  // Compute preview of next 5 runs
  const nextRuns = templateId ? computeNextRuns({ frequency, dayOfWeek, dayOfMonth, time } as Schedule, 5) : [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Create Schedule
          </DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? "Template & Schedule" : step === 2 ? "Recipients" : "Email Settings"}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 pb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="schedule-name">Schedule Name *</Label>
              <Input
                id="schedule-name"
                placeholder="e.g., Weekly Sales Report"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Report Template *</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {mockTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <p className="text-xs text-muted-foreground">{selectedTemplate.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {frequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEK_DAYS.map((day) => (
                        <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {frequency === 'monthly' && (
                <div className="space-y-2">
                  <Label>Day of Month</Label>
                  <Select value={String(dayOfMonth)} onValueChange={(v) => setDayOfMonth(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={format === 'pdf' ? 'default' : 'outline'}
                  onClick={() => setFormat('pdf')}
                  className="flex-1"
                >
                  PDF Report
                </Button>
                <Button
                  type="button"
                  variant={format === 'png' ? 'default' : 'outline'}
                  onClick={() => setFormat('png')}
                  className="flex-1"
                >
                  PNG Charts
                </Button>
              </div>
            </div>

            {/* Next Runs Preview */}
            {templateId && (
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium text-sm">Next 5 Runs</span>
                </div>
                <div className="space-y-1">
                  {nextRuns.map((run, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(run).toLocaleString()}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Recipients (Internal Only)
              </Label>

              <Popover open={recipientPopoverOpen} onOpenChange={setRecipientPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Add users or groups...
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-80" align="start">
                  <Command>
                    <CommandInput placeholder="Search users and groups..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Users">
                        {mockRecipients.filter(r => r.type === 'user').map((recipient) => (
                          <CommandItem
                            key={recipient.id}
                            value={recipient.name}
                            onSelect={() => handleAddRecipient(recipient)}
                            disabled={selectedRecipients.some(r => r.id === recipient.id)}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span>{recipient.name}</span>
                              {recipient.email && (
                                <span className="text-xs text-muted-foreground">{recipient.email}</span>
                              )}
                            </div>
                            {selectedRecipients.some(r => r.id === recipient.id) && (
                              <Check className="h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandGroup heading="Groups">
                        {mockRecipients.filter(r => r.type === 'group').map((recipient) => (
                          <CommandItem
                            key={recipient.id}
                            value={recipient.name}
                            onSelect={() => handleAddRecipient(recipient)}
                            disabled={selectedRecipients.some(r => r.id === recipient.id)}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span>{recipient.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {recipient.memberCount} members
                              </Badge>
                            </div>
                            {selectedRecipients.some(r => r.id === recipient.id) && (
                              <Check className="h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected Recipients */}
              {selectedRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedRecipients.map((recipient) => (
                    <Badge key={recipient.id} variant="secondary" className="gap-1 py-1.5">
                      {recipient.name}
                      {recipient.type === 'group' && (
                        <span className="text-muted-foreground">({recipient.memberCount})</span>
                      )}
                      <button onClick={() => handleRemoveRecipient(recipient.id)} className="hover:text-destructive ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Recipient Count */}
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">
                  Total recipients (after group expansion): {expandedRecipientCount}
                </span>
                <span className="text-muted-foreground">
                  Max: {mockOrgConfig.maxRecipientsPerSchedule}
                </span>
              </div>

              {/* Recipient Limit Warning */}
              {exceedsRecipientLimit && (
                <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  Recipient limit exceeded. Please remove some recipients.
                </div>
              )}
            </div>

            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Only internal users and groups can receive scheduled reports. 
                External email addresses are not supported for governance and security reasons.
              </p>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email-subject" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Subject
              </Label>
              <Input
                id="email-subject"
                placeholder={`[Chat BI Studio] ${name || 'Report'} - {{date}}`}
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Available variables: {'{{date}}'}, {'{{month}}'}, {'{{year}}'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-body">Custom Message (Optional)</Label>
              <Textarea
                id="email-body"
                placeholder="Add a custom message to include in the email body..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="font-medium">Include AI Summary</Label>
                <p className="text-sm text-muted-foreground">Add an AI-generated executive summary</p>
              </div>
              <Switch checked={includeSummary} onCheckedChange={setIncludeSummary} />
            </div>

            {/* Schedule Summary */}
            <Card className="p-4 bg-muted/50">
              <h4 className="font-medium mb-3">Schedule Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template:</span>
                  <span>{selectedTemplate?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="capitalize">{frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{time} ({timezone.split('/').pop()})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="uppercase">{format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipients:</span>
                  <span>{expandedRecipientCount} total</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              Create Schedule
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
