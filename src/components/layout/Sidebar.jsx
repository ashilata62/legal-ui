import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  FolderOpen,
  UserCheck,
  FileText,
  Mail,
  Clock,
  Calendar,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
  Building,
  ShieldAlert,
  SlidersHorizontal,
  ChevronLeft,
  Eye,
  CheckSquare,
  Landmark,
  Globe,
  Layers,
  Database,
  Sparkles,
  Bell,
  Scale
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { useTime } from '../../context/TimeContext';
import { useTasks } from '../../context/TaskContext';

export function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { currentUser } = useAuth();
  const permissions = usePermissions();
  const { timeEntries } = useTime();
  const { tasks } = useTasks();

  const pendingApprovalsCount = timeEntries.filter(t => t.status === 'Submitted').length;
  const urgentTasksCount = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length;

  // Track expanded menu state in sidebar
  const [expandedMenus, setExpandedMenus] = useState({
    clients: location.pathname.startsWith('/clients') || location.pathname.startsWith('/matters') || location.pathname.startsWith('/intake') || location.pathname.startsWith('/documents') || location.pathname.startsWith('/communications') || location.pathname.startsWith('/client-portal') || location.pathname.startsWith('/immigration') || location.pathname.startsWith('/bankruptcy'),
    tasks: location.pathname.startsWith('/tasks') || location.pathname.startsWith('/calendar') || location.pathname.startsWith('/deadlines') || location.pathname.startsWith('/time') || location.pathname.startsWith('/checklists'),
    billing: location.pathname.startsWith('/billing'),
    settings: location.pathname.startsWith('/reports') || location.pathname.startsWith('/settings'),
  });

  const toggleSubmenu = (menuKey) => {
    if (collapsed) {
      setCollapsed(false);
    }
    setExpandedMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const rawNavItems = [
    {
      id: 'dashboard',
      label: '1. Dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
      subItems: null,
    },
    {
      id: 'clients',
      label: '2. Clients & Matters',
      icon: Briefcase,
      subItems: [
        { label: 'All Clients', to: '/clients', icon: Users },
        { label: 'All Matters', to: '/matters', icon: FolderOpen },
        { label: 'Intake & Conflicts', to: '/intake', icon: UserCheck },
        { label: 'Immigration Docket', to: '/immigration/cases', icon: Globe },
        { label: 'Bankruptcy Docket', to: '/bankruptcy/cases', icon: Landmark },
        { label: 'Documents', to: '/documents', icon: FileText },
        { label: 'Communications', to: '/communications', icon: Mail },
        { label: 'Client Portal Preview', to: '/client-portal', icon: Eye },
      ],
    },
    {
      id: 'tasks',
      label: '3. Tasks & Activities',
      icon: CalendarCheck,
      badge: urgentTasksCount > 0 ? urgentTasksCount : null,
      badgeColor: 'bg-[#B42318]',
      subItems: [
        { label: 'My Tasks', to: '/tasks/mine', icon: CheckSquare },
        { label: 'Team Tasks', to: '/tasks/team', icon: Users },
        { label: 'Firm Calendar', to: '/calendar', icon: Calendar },
        { label: 'Court Deadlines', to: '/deadlines', icon: AlertTriangle },
        { label: 'Time Tracking', to: '/time', icon: Clock },
        { label: 'Daily Time Review', to: '/time/review', icon: FileSpreadsheet },
        { label: 'Suggested Billing', to: '/time/suggested', icon: Sparkles },
        {
          label: 'Time Approvals',
          to: '/time/approvals',
          icon: UserCheck,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
        },
        { label: 'Workflow Checklists', to: '/checklists', icon: Layers },
      ],
    },
    {
      id: 'billing',
      label: '4. Billing & Accounting',
      icon: CreditCard,
      subItems: [
        { label: 'Billing Overview', to: '/billing', icon: CreditCard },
        { label: 'Billable Hours', to: '/billing/hours', icon: Clock },
        { label: 'Expenses', to: '/billing/expenses', icon: Receipt },
        { label: 'Invoices', to: '/billing/invoices', icon: FileText },
        { label: 'Payment Records', to: '/billing/payments', icon: Building },
        { label: 'Billing Reports', to: '/billing/reports', icon: FileSpreadsheet },
        { label: 'Operating Account', to: '/billing/operating', icon: Landmark },
        { label: 'IOLTA Trust Account', to: '/billing/trust', icon: ShieldAlert },
        { label: 'Chart of Accounts', to: '/billing/chart-of-accounts', icon: Landmark },
        { label: 'General Ledger', to: '/billing/general-ledger', icon: FileSpreadsheet },
        { label: '3-Way Reconciliation', to: '/billing/reconciliation', icon: Scale },
      ],
    },
    {
      id: 'settings',
      label: '5. Reports & Settings',
      icon: Settings,
      subItems: [
        { label: 'Attorney & Staff Reports', to: '/reports/staff', icon: FileSpreadsheet },
        { label: 'Matter & Practice Reports', to: '/reports/matters', icon: FolderOpen },
        { label: 'Financial & Billing Reports', to: '/reports/financial', icon: CreditCard },
        { label: 'User Management', to: '/settings/users', icon: Users },
        { label: 'Roles & Permissions', to: '/settings/roles', icon: UserCheck },
        { label: 'Templates & Workflows', to: '/settings/templates', icon: FileText },
        { label: 'Integrations & Cloud', to: '/settings/integrations', icon: Database },
        { label: 'Firm Branding', to: '/settings/branding', icon: SlidersHorizontal },
        { label: 'Notifications', to: '/settings/notifications', icon: Bell },
        { label: 'Audit Logs', to: '/settings/audit-logs', icon: ShieldAlert },
        { label: 'Security & Access', to: '/settings/security', icon: Settings },
      ],
    },
  ];

  // Dynamically filter subItems based on active permission rules
  const navItems = rawNavItems.map(item => {
    if (!item.subItems) return item;
    const filteredSubs = item.subItems.filter(sub => {
      return permissions.canAccessRoute(sub.to);
    });
    return {
      ...item,
      subItems: filteredSubs,
    };
  }).filter(item => {
    if (item.subItems && item.subItems.length === 0) {
      return false;
    }
    if (item.to) {
      return permissions.canAccessRoute(item.to);
    }
    return true;
  });

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-[#06244B] border-r border-[#0B356D] flex flex-col ${
        collapsed ? 'w-20' : 'w-64 lg:w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#0B356D] bg-[#041833] flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded bg-[#A4432B] flex items-center justify-center font-serif font-bold text-white shadow-sm flex-shrink-0 text-base">
              HB
            </div>
            <div className="flex flex-col truncate">
              <span className="font-serif text-sm font-bold tracking-wider text-[#F5F0E5] truncate">
                HEUGLY &amp; BLUDWORTH
              </span>
              <span className="text-[10px] tracking-widest text-[#B8C0C4] uppercase">
                Legal Practice SaaS
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded bg-[#A4432B] flex items-center justify-center font-serif font-bold text-white shadow-sm text-sm">
              HB
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded text-[#B8C0C4] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Menus */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 text-sm font-medium">
        <div className={`px-2 py-1 text-[10px] font-semibold tracking-wider text-[#B8C0C4] uppercase ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '—' : 'Primary Menus (5 Only)'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const hasSubmenu = Boolean(item.subItems);
          const isExpanded = expandedMenus[item.id];
          const isSubActive = item.subItems?.some(sub => location.pathname === sub.to);

          if (!hasSubmenu) {
            return (
              <div key={item.id} className="relative group/direct">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 group cursor-pointer ${
                      isActive
                        ? 'bg-[#A4432B] text-white shadow-sm font-semibold'
                        : 'text-[#B8C0C4] hover:bg-white/10 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                </NavLink>

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-[#06244B] border border-[#0B356D] text-white text-xs font-semibold rounded shadow-elevated whitespace-nowrap z-50 pointer-events-none hidden group-hover/direct:block">
                    {item.label}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={item.id} className="relative group/menu space-y-1">
              <button
                type="button"
                onClick={() => toggleSubmenu(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 text-left group cursor-pointer ${
                  isSubActive
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-[#B8C0C4] hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isSubActive ? 'text-[#A4432B]' : ''}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#B42318] text-white font-bold mr-1">
                        {item.badge}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#B8C0C4] group-hover:text-white" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#B8C0C4] group-hover:text-white" />
                    )}
                  </>
                )}
              </button>

              {/* Expanded Submenu list */}
              {!collapsed && isExpanded && (
                <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-[#0B356D] ml-5">
                  {item.subItems.map((sub, sIdx) => {
                    const SubIcon = sub.icon;
                    return (
                      <NavLink
                        key={sIdx}
                        to={sub.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 text-xs rounded transition-all duration-150 ${
                            isActive
                              ? 'bg-[#A4432B] text-white font-semibold shadow-xs'
                              : 'text-[#B8C0C4] hover:text-white hover:bg-white/5'
                          }`
                        }
                      >
                        <SubIcon className="w-3.5 h-3.5 flex-shrink-0 opacity-80" />
                        <span className="flex-1 truncate">{sub.label}</span>
                        {sub.badge && (
                          <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#A4432B] text-white font-bold">
                            {sub.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}

              {/* Collapsed Hover/Click Flyout Menu (for Tablets and compact desktop) */}
              {collapsed && (
                <div className="absolute left-full top-0 ml-2 w-60 bg-[#06244B] border border-[#0B356D] rounded-lg shadow-2xl py-2 z-50 hidden group-hover/menu:block pointer-events-auto">
                  <div className="px-3 py-1.5 border-b border-[#0B356D] bg-[#041833]">
                    <div className="text-xs font-serif font-bold text-[#F5F0E5] flex items-center justify-between">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#B42318] text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {item.subItems.map((sub, sIdx) => {
                      const SubIcon = sub.icon;
                      const isSubCurrent = location.pathname === sub.to;
                      return (
                        <NavLink
                          key={sIdx}
                          to={sub.to}
                          className={`flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                            isSubCurrent
                              ? 'bg-[#A4432B] text-white font-semibold'
                              : 'text-[#B8C0C4] hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <SubIcon className="w-3.5 h-3.5 flex-shrink-0 opacity-80" />
                          <span className="flex-1 truncate">{sub.label}</span>
                          {sub.badge && (
                            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#A4432B] text-white font-bold">
                              {sub.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-[#0B356D] bg-[#041833] flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F5F0E5] text-[#06244B] flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
              {currentUser.initials}
            </div>
            <div className="flex flex-col truncate flex-1">
              <span className="text-xs font-semibold text-[#F5F0E5] truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#A4432B] font-medium tracking-wide">
                {currentUser.title}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#F5F0E5] text-[#06244B] flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.initials}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
