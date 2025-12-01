import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Shield,
  Users,
  FileText,
  Plus,
  Pencil,
  UserX,
  UserCheck,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: "active" | "disabled";
  lastLogin: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  status: "success" | "failed";
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    roles: ["Admin"],
    status: "active",
    lastLogin: "2024-01-15 10:30",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    roles: ["Analyst"],
    status: "active",
    lastLogin: "2024-01-15 09:15",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    roles: ["Viewer"],
    status: "active",
    lastLogin: "2024-01-14 16:45",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    roles: ["Analyst", "Viewer"],
    status: "disabled",
    lastLogin: "2024-01-10 11:00",
  },
];

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    permissions: ["Manage users", "Edit data connections", "View dashboard", "Create reports", "Manage roles"],
    userCount: 2,
  },
  {
    id: "2",
    name: "Analyst",
    permissions: ["View dashboard", "Create reports", "Edit data connections"],
    userCount: 5,
  },
  {
    id: "3",
    name: "Viewer",
    permissions: ["View dashboard", "View reports"],
    userCount: 12,
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15 10:30:45",
    user: "John Doe",
    action: "User Login",
    entity: "Authentication",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2024-01-15 10:28:12",
    user: "Jane Smith",
    action: "Created Chart",
    entity: "Dashboard",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2024-01-15 10:15:30",
    user: "Bob Wilson",
    action: "Data Import",
    entity: "Data Sources",
    status: "success",
  },
  {
    id: "4",
    timestamp: "2024-01-15 09:45:00",
    user: "System",
    action: "Scheduled Backup",
    entity: "System",
    status: "success",
  },
  {
    id: "5",
    timestamp: "2024-01-15 09:30:15",
    user: "Alice Brown",
    action: "Connection Test",
    entity: "Database",
    status: "failed",
  },
];

const allPermissions = [
  "Manage users",
  "Manage roles",
  "Edit data connections",
  "View dashboard",
  "Create reports",
  "Delete reports",
  "View audit logs",
  "Export data",
];

export default function RBAC() {
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleSaveUser = () => {
    setShowUserDialog(false);
    toast({
      title: "User Saved",
      description: "User has been updated successfully.",
    });
  };

  const handleSaveRole = () => {
    setShowRoleDialog(false);
    toast({
      title: "Role Saved",
      description: "Role has been updated successfully.",
    });
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    toast({
      title: currentStatus === "active" ? "User Disabled" : "User Enabled",
      description: `User status has been ${currentStatus === "active" ? "disabled" : "enabled"}.`,
    });
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <MainLayout title="RBAC & Audit Logs" subtitle="Manage users, roles, and view activity logs.">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6 grid w-[400px] grid-cols-2">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileText className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="animate-fade-in space-y-6">
          {/* Users Section */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="text-lg font-semibold">Users</h3>
              <Button variant="gradient" onClick={() => setShowUserDialog(true)}>
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={user.status === "active" ? "success" : "default"}
                        label={user.status === "active" ? "Active" : "Disabled"}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setShowUserDialog(true)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                        >
                          {user.status === "active" ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Roles Section */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="text-lg font-semibold">Roles</h3>
              <Button variant="outline" onClick={() => setShowRoleDialog(true)}>
                <Plus className="h-4 w-4" />
                Create Role
              </Button>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-3">
              {mockRoles.map((role) => (
                <Card key={role.id} className="card-hover cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{role.name}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {role.userCount} users
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <span
                          key={perm}
                          className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                          {perm}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                          +{role.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="animate-fade-in">
          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAuditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.entity}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={log.status === "success" ? "success" : "error"}
                        label={log.status === "success" ? "Success" : "Failed"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a new user and assign roles.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-name">Name</Label>
              <Input id="user-name" placeholder="John Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Email</Label>
              <Input id="user-email" type="email" placeholder="john@example.com" />
            </div>
            <div className="grid gap-2">
              <Label>Roles</Label>
              <div className="flex flex-wrap gap-2">
                {mockRoles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted"
                  >
                    <Checkbox />
                    <span className="text-sm">{role.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" placeholder="Custom Role" />
            </div>
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <ScrollArea className="h-[200px] rounded-lg border border-border p-4">
                <div className="space-y-3">
                  {allPermissions.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(perm)}
                        onCheckedChange={() => togglePermission(perm)}
                      />
                      <span className="text-sm">{perm}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
