import { useUIStore } from './ui';

export { useAuthStore } from '@/features/auth';
export { useUIStore } from './ui';

// Alias stores for backward compatibility
export const useSidebarStore = () => {
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  return { isCollapsed: sidebarCollapsed, toggleSidebar, isOpen: sidebarMobileOpen, setIsOpen: setSidebarMobileOpen };
};

export const useThemeStore = () => {
  const { theme, setTheme } = useUIStore();
  return { theme, setTheme };
};
