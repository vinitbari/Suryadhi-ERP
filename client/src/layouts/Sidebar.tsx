import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store';
import { BRAND } from '@/lib/brand';
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Headphones,
  Video,
  Users,
  RefreshCw,
  Package,
  FileText,
  Wallet,
  Building2,
  ClipboardList,
  Wrench,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
  children?: { label: string; href: string }[];
}

const navigation: SidebarItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  {
    label: 'Enrollment Dashboard',
    icon: BarChart3,
    children: [
      { label: 'Overall Enrollment Summary', href: '/enrollment/summary' },
      { label: 'Source Wise Enquiries', href: '/enrollment/source-wise' },
      { label: 'Retention Base vs Conversion', href: '/enrollment/retention-base' },
      { label: 'Retention Growth', href: '/enrollment/retention-growth' },
      { label: 'New Business Growth', href: '/enrollment/new-business' },
    ],
  },
  {
    label: 'Communications',
    icon: MessageSquare,
    children: [
      { label: 'Business Team Visits', href: '/communications/business-visits' },
      { label: 'Academics Team Visits', href: '/communications/academics-visits' },
      { label: 'App Report', href: '/communications/app-report' },
    ],
  },
  { label: 'Support', icon: Headphones, href: '/support' },
  { label: 'Video Library', icon: Video, href: '/video-library', badge: 'New' },
  {
    label: 'Enrollments',
    icon: Users,
    children: [
      { label: 'Enquiry', href: '/enquiry' },
      { label: 'Admission', href: '/admission' },
      { label: 'Manage Student Transfer In', href: '/transfers/in' },
      { label: 'Transfer Out Students', href: '/transfer-out' },
      { label: 'School Transfer Requests', href: '/transfers/requests' },
      { label: 'Manage Transfer Stage', href: '/transfers/manage-stage' },
      { label: 'Graduation via SEMS App', href: '/graduation/homebuddy' },
      { label: 'Manage Quit Admission', href: '/quit-admission-manage' },
      { label: 'Name change confirmation', href: '/name-change-confirm' },
      { label: 'Inventory Details', href: '/inventory-details' },
    ],
  },
  { label: 'Program Change', icon: RefreshCw, href: '/program-change' },
  {
    label: 'Operations',
    icon: Package,
    children: [
      { label: 'Exchange Order', href: '/operations/exchange' },
      { label: 'Purchase Order', href: '/operations/purchase' },
    ],
  },
  {
    label: 'Statement Of Account',
    icon: FileText,
    children: [
      { label: 'SOA Summary', href: '/soa/summary' },
      { label: 'SOA Details', href: '/soa/details' },
    ],
  },
  {
    label: 'Fee Collection',
    icon: Wallet,
    children: [
      { label: 'Deposit Slip - Automated', href: '/fees/deposit' },
      { label: 'Convert Cash to Cheque', href: '/fees/cash-to-cheque' },
      { label: 'Convert Cash to Online', href: '/fees/cash-to-online' },
      { label: 'Print & View Deposit Slip', href: '/fees/deposit-history' },
      { label: 'Funds Transfer Summary', href: '/fees/funds-transfer' },
      { label: 'Fee Collection via HomeSunny App', href: '/fees/homebuddy' },
      { label: 'Online Payment Detail', href: '/fees/online-payments' },
    ],
  },
  {
    label: 'Franchisee',
    icon: Building2,
    children: [
      { label: 'Invoice Details', href: '/franchisee/invoices' },
      { label: 'Invoice Download', href: '/franchisee/invoice-download' },
      { label: 'Receipt Download', href: '/franchisee/receipt-download' },
      { label: 'Coach List', href: '/franchisee/coach-list' },
    ],
  },
  {
    label: 'Reports',
    icon: ClipboardList,
    children: [
      { label: 'Admission Details', href: '/reports/admissions' },
      { label: 'Fee Card Details', href: '/reports/fee-card' },
      { label: 'Enquiry Details', href: '/reports/enquiries' },
      { label: 'LeadSuryadhi Enquiry Details', href: '/reports/lsq-enquiries' },
      { label: 'Payment Due Report', href: '/reports/payment-due' },
      { label: 'Cancelled Receipt Details', href: '/reports/cancelled-receipts' },
      { label: 'Transferred Student Report', href: '/reports/transfers' },
      { label: 'FCR', href: '/reports/fcr' },
      { label: 'Admission Count', href: '/reports/admission-count' },
      { label: 'Online Payment Report', href: '/reports/online-payments' },
      { label: 'Student Forecasted Royalty Report', href: '/reports/royalty-forecast' },
    ],
  },
  {
    label: 'Tools',
    icon: Wrench,
    children: [
      { label: 'Fee Calculator', href: '/tools/fee-calculator' },
    ],
  },
  {
    label: 'Shortage/Damage',
    icon: AlertTriangle,
    children: [
      { label: 'Report Shortage/Damage', href: '/shortage/report' },
      { label: 'Download Report', href: '/shortage/download' },
    ],
  },
  {
    label: 'Settings',
    icon: Settings,
    children: [
      { label: 'System Settings', href: '/settings/system' },
      { label: 'Manage Academic Years', href: '/settings/academic-years' },
    ],
  },
];

function SidebarGroup({ item }: { item: SidebarItem }) {
  const location = useLocation();
  const { sidebarCollapsed } = useUIStore();
  const isChildActive = item.children?.some(c => location.pathname.startsWith(c.href));
  const [isOpen, setIsOpen] = useState(isChildActive || false);

  // Direct link item
  if (item.href) {
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150',
            'text-[#abb2bf] hover:text-white hover:bg-[#252932]',
            isActive && 'bg-[#252932] text-[#e5c07b] font-semibold border-l-2 border-[#e5c07b]',
            sidebarCollapsed && 'justify-center px-2'
          )
        }
      >
        <item.icon className="h-[18px] w-[18px] shrink-0" />
        {!sidebarCollapsed && (
          <>
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-[#ea580c] text-white rounded">
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  }

  // Collapsible group
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium w-full transition-all duration-150 text-left',
          'text-[#abb2bf] hover:text-white hover:bg-[#252932]',
          isChildActive && 'text-[#e5c07b] font-semibold',
          sidebarCollapsed && 'justify-center px-2'
        )}
      >
        <item.icon className="h-[18px] w-[18px] shrink-0" />
        {!sidebarCollapsed && (
          <>
            <span className="truncate flex-1">{item.label}</span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-slate-400',
                isOpen && 'rotate-180 text-white'
              )}
            />
          </>
        )}
      </button>

      {isOpen && !sidebarCollapsed && (
        <div className="ml-4 pl-2 border-l border-[#2e3340] space-y-0.5 mt-1 pb-1">
          {item.children?.map((child) => (
            <NavLink
              key={child.href}
              to={child.href}
              className={({ isActive }) =>
                cn(
                  'block px-2.5 py-1.5 rounded text-[12px] transition-all duration-150',
                  'text-[#8a92a0] hover:text-white hover:bg-[#252932]/70',
                  isActive && 'text-[#e5c07b] bg-[#282d38] font-medium'
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const location = useLocation();

  useEffect(() => {
    setSidebarMobileOpen(false);
  }, [location.pathname, setSidebarMobileOpen]);

  const sidebarContent = (
    <>
      {/* Sidebar Top Controls / Quick Collapse */}
      <div className={cn(
        'h-10 flex items-center border-b border-[#282c35] bg-[#16181f]/70 px-3 shrink-0 text-slate-400 transition-all',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!sidebarCollapsed && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-[#252932] text-slate-400 hover:text-white transition-colors"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-0.5 custom-scrollbar">
        {navigation.map((item) => (
          <SidebarGroup key={item.label} item={item} />
        ))}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="border-t border-[#282c35] bg-[#16181f]/70 px-4 py-2.5 shrink-0">
          <p className="text-[10px] text-slate-400 font-medium">
            {BRAND.poweredBy}
          </p>
          <p className="text-[9px] text-slate-500 mt-0.5">
            {BRAND.copyright}
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'shrink-0 h-full bg-[#1a1d24] text-[#abb2bf] flex-col hidden lg:flex',
          'transition-all duration-200 ease-in-out border-r border-[#282c35] select-none',
          sidebarCollapsed ? 'w-16' : 'w-[250px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 lg:hidden backdrop-blur-xs"
            onClick={() => setSidebarMobileOpen(false)}
          />
          <aside
            className="fixed top-0 left-0 z-50 h-screen w-[260px] bg-[#1a1d24] text-[#abb2bf] flex flex-col lg:hidden border-r border-[#282c35] shadow-2xl"
          >
            <button
              onClick={() => setSidebarMobileOpen(false)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 z-10"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
