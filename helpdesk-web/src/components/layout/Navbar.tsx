import {
  Bell,
  CircleUserRound,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Ticket,
  Plus,
  Users,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router";
import { useState } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";

function Navbar() {
  const { logout, auth } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = auth?.role === "Admin";

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="relative flex h-16 items-center justify-between border-b bg-background px-4">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="rounded-md p-2 hover:bg-muted md:hidden"
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <span className="text-lg font-semibold">
          Helpdesk
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          className="rounded-md p-2 hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">
              {auth?.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {auth?.role}
            </p>
          </div>

          <button
            type="button"
            className="rounded-md p-2 hover:bg-muted"
            aria-label="User profile"
          >
            <CircleUserRound size={22} />
          </button>

          <button
            type="button"
            onClick={logout}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-40 border-b bg-background p-4 shadow-md md:hidden">
          <nav className="space-y-1">
            {isAdmin ? (
              <>
                <NavLink
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/admin/tickets"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <ShieldCheck size={18} />
                  Manage Tickets
                </NavLink>

                <NavLink
                  to="/admin/users"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <Users size={18} />
                  Manage Users
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/tickets"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <Ticket size={18} />
                  Tickets
                </NavLink>

                <NavLink
                  to="/tickets/new"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <Plus size={18} />
                  Create Ticket
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;