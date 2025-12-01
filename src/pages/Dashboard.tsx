import { MainLayout } from "@/components/layout/MainLayout";
import { ChartCard } from "@/components/shared/ChartCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutDashboard, Plus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const barData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
];

const lineData = [
  { name: "Week 1", users: 4000, sessions: 2400 },
  { name: "Week 2", users: 3000, sessions: 1398 },
  { name: "Week 3", users: 2000, sessions: 9800 },
  { name: "Week 4", users: 2780, sessions: 3908 },
];

const pieData = [
  { name: "Desktop", value: 400, color: "hsl(217, 91%, 60%)" },
  { name: "Mobile", value: 300, color: "hsl(142, 71%, 45%)" },
  { name: "Tablet", value: 200, color: "hsl(38, 92%, 50%)" },
];

const areaData = [
  { name: "Mon", revenue: 4000 },
  { name: "Tue", revenue: 3000 },
  { name: "Wed", revenue: 5000 },
  { name: "Thu", revenue: 2780 },
  { name: "Fri", revenue: 1890 },
  { name: "Sat", revenue: 2390 },
  { name: "Sun", revenue: 3490 },
];

interface PinnedChart {
  id: string;
  title: string;
  description: string;
  type: "bar" | "line" | "pie" | "area";
  lastUpdated: string;
}

const mockPinnedCharts: PinnedChart[] = [
  {
    id: "1",
    title: "Monthly Revenue",
    description: "Revenue trends by month",
    type: "bar",
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    title: "User Growth",
    description: "Weekly active users and sessions",
    type: "line",
    lastUpdated: "5 hours ago",
  },
  {
    id: "3",
    title: "Traffic Sources",
    description: "Distribution by device type",
    type: "pie",
    lastUpdated: "1 day ago",
  },
  {
    id: "4",
    title: "Weekly Revenue",
    description: "Daily revenue overview",
    type: "area",
    lastUpdated: "3 hours ago",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Chart",
      description: `Opening editor for chart ${id}`,
    });
  };

  const handleRefresh = (id: string) => {
    toast({
      title: "Refreshing",
      description: "Chart data is being refreshed...",
    });
  };

  const handleUnpin = (id: string) => {
    toast({
      title: "Chart Unpinned",
      description: "The chart has been removed from your dashboard.",
    });
  };

  const renderChart = (type: string) => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="hsl(var(--success))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <MainLayout title="Dashboard" subtitle="View and manage your pinned charts.">
      {/* Filters */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Data Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Data Sources</SelectItem>
              <SelectItem value="sales">Sales Data</SelectItem>
              <SelectItem value="analytics">User Analytics</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
        <Button variant="gradient" onClick={() => navigate("/")}>
          <Plus className="h-4 w-4" />
          Create Chart
        </Button>
      </div>

      {/* Charts Grid */}
      {mockPinnedCharts.length === 0 ? (
        <EmptyState
          icon={LayoutDashboard}
          title="No pinned charts yet"
          description="Create BI charts from the Chat page and pin them to your dashboard."
          actionLabel="Go to Chat"
          onAction={() => navigate("/")}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {mockPinnedCharts.map((chart) => (
            <ChartCard
              key={chart.id}
              title={chart.title}
              description={chart.description}
              lastUpdated={chart.lastUpdated}
              onEdit={() => handleEdit(chart.id)}
              onRefresh={() => handleRefresh(chart.id)}
              onUnpin={() => handleUnpin(chart.id)}
            >
              {renderChart(chart.type)}
            </ChartCard>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
