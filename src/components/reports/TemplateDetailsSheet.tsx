import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ReportTemplate } from "@/types/reports";
import {
  LayoutDashboard,
  MessageSquare,
  Tag,
  Calendar,
  User,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Table,
  CalendarClock,
  Copy,
  Edit,
} from "lucide-react";

interface TemplateDetailsSheetProps {
  template: ReportTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateDetailsSheet({ template, open, onOpenChange }: TemplateDetailsSheetProps) {
  if (!template) return null;

  const chartTypeIcons: Record<string, React.ReactNode> = {
    bar: <BarChart3 className="h-4 w-4" />,
    line: <LineChart className="h-4 w-4" />,
    pie: <PieChart className="h-4 w-4" />,
    area: <TrendingUp className="h-4 w-4" />,
    table: <Table className="h-4 w-4" />,
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{template.name}</SheetTitle>
          <SheetDescription>{template.description}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Source Info */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1.5">
              {template.source === 'dashboard' ? (
                <LayoutDashboard className="h-3 w-3" />
              ) : (
                <MessageSquare className="h-3 w-3" />
              )}
              {template.source === 'dashboard' ? 'Dashboard' : 'Chat'} Template
            </Badge>
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Charts */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Included Charts ({template.charts.length})</h4>
            <div className="space-y-2">
              {template.charts.map((chart) => (
                <Card key={chart.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md">
                      {chartTypeIcons[chart.type] || <BarChart3 className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{chart.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{chart.type} chart</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                Created by {template.createdBy}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created {new Date(template.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Updated {new Date(template.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full gap-2">
              <CalendarClock className="h-4 w-4" />
              Create Schedule
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Duplicate
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
