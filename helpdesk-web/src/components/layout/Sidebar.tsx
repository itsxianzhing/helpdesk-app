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

interface SidebarProps {
  isCollapsed: boolean;
}

function Sidebar({ isCollapsed }: SidebarProps) {
  const { auth, logout } = useAuth();

  const isAdmin = auth?.role === 'Admin';

  const navLinkClass = 'flex items-center rounded-md py-2 text-sm hover:bg-muted';

  return (
    <aside
      className={`hidden min-h-0 shrink-0 border-r bg-background md:flex md:flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        transition: 'width 200ms ease',
      }}
    >
      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <nav className="space-y-1 p-2">
          {isAdmin ? (
            <>
              <NavLink
                to="/admin/dashboard"
                className={`${navLinkClass} ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}
                title={isCollapsed ? 'Dashboard' : undefined}
              >
                <LayoutDashboard size={18} className="shrink-0" />

                <span
                  className={`whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'pointer-events-none w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                  style={{
                    transition: 'opacity 100ms ease, width 200ms ease',
                  }}
                >
                  Dashboard
                </span>
              </NavLink>

              <NavLink
                to="/admin/tickets"
                className={`${navLinkClass} ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}
                title={isCollapsed ? 'Manage Tickets' : undefined}
              >
                <ShieldCheck size={18} className="shrink-0" />

                <span
                  className={`whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'pointer-events-none w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                  style={{
                    transition: 'opacity 100ms ease, width 200ms ease',
                  }}
                >
                  Manage Tickets
                </span>
              </NavLink>

              <NavLink
                to="/admin/users"
                className={`${navLinkClass} ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}
                title={isCollapsed ? 'Manage Users' : undefined}
              >
                <Users size={18} className="shrink-0" />

                <span
                  className={`whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'pointer-events-none w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                  style={{
                    transition: 'opacity 100ms ease, width 200ms ease',
                  }}
                >
                  Manage Users
                </span>
              </NavLink>

              <NavLink
                to="/admin/activity-logs"
                className={`${navLinkClass} ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}
                title={isCollapsed ? 'Activity Logs' : undefined}
              >
                <ClipboardList size={18} className="shrink-0" />

                <span
                  className={`whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'pointer-events-none w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                  style={{
                    transition: 'opacity 100ms ease, width 200ms ease',
                  }}
                >
                  Activity Logs
                </span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={`${navLinkClass} ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}
                title={isCollapsed ? 'Dashboard' : undefined}
              >
                <LayoutDashboard size={18} className="shrink-0" />

                <span
                  className={`whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'pointer-events-none w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                  style={{
                    transition: 'opacity 100ms ease, width 200ms ease',
                  }}
                >
                  Dashboard
                </span>
              </NavLink>

              <NavLink
                to="/tickets"
                className={`${navLinkClass} ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}
                title={isCollapsed ? 'Tickets' : undefined}
              >
                <Ticket size={18} className="shrink-0" />

                <span
                  className={`whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'pointer-events-none w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                  style={{
                    transition: 'opacity 100ms ease, width 200ms ease',
                  }}
                >
                  Tickets
                </span>
              </NavLink>

              <NavLink
                to="/tickets/new"
                className={`${navLinkClass} ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}
                title={isCollapsed ? 'Create Ticket' : undefined}
              >
                <Plus size={18} className="shrink-0" />

                <span
                  className={`whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'pointer-events-none w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                  style={{
                    transition: 'opacity 100ms ease, width 200ms ease',
                  }}
                >
                  Create Ticket
                </span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* User section */}
      <div className="shrink-0 border-t bg-background p-2">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-1'}`}>
          <NavLink
            to="/profile"
            className={`flex min-w-0 items-center rounded-md py-2 hover:bg-muted ${
              isCollapsed ? 'justify-center px-2' : 'flex-1 gap-3 px-3'
            }`}
            title={isCollapsed ? 'Profile' : undefined}
          >
            <UserCircle size={20} className="shrink-0 text-muted-foreground" />

            <div
              className={`min-w-0 overflow-hidden whitespace-nowrap ${
                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}
              style={{
                transition: 'opacity 100ms ease, width 200ms ease',
              }}
            >
              <p className="truncate text-sm font-medium">{auth?.name}</p>

              <p className="text-xs text-muted-foreground">{auth?.role}</p>
            </div>
          </NavLink>

          {/* Logout only when expanded */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={logout}
              className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
