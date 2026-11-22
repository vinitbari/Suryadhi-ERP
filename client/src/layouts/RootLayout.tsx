import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function RootLayout() {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f4f6f9] dark:bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
