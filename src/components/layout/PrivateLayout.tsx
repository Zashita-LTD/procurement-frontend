import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Sparkles, FileText, Heart, Search, User } from 'lucide-react';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';

/**
 * Layout для частников (B2C)
 * Светлая тема, крупные элементы, дружелюбный интерфейс
 */
export function PrivateLayout() {
  const navigate = useNavigate();

  const navItems = [
    { to: '/private/dashboard', icon: Home, label: 'Главная' },
    { to: '/private/wizard', icon: Sparkles, label: 'Что строим?' },
    { to: '/private/audit', icon: FileText, label: 'Проверить смету' },
    { to: '/private/inspiration', icon: Heart, label: 'Идеи' },
    { to: '/private/cart', icon: ShoppingCart, label: 'Корзина' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white theme-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg">Мой Ремонт</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/private/search')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigate('/private/profile')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Dev: Role Switcher */}
      <RoleSwitcher />
    </div>
  );
}
