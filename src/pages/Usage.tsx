import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/shared/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  BarChart3,
  Database,
  Coins,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { Progress } from "@/components/ui/progress";

const usageData = [
  { date: "Jan 1", chats: 120, charts: 45 },
  { date: "Jan 2", chats: 150, charts: 62 },
  { date: "Jan 3", chats: 180, charts: 78 },
  { date: "Jan 4", chats: 140, charts: 55 },
  { date: "Jan 5", chats: 220, charts: 95 },
  { date: "Jan 6", chats: 190, charts: 82 },
  { date: "Jan 7", chats: 240, charts: 110 },
];

const creditData = [
  { name: "Week 1", used: 2400, limit: 5000 },
  { name: "Week 2", used: 1398, limit: 5000 },
  { name: "Week 3", used: 3800, limit: 5000 },
  { name: "Week 4", used: 2908, limit: 5000 },
];

const projectionData = [
  { date: "Today", actual: 2500, projected: 2500 },
  { date: "+3 days", actual: null, projected: 3200 },
  { date: "+7 days", actual: null, projected: 4100 },
  { date: "+14 days", actual: null, projected: 5800 },
  { date: "+21 days", actual: null, projected: 7200 },
  { date: "+30 days", actual: null, projected: 9500 },
];

export default function Usage() {
  return (
    <MainLayout title="Usage & Credits" subtitle="Monitor your usage and credit consumption.">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Chats"
          value="1,247"
          icon={MessageSquare}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Charts Generated"
          value="384"
          icon={BarChart3}
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Data Sources"
          value="12"
          icon={Database}
          trend={{ value: 2, isPositive: true }}
        />
        <KPICard
          title="Remaining Credits"
          value="2,450"
          icon={Coins}
          trend={{ value: 15, isPositive: false }}
        />
      </div>

      {/* Usage Over Time */}
      <Card className="mb-6 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Usage Over Time</CardTitle>
          <div className="flex items-center gap-3">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCharts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="chats"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorChats)"
                name="Chats"
              />
              <Area
                type="monotone"
                dataKey="charts"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCharts)"
                name="Charts"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Chats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Charts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Credit Consumption */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Credit Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Plan</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Pro Plan
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Credits Used</span>
                  <span className="font-medium">7,550 / 10,000</span>
                </div>
                <Progress value={75.5} className="h-3" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold text-success">2,450 credits</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Billing Cycle</span>
                <span className="font-medium">Jan 1 - Jan 31</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={creditData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="used" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Used" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Projected Usage */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Projected Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 rounded-lg bg-warning/10 border border-warning/20 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/20">
                  <TrendingUp className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-warning">Heads up!</p>
                  <p className="text-sm text-muted-foreground">
                    Based on your current usage, you may exceed your credit limit before the end of the billing cycle.
                  </p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "hsl(var(--warning))" }}
                  name="Projected"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-dashed border-warning bg-transparent" />
                <span className="text-sm text-muted-foreground">Projected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
