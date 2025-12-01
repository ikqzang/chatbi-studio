import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  TestTube,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataSource {
  id: string;
  name: string;
  type: "file" | "database";
  status: "not_tested" | "passed" | "failed";
}

interface SchemaColumn {
  name: string;
  type: string;
  sample: string;
}

interface ValidationIssue {
  severity: "error" | "warning" | "info";
  message: string;
  column?: string;
}

const mockDataSources: DataSource[] = [
  { id: "1", name: "sales_q4_2024.csv", type: "file", status: "passed" },
  { id: "2", name: "customer_data.xlsx", type: "file", status: "failed" },
  { id: "3", name: "Production Database", type: "database", status: "passed" },
  { id: "4", name: "inventory_report.csv", type: "file", status: "not_tested" },
  { id: "5", name: "Analytics DB", type: "database", status: "not_tested" },
];

const mockSchema: SchemaColumn[] = [
  { name: "id", type: "integer", sample: "1001" },
  { name: "product_name", type: "string", sample: "Widget Pro" },
  { name: "category", type: "string", sample: "Electronics" },
  { name: "price", type: "decimal", sample: "29.99" },
  { name: "quantity", type: "integer", sample: "150" },
  { name: "created_at", type: "timestamp", sample: "2024-01-15 10:30:00" },
];

const mockSampleData = [
  { id: 1001, product_name: "Widget Pro", category: "Electronics", price: 29.99, quantity: 150 },
  { id: 1002, product_name: "Gadget Plus", category: "Electronics", price: 49.99, quantity: 75 },
  { id: 1003, product_name: "Tool Basic", category: "Hardware", price: 15.99, quantity: 300 },
  { id: 1004, product_name: "Accessory X", category: "Accessories", price: 9.99, quantity: 500 },
  { id: 1005, product_name: "Device Max", category: "Electronics", price: 199.99, quantity: 25 },
];

const mockIssues: ValidationIssue[] = [
  { severity: "error", message: "Null values found in required column", column: "product_name" },
  { severity: "warning", message: "Inconsistent date format detected", column: "created_at" },
  { severity: "info", message: "Column has high cardinality (500+ unique values)", column: "id" },
];

export default function DataTests() {
  const [selectedSource, setSelectedSource] = useState<string>("1");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<"passed" | "failed" | null>("passed");

  const handleRunValidation = () => {
    setIsValidating(true);
    setValidationResult(null);
    setTimeout(() => {
      setIsValidating(false);
      setValidationResult("passed");
      toast({
        title: "Validation Complete",
        description: "Data source passed all validation checks.",
      });
    }, 2000);
  };

  const handleRunQuery = () => {
    toast({
      title: "Query Executed",
      description: "Sample query completed successfully.",
    });
  };

  const getStatusBadge = (status: DataSource["status"]) => {
    switch (status) {
      case "passed":
        return <StatusBadge status="success" label="Passed" />;
      case "failed":
        return <StatusBadge status="error" label="Failed" />;
      case "not_tested":
        return <StatusBadge status="default" label="Not Tested" />;
    }
  };

  const getSeverityIcon = (severity: ValidationIssue["severity"]) => {
    switch (severity) {
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <CheckCircle2 className="h-4 w-4 text-info" />;
    }
  };

  const selectedSourceData = mockDataSources.find((s) => s.id === selectedSource);

  return (
    <MainLayout title="Data Tests" subtitle="Validate and preview your data sources.">
      <div className="flex h-[calc(100vh-10rem)] gap-6">
        {/* Left Panel - Data Sources List */}
        <div className="w-80 shrink-0 rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold">Data Sources</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a source to test
            </p>
          </div>
          <ScrollArea className="h-[calc(100%-80px)]">
            <div className="space-y-1 p-2">
              {mockDataSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source.id)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg p-3 text-left transition-colors",
                    selectedSource === source.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {source.type === "file" ? (
                      <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Database className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{source.name}</span>
                  </div>
                  {getStatusBadge(source.status)}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Details */}
        <div className="flex-1 space-y-6 overflow-auto">
          {selectedSourceData ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedSourceData.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedSourceData.type === "file" ? "Imported File" : "Database Connection"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleRunQuery} variant="outline">
                    <Play className="h-4 w-4" />
                    Run Sample Query
                  </Button>
                  <Button onClick={handleRunValidation} disabled={isValidating}>
                    {isValidating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    Run Validation
                  </Button>
                </div>
              </div>

              {/* Validation Results */}
              {validationResult && (
                <Card
                  className={cn(
                    "border-2",
                    validationResult === "passed"
                      ? "border-success/50 bg-success/5"
                      : "border-destructive/50 bg-destructive/5"
                  )}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {validationResult === "passed" ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-success" />
                          <span className="text-success">Validation Passed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-destructive" />
                          <span className="text-destructive">Validation Failed</span>
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockIssues.map((issue, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 rounded-lg bg-background/50 p-3"
                        >
                          {getSeverityIcon(issue.severity)}
                          <div>
                            <p className="text-sm font-medium">{issue.message}</p>
                            {issue.column && (
                              <p className="text-xs text-muted-foreground">
                                Column: {issue.column}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Schema Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Schema Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Column Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Sample Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSchema.map((col) => (
                        <TableRow key={col.name}>
                          <TableCell className="font-mono text-sm">{col.name}</TableCell>
                          <TableCell>
                            <span className="rounded bg-muted px-2 py-1 text-xs font-medium">
                              {col.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{col.sample}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Sample Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Sample Data (First 5 Rows)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockSampleData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-mono">{row.id}</TableCell>
                            <TableCell>{row.product_name}</TableCell>
                            <TableCell>{row.category}</TableCell>
                            <TableCell>${row.price}</TableCell>
                            <TableCell>{row.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <EmptyState
              icon={TestTube}
              title="Select a data source"
              description="Choose a data source from the list to view its schema and run validation tests."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
