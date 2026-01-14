import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  FileText, 
  TrendingUp, 
  Package, 
  Settings,
  Bell,
  Search,
  Building2
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';

/**
 * Layout для закупщиков (B2B)
 * Корпоративная тема, высокая плотность данных
 */
export function BuyerLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const sidebarItems = [
    { to: '/company/buyer/orders', icon: ShoppingCart, label: 'Заказы', badge: '12' },
    { to: '/company/buyer/requests', icon: FileText, label: 'Заявки', badge: '5' },
    { to: '/company/buyer/analytics', icon: TrendingUp, label: 'Аналитика' },
    { to: '/company/buyer/suppliers', icon: Building2, label: 'Поставщики' },
    { to: '/company/buyer/catalog', icon: Package, label: 'Каталог' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 theme-corporate flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200">
        {/* Company */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">{user?.company?.name || 'Компания'}</h1>
              <p className="text-xs text-slate-500">Закупки</p>
            </div>
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
                    `flex items-center justify-between px-3 py-2 rounded text-sm transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={() => navigate('/company/buyer/settings')}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
              {user?.full_name?.[0] || 'З'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-500">Закупщик</p>
            </div>
            <Settings className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
          <div className="px-4 py-2.5 flex items-center gap-4">
            {/* Mobile Logo */}
            <div className="lg:hidden">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Поиск заказов, товаров, поставщиков..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded hover:bg-slate-100 relative">
                <Bell className="h-5 w-5 text-slate-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-slate-50">
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
                  `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded transition-all relative ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-400'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-0.5 right-1 w-4 h-4 text-[10px] bg-blue-600 text-white rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
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
