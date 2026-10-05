import {
  LayoutDashboard,
  Ticket,
  Plus,
  Users,
  ShieldCheck,
  UserCircle,
  ClipboardList,
  LogOut,
} from 'lucide-react';

import { NavLink } from 'react-router';

import { useAuth } from '../../features/auth/hooks/useAuth';

function Sidebar() {
  const { auth, logout } = useAuth();

  const isAdmin = auth?.role === 'Admin';

  return (
    <aside className="hidden min-h-0 w-64 shrink-0 border-r bg-background md:flex md:flex-col">
      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <nav className="space-y-1 p-4">
          {isAdmin ? (
            <>
              <NavLink
                to="/admin/dashboard"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/tickets"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <ShieldCheck size={18} />
                Manage Tickets
              </NavLink>

              <NavLink
                to="/admin/users"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <Users size={18} />
                Manage Users
              </NavLink>

              <NavLink
                to="/admin/activity-logs"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <ClipboardList size={18} />
                Activity Logs
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>

              <NavLink
                to="/tickets"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <Ticket size={18} />
                Tickets
              </NavLink>

              <NavLink
                to="/tickets/new"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <Plus size={18} />
                Create Ticket
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* User section */}
      <div className="shrink-0 border-t bg-background p-3">
        <div className="flex items-center gap-2">
          <NavLink
            to="/profile"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-2 py-2 hover:bg-muted"
          >
            <UserCircle
              size={20}
              className="shrink-0 text-muted-foreground"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {auth?.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {auth?.role}
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={logout}
            className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;