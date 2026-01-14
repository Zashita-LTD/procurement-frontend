import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Settings, 
  LogOut,
  Package,
  Camera
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Дашборд', href: '/', icon: LayoutDashboard },
  { name: 'Заказ по фото', href: '/snap-order', icon: Camera, highlight: true },
  { name: 'Проекты', href: '/projects', icon: FolderOpen },
  { name: 'Каталог', href: '/catalog', icon: Package },
  { name: 'Настройки', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-slate-700">
        <Package className="h-8 w-8 text-blue-400" />
        <span className="ml-3 text-xl font-bold">Procurement</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const isHighlight = 'highlight' in item && item.highlight
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-800 text-white'
                  : isHighlight
                    ? 'text-green-400 hover:bg-green-900/30 hover:text-green-300'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isHighlight && !isActive && "text-green-400")} />
              {item.name}
              {isHighlight && (
                <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                  NEW
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Выйти
        </Button>
      </div>
    </div>
  )
}