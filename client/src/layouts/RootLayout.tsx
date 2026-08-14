import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

export default function RootLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          'lg:ml-[260px]',
          sidebarCollapsed && 'lg:ml-16'
        )}
      >
        <Header />
        <main className="p-4 md:p-6 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
