import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "pending" | "completed" | "failed";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    failed: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  const icons = {
    pending: <Clock className="w-3 h-3 animate-pulse" />,
    completed: <CheckCircle2 className="w-3 h-3" />,
    failed: <XCircle className="w-3 h-3" />,
  };

  const labels = {
    pending: "In Progress",
    completed: "Completed",
    failed: "Failed",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm backdrop-blur-sm",
      styles[status],
      className
    )}>
      {icons[status]}
      {labels[status]}
    </div>
  );
}
