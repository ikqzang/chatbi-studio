import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "default" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  default: "bg-muted text-muted-foreground border-border",
  pending: "bg-primary/10 text-primary border-primary/20",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        statusStyles[status],
        className
      )}
    >
      <span
        className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          status === "success" && "bg-success",
          status === "warning" && "bg-warning",
          status === "error" && "bg-destructive",
          status === "info" && "bg-info",
          status === "default" && "bg-muted-foreground",
          status === "pending" && "bg-primary animate-pulse-soft"
        )}
      />
      {label}
    </span>
  );
}
