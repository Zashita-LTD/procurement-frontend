import { Link } from 'react-router-dom';
import { Sparkles, FileSearch, Heart, ArrowRight, Package } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

/**
 * PrivateDashboard - главная страница для частников
 */
export function PrivateDashboard() {
  const { user } = useAuth();

  const quickActions = [
    {
      to: '/private/wizard',
      icon: Sparkles,
      title: 'Что строим?',
      description: 'Создать проект ремонта',
      color: 'bg-blue-500',
    },
    {
      to: '/private/audit',
      icon: FileSearch,
      title: 'Проверить рабочих',
      description: 'Анализ сметы от бригады',
      color: 'bg-orange-500',
      highlight: true,
    },
    {
      to: '/private/inspiration',
      icon: Heart,
      title: 'Готовые наборы',
      description: 'Проверенные комплекты',
      color: 'bg-pink-500',
    },
  ];

  const stats = [
    { label: 'Сэкономлено', value: '₽45,200', sublabel: 'за этот месяц' },
    { label: 'Заказов', value: '3', sublabel: 'в процессе' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          Привет, {user?.full_name?.split(' ')[0] || 'Друг'}! 👋
        </h1>
        <p className="text-blue-100 mt-1">
          Готовы к ремонту мечты?
        </p>
        
        <div className="flex gap-4 mt-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/20 rounded-xl p-3 flex-1">
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Быстрые действия</h2>
        
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`
              flex items-center gap-4 p-4 rounded-2xl transition-all
              ${action.highlight 
                ? 'bg-orange-50 border-2 border-orange-200 hover:border-orange-300' 
                : 'bg-white border border-gray-200 hover:border-blue-300'
              }
            `}
          >
            <div className={`p-3 rounded-xl ${action.color} text-white`}>
              <action.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Мои заказы</h2>
          <Link to="/private/orders" className="text-sm text-blue-600">
            Все заказы →
          </Link>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Заказ #1234</h4>
              <p className="text-sm text-gray-500">Электрика для однушки</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">28,500 ₽</p>
              <p className="text-xs text-green-600">В пути</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
          💡 Совет дня
        </h3>
        <p className="text-sm text-yellow-700 mt-1">
          Загрузите смету от рабочих — мы проверим, не завышают ли они цены.
          Уже сэкономили клиентам более 10 млн рублей!
        </p>
      </div>
    </div>
  );
}
