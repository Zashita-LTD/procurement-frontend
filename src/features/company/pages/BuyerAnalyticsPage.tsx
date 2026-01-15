/**
 * BuyerAnalyticsPage - Страница аналитики для закупщика
 */
import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users,
  BarChart3,
  ShoppingCart,
  Calendar
} from 'lucide-react';

interface DashboardStats {
  total_orders: number;
  total_amount: number;
  total_suppliers: number;
  total_products: number;
  pending_orders: number;
  completed_orders: number;
  avg_order_value: number;
  orders_this_month: number;
  orders_growth_percent: number;
}

interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface MonthlyData {
  month: string;
  orders: number;
  amount: number;
}

interface TopSupplier {
  id: number;
  name: string;
  orders: number;
  amount: number;
  rating: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  supplier_name: string;
  amount: number;
  status: string;
  date: string;
}

interface DashboardData {
  stats: DashboardStats;
  spending_by_category: CategorySpending[];
  monthly_data: MonthlyData[];
  top_suppliers: TopSupplier[];
  recent_orders: RecentOrder[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://34.46.91.149:8000';

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  approved: 'Одобрен',
  in_progress: 'В работе',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  completed: 'Завершён',
  cancelled: 'Отменён',
  draft: 'Черновик',
};

export function BuyerAnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/dashboard`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + ' млн ₸';
    }
    if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + ' тыс ₸';
    }
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-slate-500">
        Не удалось загрузить данные
      </div>
    );
  }

  const { stats, spending_by_category, monthly_data, top_suppliers, recent_orders } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            <span className={`text-xs font-medium ${stats.orders_growth_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.orders_growth_percent >= 0 ? '+' : ''}{stats.orders_growth_percent.toFixed(1)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total_orders}</p>
          <p className="text-sm text-slate-500">Всего заказов</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{formatPrice(stats.total_amount)}</p>
          <p className="text-sm text-slate-500">Общая сумма</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total_suppliers}</p>
          <p className="text-sm text-slate-500">Поставщиков</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <Package className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total_products}</p>
          <p className="text-sm text-slate-500">Товаров в каталоге</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Расходы по категориям</h3>
          <div className="space-y-3">
            {spending_by_category.slice(0, 6).map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{cat.category}</span>
                  <span className="text-slate-500">{formatPrice(cat.amount)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ width: `${Math.min(cat.percentage, 100)}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Заказы по месяцам</h3>
          <div className="flex items-end gap-2 h-48">
            {monthly_data.map((month, idx) => {
              const maxAmount = Math.max(...monthly_data.map(m => m.amount));
              const height = maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600" 
                    style={{ height: `${height}%` }}
                    title={`${formatPrice(month.amount)}`}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">{month.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Топ поставщиков</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {top_suppliers.map((supplier, idx) => (
              <div key={supplier.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{supplier.name}</p>
                    <p className="text-sm text-slate-500">{supplier.orders} заказов</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{formatPrice(supplier.amount)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-slate-500">{supplier.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Последние заказы</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {recent_orders.slice(0, 5).map((order) => (
              <div key={order.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-600">{order.order_number}</p>
                  <p className="text-sm text-slate-500">{order.supplier_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{formatPrice(order.amount)}</p>
                  <p className="text-xs text-slate-400">{formatDate(order.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
