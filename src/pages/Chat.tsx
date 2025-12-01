import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Plus,
  Search,
  MessageSquare,
  BarChart3,
  Clock,
  ChevronRight,
  Settings2,
  Play,
  Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
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
} from "recharts";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Sales Analysis Q4",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    preview: "Show me the sales trends...",
  },
  {
    id: "2",
    title: "Customer Segmentation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    preview: "Analyze customer demographics...",
  },
  {
    id: "3",
    title: "Revenue Dashboard",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    preview: "Create a revenue breakdown...",
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Show me the sales trends for Q4",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    role: "assistant",
    content:
      "I'll analyze the Q4 sales data for you. Based on the data, here's a summary:\n\n• Total Revenue: $2.4M (+12% vs Q3)\n• Top Product: Enterprise Suite ($890K)\n• Best Region: North America (45% of total)\n\nWould you like me to create a visualization for this data?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
];

const mockChartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
];

const pieData = [
  { name: "Product A", value: 400, color: "hsl(217, 91%, 60%)" },
  { name: "Product B", value: 300, color: "hsl(142, 71%, 45%)" },
  { name: "Product C", value: 200, color: "hsl(38, 92%, 50%)" },
  { name: "Product D", value: 100, color: "hsl(199, 89%, 48%)" },
];

export default function Chat() {
  const [mode, setMode] = useState<"chat" | "chart">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [dataSource, setDataSource] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I understand your request. Let me analyze the data and provide insights...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleGenerateChart = () => {
    toast({
      title: "Chart Generated",
      description: "Your chart has been created successfully.",
    });
  };

  const handleSaveChart = () => {
    toast({
      title: "Chart Saved",
      description: "Chart has been pinned to your dashboard.",
    });
  };

  const filteredConversations = mockConversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
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
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <MainLayout title="Chat" subtitle="Start chats and generate BI insights.">
      <div className="flex h-[calc(100vh-10rem)] gap-6">
        {/* Left Panel - Chat History */}
        <div className="w-80 shrink-0 rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-4">
            <Button className="w-full" variant="gradient">
              <Plus className="h-4 w-4" />
              New Conversation
            </Button>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-120px)]">
            <div className="space-y-1 p-2">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No conversations yet
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={cn(
                      "w-full rounded-lg p-3 text-left transition-colors",
                      selectedConversation === conversation.id
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{conversation.title}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {conversation.preview}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {conversation.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Chat/Chart Area */}
        <div className="flex flex-1 flex-col rounded-xl border border-border bg-card shadow-card">
          {/* Mode Selector */}
          <div className="border-b border-border p-4">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "chat" | "chart")}>
              <TabsList className="grid w-[240px] grid-cols-2">
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="chart" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Chart
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {mode === "chat" ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex animate-slide-up",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={cn(
                            "mt-1 text-xs",
                            message.role === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Quick Prompts */}
              <div className="border-t border-border px-4 py-2">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {["Show sales trends", "Compare metrics", "Generate report"].map(
                    (prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputValue(prompt)}
                        className="shrink-0"
                      >
                        {prompt}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} variant="gradient">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1">
              {/* Chart Preview */}
              <div className="flex-1 p-6">
                <div className="rounded-lg border border-border bg-background p-6">
                  <h3 className="mb-4 font-semibold">Chart Preview</h3>
                  {dataSource ? (
                    renderChart()
                  ) : (
                    <EmptyState
                      icon={BarChart3}
                      title="No chart configured yet"
                      description="Select a data source and chart type to generate a visualization."
                    />
                  )}
                </div>
              </div>

              {/* Configuration Panel */}
              <div className="w-80 border-l border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Configuration</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Data Source
                    </label>
                    <Select value={dataSource} onValueChange={setDataSource}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales_data">Sales Data</SelectItem>
                        <SelectItem value="user_analytics">User Analytics</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Chart Type
                    </label>
                    <Select value={chartType} onValueChange={setChartType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="table">Table</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Dimension
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dimension" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="region">Region</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Metric</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      className="w-full"
                      onClick={handleGenerateChart}
                      disabled={!dataSource}
                    >
                      <Play className="h-4 w-4" />
                      Generate Chart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSaveChart}
                      disabled={!dataSource}
                    >
                      <Pin className="h-4 w-4" />
                      Save to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
