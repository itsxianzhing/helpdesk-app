import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
}

function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <Icon
          size={20}
          className="text-muted-foreground"
        />
      </div>

      <p className="mt-3 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

export default StatCard;