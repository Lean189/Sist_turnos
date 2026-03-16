import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div className={cn("bg-card border rounded-3xl p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            trend.isPositive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
          )}>
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold tracking-tight">{value}</h3>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </div>
    </div>
  );
}
