import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { computeNextRuns } from "@/data/mockReportData";
import type { Schedule } from "@/types/reports";
import {
  CalendarClock,
  Clock,
  Globe,
  Users,
  Mail,
  Calendar,
  User,
  FileText,
  Send,
  TestTube,
  Pause,
  Play,
  Edit,
} from "lucide-react";

interface ScheduleDetailsSheetProps {
  schedule: Schedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDetailsSheet({ schedule, open, onOpenChange }: ScheduleDetailsSheetProps) {
  if (!schedule) return null;

  const nextRuns = computeNextRuns(schedule, 5);

  const formatFrequency = () => {
    if (schedule.frequency === 'daily') return 'Daily';
    if (schedule.frequency === 'weekly') return `Every ${schedule.dayOfWeek}`;
    if (schedule.frequency === 'monthly') return `Monthly on day ${schedule.dayOfMonth}`;
    return schedule.frequency;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <SheetTitle>{schedule.name}</SheetTitle>
            <StatusBadge
              status={schedule.status === 'active' ? 'success' : 'warning'}
              label={schedule.status}
            />
          </div>
          <SheetDescription>
            Based on "{schedule.templateName}"
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Schedule Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Schedule Configuration
            </h4>
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Frequency
                </span>
                <span>{formatFrequency()} at {schedule.time}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Timezone
                </span>
                <span>{schedule.timezone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Format
                </span>
                <Badge variant="outline" className="uppercase">{schedule.format}</Badge>
              </div>
            </Card>
          </div>

          <Separator />

          {/* Recipients */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recipients ({schedule.recipients.reduce((sum, r) => sum + (r.memberCount || 1), 0)} total)
            </h4>
            <div className="flex flex-wrap gap-2">
              {schedule.recipients.map((recipient) => (
                <Badge key={recipient.id} variant="secondary" className="py-1.5">
                  {recipient.name}
                  {recipient.type === 'group' && (
                    <span className="text-muted-foreground ml-1">({recipient.memberCount})</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Email Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Settings
            </h4>
            <Card className="p-4 space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Subject: </span>
                <span>{schedule.emailSubject}</span>
              </div>
              {schedule.emailBody && (
                <div>
                  <span className="text-muted-foreground">Message: </span>
                  <span>{schedule.emailBody}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">AI Summary: </span>
                <Badge variant={schedule.includeSummary ? "default" : "secondary"}>
                  {schedule.includeSummary ? "Included" : "Not included"}
                </Badge>
              </div>
            </Card>
          </div>

          <Separator />

          {/* Next Runs */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Runs
            </h4>
            {schedule.status === 'paused' ? (
              <p className="text-sm text-muted-foreground">Schedule is paused. No upcoming runs.</p>
            ) : (
              <div className="space-y-2">
                {nextRuns.map((run, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(run).toLocaleString()}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Created by {schedule.createdBy}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Created {new Date(schedule.createdAt).toLocaleDateString()}
            </div>
            {schedule.lastRun && schedule.lastRun !== '-' && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last run {new Date(schedule.lastRun).toLocaleString()}
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Send Now
              </Button>
              <Button variant="outline" className="gap-2">
                <TestTube className="h-4 w-4" />
                Send Test
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" className="gap-2">
                {schedule.status === 'active' ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
