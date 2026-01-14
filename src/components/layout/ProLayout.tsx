import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, Receipt, CreditCard, User, Plus, Package } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';

/**
 * Layout для ремонтников (SMB/Pro)
 * Тёмная тема (опционально), контрастные кнопки, компактные списки
 */
export function ProLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/pro/projects', icon: Briefcase, label: 'Объекты' },
    { to: '/pro/bills', icon: Receipt, label: 'Счета' },
    { to: '/pro/loyalty', icon: CreditCard, label: 'Карты' },
    { to: '/pro/catalog', icon: Package, label: 'Каталог' },
    { to: '/pro/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white theme-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Мои Объекты</h1>
              <p className="text-xs text-gray-400">{user?.full_name}</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/pro/projects/new')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Новый</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 safe-area-pb">
        <div className="max-w-2xl mx-auto flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-orange-500 bg-orange-500/10'
                    : 'text-gray-400 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Dev: Role Switcher */}
      <RoleSwitcher />
    </div>
  );
}
