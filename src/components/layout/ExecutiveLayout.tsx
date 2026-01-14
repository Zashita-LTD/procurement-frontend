import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  Building2,
  Settings,
  Bell,
  Calendar,
  FileText
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';

/**
 * Layout для директоров (B2B Executive)
 * Корпоративная тема, дашборды и KPI
 */
export function ExecutiveLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const sidebarItems = [
    { to: '/company/executive/analytics', icon: BarChart3, label: 'Аналитика' },
    { to: '/company/executive/finances', icon: DollarSign, label: 'Финансы' },
    { to: '/company/executive/projects', icon: Building2, label: 'Проекты' },
    { to: '/company/executive/team', icon: Users, label: 'Команда' },
    { to: '/company/executive/reports', icon: FileText, label: 'Отчёты' },
  ];

  const kpiCards = [
    { label: 'Выручка', value: '₽12.5M', change: '+15%', positive: true },
    { label: 'Проекты', value: '24', change: '+3', positive: true },
    { label: 'Экономия', value: '₽890K', change: '+8%', positive: true },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 theme-corporate flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-slate-900 text-white">
        {/* Company */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">{user?.company?.name}</h1>
              <p className="text-xs text-slate-400">Executive</p>
            </div>
          </div>
        </div>

        {/* Mini KPIs */}
        <div className="p-3 border-b border-slate-800">
          <div className="grid grid-cols-1 gap-2">
            {kpiCards.map((kpi, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-lg p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{kpi.label}</span>
                  <span className={`text-xs ${kpi.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-lg font-bold mt-0.5">{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-0.5">
            {sidebarItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => navigate('/company/executive/settings')}
            className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
              {user?.full_name?.[0] || 'Д'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-500">Директор</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="font-bold">Executive</span>
            </div>

            {/* Page Title (desktop) */}
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold">Панель управления</h2>
              <p className="text-sm text-slate-500">Обзор бизнеса за январь 2026</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Период</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 relative">
                <Bell className="h-5 w-5 text-slate-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button 
                onClick={() => navigate('/company/executive/settings')}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <Settings className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-pb">
          <div className="flex justify-around py-1.5">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded transition-all ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-400'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Dev: Role Switcher */}
      <RoleSwitcher />
    </div>
  );
}
