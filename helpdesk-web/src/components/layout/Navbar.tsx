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
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import { NavLink } from 'react-router';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '../../features/auth/hooks/useAuth';

interface NavbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

function Navbar({
  isSidebarCollapsed,
  onToggleSidebar,
}: NavbarProps) {
  const { logout, auth } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = auth?.role === 'Admin';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function closeProfileMenu() {
    setIsProfileMenuOpen(false);
  }

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
      {/* Brand / Navigation controls */}
      <div className="flex items-center gap-2">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="rounded-md p-2 hover:bg-muted md:hidden"
          aria-label={
            isMenuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden rounded-md p-2 hover:bg-muted md:block"
          aria-label={
            isSidebarCollapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
          title={
            isSidebarCollapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>

        <span className="text-lg font-semibold">
          Helpdesk
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="rounded-md p-2 hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2 md:gap-3">
          <div
            ref={profileMenuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setIsProfileMenuOpen((current) => !current)
              }
              className="rounded-md p-2 hover:bg-muted"
              aria-label="Open user menu"
              aria-expanded={isProfileMenuOpen}
            >
              <CircleUserRound size={22} />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-background p-1 shadow-lg">
                {/* Profile */}
                <NavLink
                  to="/profile"
                  onClick={closeProfileMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <CircleUserRound size={18} />

                  <div>
                    <p className="font-medium">
                      Profile
                    </p>

                    <p className="text-xs text-muted-foreground">
                      View and edit your profile
                    </p>
                  </div>
                </NavLink>

                {/* Logout */}
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut size={18} />

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
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

                <NavLink
                  to="/admin/activity-logs"
                  onClick={closeMenu}
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