import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  Database,
  FileText,
  MapPin,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
  Megaphone,
  Calendar,
  CheckSquare,
  UploadCloud,
  BarChart3,
  Users,
  Settings,
  History,
  Bell,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface StudioLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({ children, activeSection }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { user, hasRole, logout } = useAuthStore();

  const NAV_SECTIONS = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/studio', icon: LayoutDashboard },
      ],
    },
    {
      title: 'REPOSITORY',
      items: [
        { label: 'Datasets', href: '/studio/datasets', icon: Database },
        { label: 'Publications', href: '/studio/publications', icon: FileText },
        { label: 'Expeditions', href: '/studio/expeditions', icon: MapPin },
        { label: 'Media Archive', href: '/studio/media', icon: ImageIcon },
        { label: 'Upload Wizard', href: '/studio/upload', icon: UploadCloud },
      ],
    },
    {
      title: 'OUTREACH',
      items: [
        { label: 'Content Studio', href: '/studio/content', icon: Sparkles },
        { label: 'Editorial Stories', href: '/studio/stories', icon: BookOpen },
        { label: 'Campaigns', href: '/studio/campaigns', icon: Megaphone },
        { label: 'Calendar', href: '/studio/calendar', icon: Calendar },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Review Queue', href: '/studio/review', icon: CheckSquare, badge: 'Needs Review' },
        { label: 'Analytics', href: '/studio/analytics', icon: BarChart3 },
        { label: 'Users & RBAC', href: '/studio/users', icon: Users },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', href: '/studio/settings', icon: Settings },
        { label: 'Audit Logs', href: '/studio/audit', icon: History },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0D1211] flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-[#0D1211]/10 bg-[#F4F2EC] px-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-full bg-[#0D1211] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#B7FF5A]" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-wide">ORUVIA</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] bg-[#0D1211]/5 px-2 py-0.5 rounded border border-[#0D1211]/10 ml-1">
              STUDIO
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-[#747A75] hover:text-[#0D1211] transition-colors"
          >
            <span>Public Platform</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {/* User Badge */}
          <div className="flex items-center gap-2 pl-3 border-l border-[#0D1211]/10">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#B7FF5A] text-[#0D1211] font-semibold">
              {user?.role || 'CONTRIBUTOR'}
            </span>
            <span className="font-medium hidden md:inline">{user?.name || 'Dr. Evelyn Vance'}</span>
            <button
              onClick={() => logout()}
              className="text-[#747A75] hover:text-[#0D1211] ml-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body: Sidebar + Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`border-r border-[#0D1211]/10 bg-[#F4F2EC]/60 backdrop-blur-sm transition-all duration-200 flex flex-col justify-between ${
            collapsed ? 'w-16' : 'w-60'
          }`}
        >
          <div className="py-4 space-y-6 overflow-y-auto">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="px-3">
                {!collapsed && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] px-3 block mb-2 font-semibold">
                    {section.title}
                  </span>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href || (item.href !== '/studio' && location.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#0D1211] text-[#F4F2EC]'
                            : 'text-[#747A75] hover:text-[#0D1211] hover:bg-[#FAF9F5]'
                        } ${collapsed ? 'justify-center' : ''}`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#B7FF5A]' : ''}`} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Collapse Button */}
          <div className="p-3 border-t border-[#0D1211]/10 flex justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded hover:bg-[#EBE8DF] text-[#747A75] hover:text-[#0D1211]"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};
