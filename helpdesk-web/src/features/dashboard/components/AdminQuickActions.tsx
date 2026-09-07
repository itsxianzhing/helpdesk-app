import {
  Ticket,
  Users,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router";

function AdminQuickActions() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="font-semibold">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Quickly access common administration tasks.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/tickets"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <Ticket size={16} />
          Manage Tickets
        </Link>

        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <Users size={16} />
          Manage Users
        </Link>

        <Link
          to="/admin/users/create"
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <UserPlus size={16} />
          Create User
        </Link>
      </div>
    </div>
  );
}

export default AdminQuickActions;