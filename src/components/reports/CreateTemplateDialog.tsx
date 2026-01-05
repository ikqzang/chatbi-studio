import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { mockDashboardsForTemplate } from "@/data/mockReportData";
import type { ReportTemplate, ChartType } from "@/types/reports";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BarChart3,
  LineChart,
  PieChart,
  Table,
  TrendingUp,
  Tag,
  X,
} from "lucide-react";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (template: ReportTemplate) => void;
}

export function CreateTemplateDialog({ open, onOpenChange, onSuccess }: CreateTemplateDialogProps) {
  const [source, setSource] = useState<'dashboard' | 'chat'>('dashboard');
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDashboard, setSelectedDashboard] = useState("");
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Chat chart config
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [dimensions, setDimensions] = useState("");
  const [metrics, setMetrics] = useState("");

  const selectedDashboardData = mockDashboardsForTemplate.find(d => d.id === selectedDashboard);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked && selectedDashboardData) {
      setSelectedCharts(selectedDashboardData.charts.map(c => c.id));
    } else {
      setSelectedCharts([]);
    }
  };

  const handleChartToggle = (chartId: string) => {
    if (selectedCharts.includes(chartId)) {
      setSelectedCharts(selectedCharts.filter(id => id !== chartId));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedCharts, chartId];
      setSelectedCharts(newSelected);
      if (selectedDashboardData && newSelected.length === selectedDashboardData.charts.length) {
        setSelectAll(true);
      }
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag.toLowerCase())) {
      setTags([...tags, newTag.toLowerCase()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast({ title: "Error", description: "Please enter a template name.", variant: "destructive" });
      return;
    }

    if (source === 'dashboard' && selectedCharts.length === 0) {
      toast({ title: "Error", description: "Please select at least one chart.", variant: "destructive" });
      return;
    }

    const template: ReportTemplate = {
      id: `t${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      source,
      sourceId: source === 'dashboard' ? selectedDashboard : `chat-${Date.now()}`,
      charts: source === 'dashboard'
        ? selectedCharts.map(id => {
            const chart = selectedDashboardData?.charts.find(c => c.id === id);
            return {
              id,
              title: chart?.title || 'Unknown Chart',
              type: 'bar' as ChartType,
              dimensions: ['category'],
              metrics: ['value'],
              dataSourceId: 'ds1',
            };
          })
        : [{
            id: `c${Date.now()}`,
            title: name,
            type: chartType,
            dimensions: dimensions.split(',').map(d => d.trim()).filter(Boolean),
            metrics: metrics.split(',').map(m => m.trim()).filter(Boolean),
            dataSourceId: 'ds1',
          }],
      layout: source === 'dashboard' ? { columns: 2, chartOrder: selectedCharts } : undefined,
      tags,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      updatedAt: new Date().toISOString(),
    };

    onSuccess(template);
    toast({
      title: "Template Created",
      description: `"${template.name}" has been saved.`,
    });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setName("");
    setDescription("");
    setSelectedDashboard("");
    setSelectedCharts([]);
    setSelectAll(false);
    setTags([]);
    setNewTag("");
    setChartType('bar');
    setDimensions("");
    setMetrics("");
    onOpenChange(false);
  };

  const canProceed = () => {
    if (step === 1) {
      if (source === 'dashboard') {
        return selectedDashboard && selectedCharts.length > 0;
      }
      return chartType && dimensions && metrics;
    }
    return name.trim().length > 0;
  };

  const chartTypeIcons: Record<ChartType, React.ReactNode> = {
    bar: <BarChart3 className="h-4 w-4" />,
    line: <LineChart className="h-4 w-4" />,
    pie: <PieChart className="h-4 w-4" />,
    area: <TrendingUp className="h-4 w-4" />,
    table: <Table className="h-4 w-4" />,
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Report Template
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? "Select the source for your report template." : "Configure template details."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 py-4">
            <Tabs value={source} onValueChange={(v) => setSource(v as 'dashboard' | 'chat')}>
              <TabsList className="w-full">
                <TabsTrigger value="dashboard" className="flex-1 gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  From Dashboard
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1 gap-2">
                  <MessageSquare className="h-4 w-4" />
                  From Chat Chart
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Select Dashboard</Label>
                  <Select value={selectedDashboard} onValueChange={(v) => {
                    setSelectedDashboard(v);
                    setSelectedCharts([]);
                    setSelectAll(false);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a dashboard" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDashboardsForTemplate.map((dashboard) => (
                        <SelectItem key={dashboard.id} value={dashboard.id}>
                          {dashboard.name} ({dashboard.chartCount} charts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDashboardData && (
                  <div className="space-y-3">
                    <Label>Select Charts to Include</Label>
                    <Card className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <Checkbox
                            id="select-all"
                            checked={selectAll}
                            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                          />
                          <Label htmlFor="select-all" className="font-medium cursor-pointer">
                            Select All Charts
                          </Label>
                          <Badge variant="secondary" className="ml-auto">
                            {selectedCharts.length} / {selectedDashboardData.charts.length}
                          </Badge>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {selectedDashboardData.charts.map((chart) => (
                            <div key={chart.id} className="flex items-center gap-2">
                              <Checkbox
                                id={chart.id}
                                checked={selectedCharts.includes(chart.id)}
                                onCheckedChange={() => handleChartToggle(chart.id)}
                              />
                              <Label htmlFor={chart.id} className="font-normal cursor-pointer">
                                {chart.title}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chat" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['bar', 'line', 'pie', 'area', 'table'] as ChartType[]).map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={chartType === type ? "default" : "outline"}
                        className="flex flex-col gap-1 h-auto py-3"
                        onClick={() => setChartType(type)}
                      >
                        {chartTypeIcons[type]}
                        <span className="text-xs capitalize">{type}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., date, category, region"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated field names</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metrics">Metrics</Label>
                  <Input
                    id="metrics"
                    placeholder="e.g., revenue, count, average"
                    value={metrics}
                    onChange={(e) => setMetrics(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated field names</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                placeholder="e.g., Weekly Sales Performance"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                placeholder="Describe the purpose of this template..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Card className="p-4 bg-muted/50">
              <div className="text-sm space-y-1">
                <p className="font-medium">Template Summary</p>
                <p className="text-muted-foreground">
                  Source: {source === 'dashboard' ? selectedDashboardData?.name : 'Chat Chart'}
                </p>
                <p className="text-muted-foreground">
                  Charts: {source === 'dashboard' ? selectedCharts.length : 1}
                </p>
              </div>
            </Card>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === 1 ? (
            <Button onClick={() => setStep(2)} disabled={!canProceed()}>
              Next
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={!canProceed()}>
              Create Template
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
