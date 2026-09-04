interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

export default StatCard;