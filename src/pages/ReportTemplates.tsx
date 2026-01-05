import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/shared/EmptyState";
import { KPICard } from "@/components/shared/KPICard";
import { CreateTemplateDialog } from "@/components/reports/CreateTemplateDialog";
import { TemplateDetailsSheet } from "@/components/reports/TemplateDetailsSheet";
import { mockTemplates } from "@/data/mockReportData";
import type { ReportTemplate } from "@/types/reports";
import {
  FileText,
  Plus,
  MoreVertical,
  Search,
  LayoutDashboard,
  MessageSquare,
  Trash2,
  Edit,
  Eye,
  CalendarClock,
  Copy,
  Tag,
} from "lucide-react";

export default function ReportTemplates() {
  const [templates, setTemplates] = useState<ReportTemplate[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSource = selectedSource === "all" || t.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast({
      title: "Template Deleted",
      description: "Report template has been removed.",
    });
  };

  const handleDuplicateTemplate = (template: ReportTemplate) => {
    const newTemplate: ReportTemplate = {
      ...template,
      id: `t${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
    toast({
      title: "Template Duplicated",
      description: `Created "${newTemplate.name}".`,
    });
  };

  const handleViewDetails = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setIsDetailsOpen(true);
  };

  const handleCreateSchedule = (template: ReportTemplate) => {
    toast({
      title: "Create Schedule",
      description: `Navigate to Schedule Reports to create a schedule for "${template.name}".`,
    });
    // In a real app, this would navigate to Schedule Reports with the template pre-selected
  };

  const dashboardTemplates = templates.filter(t => t.source === 'dashboard');
  const chatTemplates = templates.filter(t => t.source === 'chat');

  return (
    <MainLayout title="Report Templates" subtitle="Create and manage reusable report templates from dashboards and charts.">
      <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard
            title="Total Templates"
            value={templates.length}
            icon={FileText}
          />
          <KPICard
            title="From Dashboards"
            value={dashboardTemplates.length}
            icon={LayoutDashboard}
          />
          <KPICard
            title="From Chat"
            value={chatTemplates.length}
            icon={MessageSquare}
          />
          <KPICard
            title="Active Schedules"
            value={8}
            icon={CalendarClock}
          />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>

        {/* Templates Content */}
        <Tabs value={selectedSource} onValueChange={setSelectedSource}>
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="dashboard">From Dashboard</TabsTrigger>
            <TabsTrigger value="chat">From Chat</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedSource} className="mt-6">
            {filteredTemplates.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No templates found"
                description={searchQuery ? "Try adjusting your search query." : "Create your first report template from a dashboard or chat chart."}
                actionLabel="Create Template"
                onAction={() => setIsCreateDialogOpen(true)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Report Templates
                  </CardTitle>
                  <CardDescription>
                    {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Charts</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {template.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1.5">
                              {template.source === 'dashboard' ? (
                                <LayoutDashboard className="h-3 w-3" />
                              ) : (
                                <MessageSquare className="h-3 w-3" />
                              )}
                              {template.source === 'dashboard' ? 'Dashboard' : 'Chat'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{template.charts.length} chart{template.charts.length !== 1 ? 's' : ''}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {template.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs gap-1">
                                  <Tag className="h-2.5 w-2.5" />
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{template.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {template.createdBy}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(template.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(template)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCreateSchedule(template)}>
                                  <CalendarClock className="h-4 w-4 mr-2" />
                                  Create Schedule
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteTemplate(template.id)}
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
        </Tabs>
      </div>

      {/* Create Template Dialog */}
      <CreateTemplateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={(template) => {
          setTemplates([...templates, template]);
        }}
      />

      {/* Template Details Sheet */}
      <TemplateDetailsSheet
        template={selectedTemplate}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </MainLayout>
  );
}
