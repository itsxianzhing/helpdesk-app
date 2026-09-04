import { Link } from "react-router";
import { List, Plus } from "lucide-react";

function QuickActions() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="font-semibold">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Quickly access common actions.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/tickets/create"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <Plus size={16} />
          Create Ticket
        </Link>

        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <List size={16} />
          View My Tickets
        </Link>
      </div>
    </div>
  );
}

export default QuickActions;