import { MoreVertical, RefreshCw, Pencil, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
  onEdit?: () => void;
  onRefresh?: () => void;
  onUnpin?: () => void;
  isPinned?: boolean;
  className?: string;
}

export function ChartCard({
  title,
  description,
  lastUpdated,
  children,
  onEdit,
  onRefresh,
  onUnpin,
  isPinned = true,
  className,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between border-b border-border p-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
          {lastUpdated && (
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onRefresh && (
              <DropdownMenuItem onClick={onRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </DropdownMenuItem>
            )}
            {onUnpin && (
              <DropdownMenuItem onClick={onUnpin}>
                {isPinned ? (
                  <>
                    <PinOff className="mr-2 h-4 w-4" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="mr-2 h-4 w-4" />
                    Pin
                  </>
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
