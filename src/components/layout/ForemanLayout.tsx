import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutList, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  Bell,
  ChevronDown,
  Building2
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';

/**
 * Layout для прорабов (B2B)
 * Тёмная тема, функциональный интерфейс для управления объектами
 */
export function ForemanLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const sidebarItems = [
    { to: '/company/foreman/feed', icon: LayoutList, label: 'Лента' },
    { to: '/company/foreman/objects', icon: Building2, label: 'Объекты' },
    { to: '/company/foreman/team', icon: Users, label: 'Бригада' },
    { to: '/company/foreman/materials', icon: Package, label: 'Материалы' },
    { to: '/company/foreman/reports', icon: BarChart3, label: 'Отчёты' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white theme-dark flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-950 border-r border-gray-800">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">СтройПро</h1>
              <p className="text-xs text-gray-400">Панель прораба</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => navigate('/company/foreman/settings')}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              {user?.full_name?.[0] || 'П'}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{user?.full_name}</p>
              <p className="text-xs text-gray-400">Прораб</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Прораб</span>
            </div>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-md">
              <input
                type="text"
                placeholder="Поиск объектов, материалов..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-800 relative">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button 
                onClick={() => navigate('/company/foreman/settings')}
                className="p-2 rounded-lg hover:bg-gray-800"
              >
                <Settings className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 safe-area-pb">
          <div className="flex justify-around py-2">
            {sidebarItems.slice(0, 5).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'text-emerald-500'
                      : 'text-gray-400'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
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
