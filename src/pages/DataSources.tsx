import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Upload,
  Database,
  FileSpreadsheet,
  Trash2,
  Eye,
  TestTube,
  Plus,
  Pencil,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImportedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  lastUpdated: string;
  status: "ready" | "processing" | "error";
}

interface DBConnection {
  id: string;
  name: string;
  dbType: string;
  status: "connected" | "failed" | "unknown";
  lastTested: string;
}

const mockFiles: ImportedFile[] = [
  {
    id: "1",
    name: "sales_q4_2024.csv",
    type: "CSV",
    size: "2.4 MB",
    lastUpdated: "2024-01-15",
    status: "ready",
  },
  {
    id: "2",
    name: "customer_data.xlsx",
    type: "Excel",
    size: "5.1 MB",
    lastUpdated: "2024-01-14",
    status: "ready",
  },
  {
    id: "3",
    name: "inventory_report.csv",
    type: "CSV",
    size: "1.2 MB",
    lastUpdated: "2024-01-13",
    status: "processing",
  },
];

const mockConnections: DBConnection[] = [
  {
    id: "1",
    name: "Production Database",
    dbType: "PostgreSQL",
    status: "connected",
    lastTested: "2024-01-15 10:30",
  },
  {
    id: "2",
    name: "Analytics DB",
    dbType: "MySQL",
    status: "connected",
    lastTested: "2024-01-14 15:45",
  },
  {
    id: "3",
    name: "Legacy System",
    dbType: "PostgreSQL",
    status: "failed",
    lastTested: "2024-01-10 09:00",
  },
];

export default function DataSources() {
  const [isDragging, setIsDragging] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [connectionForm, setConnectionForm] = useState({
    name: "",
    dbType: "",
    host: "",
    port: "",
    username: "",
    password: "",
    database: "",
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    toast({
      title: "File Uploaded",
      description: "Your file is being processed...",
    });
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTimeout(() => {
      setIsTestingConnection(false);
      toast({
        title: "Connection Successful",
        description: "Database connection test passed.",
      });
    }, 2000);
  };

  const handleSaveConnection = () => {
    setShowConnectionDialog(false);
    toast({
      title: "Connection Saved",
      description: "Database connection has been saved.",
    });
  };

  const getFileStatusBadge = (status: ImportedFile["status"]) => {
    switch (status) {
      case "ready":
        return <StatusBadge status="success" label="Ready" />;
      case "processing":
        return <StatusBadge status="pending" label="Processing" />;
      case "error":
        return <StatusBadge status="error" label="Error" />;
    }
  };

  const getConnectionStatusBadge = (status: DBConnection["status"]) => {
    switch (status) {
      case "connected":
        return <StatusBadge status="success" label="Connected" />;
      case "failed":
        return <StatusBadge status="error" label="Failed" />;
      case "unknown":
        return <StatusBadge status="default" label="Unknown" />;
    }
  };

  return (
    <MainLayout title="Data Sources" subtitle="Import files and manage database connections.">
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="mb-6 grid w-[300px] grid-cols-2">
          <TabsTrigger value="files" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            File Import
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="animate-fade-in">
          {/* Upload Area */}
          <div
            className={cn(
              "mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Drop files here</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse from your computer
            </p>
            <Button variant="outline" className="mt-4">
              Browse Files
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Supported formats: CSV, Excel, JSON • Max size: 50MB
            </p>
          </div>

          {/* Files Table */}
          {mockFiles.length === 0 ? (
            <EmptyState
              icon={FileSpreadsheet}
              title="No files imported yet"
              description="Upload CSV, Excel, or JSON files to get started."
            />
          ) : (
            <div className="rounded-xl border border-border bg-card shadow-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>{file.type}</TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.lastUpdated}</TableCell>
                      <TableCell>{getFileStatusBadge(file.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <TestTube className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="database" className="animate-fade-in">
          {/* Connection Form */}
          <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Add Database Connection</h3>
              <Button variant="gradient" onClick={() => setShowConnectionDialog(true)}>
                <Plus className="h-4 w-4" />
                New Connection
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label htmlFor="conn-name">Connection Name</Label>
                <Input
                  id="conn-name"
                  placeholder="My Database"
                  className="mt-1.5"
                  value={connectionForm.name}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="db-type">Database Type</Label>
                <Select
                  value={connectionForm.dbType}
                  onValueChange={(v) =>
                    setConnectionForm({ ...connectionForm, dbType: v })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  placeholder="localhost"
                  className="mt-1.5"
                  value={connectionForm.host}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, host: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  placeholder="5432"
                  className="mt-1.5"
                  value={connectionForm.port}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, port: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  className="mt-1.5"
                  value={connectionForm.username}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, username: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1.5"
                  value={connectionForm.password}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, password: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="database">Database Name</Label>
                <Input
                  id="database"
                  placeholder="my_database"
                  className="mt-1.5"
                  value={connectionForm.database}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, database: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={handleTestConnection} disabled={isTestingConnection}>
                {isTestingConnection && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Test Connection
              </Button>
              <Button variant="outline" onClick={handleSaveConnection}>
                Save Connection
              </Button>
            </div>
          </div>

          {/* Connections Table */}
          {mockConnections.length === 0 ? (
            <EmptyState
              icon={Database}
              title="No database connections yet"
              description="Add a database connection to query your data directly."
            />
          ) : (
            <div className="rounded-xl border border-border bg-card shadow-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Tested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockConnections.map((conn) => (
                    <TableRow key={conn.id}>
                      <TableCell className="font-medium">{conn.name}</TableCell>
                      <TableCell>{conn.dbType}</TableCell>
                      <TableCell>{getConnectionStatusBadge(conn.status)}</TableCell>
                      <TableCell>{conn.lastTested}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Connection Dialog */}
      <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Database Connection</DialogTitle>
            <DialogDescription>
              Enter your database credentials to create a new connection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dialog-name">Connection Name</Label>
              <Input id="dialog-name" placeholder="Production DB" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dialog-type">Database Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dialog-host">Host</Label>
                <Input id="dialog-host" placeholder="localhost" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dialog-port">Port</Label>
                <Input id="dialog-port" placeholder="5432" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dialog-user">Username</Label>
                <Input id="dialog-user" placeholder="admin" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dialog-pass">Password</Label>
                <Input id="dialog-pass" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dialog-db">Database</Label>
              <Input id="dialog-db" placeholder="my_database" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConnection}>Save Connection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
