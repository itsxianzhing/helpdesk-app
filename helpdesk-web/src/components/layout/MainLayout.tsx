import { useState } from 'react';
import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  function toggleSidebar() {
    setIsSidebarCollapsed((current) => !current);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Navbar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;