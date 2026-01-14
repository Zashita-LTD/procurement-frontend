/**
 * OrderHistoryPage - Страница истории заказов
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Package, 
  CheckCircle, 
  XCircle,
  Truck,
  Search,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Типы статусов заказов
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  name: string;
  quantity: number;
  unit: string;
  price?: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  supplier?: string;
  total?: number;
  deliveryDate?: string;
}

// Демо данные для истории заказов
const DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-2025-001',
    date: '2025-01-14T10:30:00',
    status: 'delivered',
    supplier: 'СтройМатериалы КЗ',
    items: [
      { name: 'Цемент М500', quantity: 50, unit: 'мешков', price: 2500 },
      { name: 'Песок строительный', quantity: 10, unit: 'м³', price: 8000 },
    ],
    total: 205000,
    deliveryDate: '2025-01-13',
  },
  {
    id: 'ORD-2025-002',
    date: '2025-01-13T14:20:00',
    status: 'shipped',
    supplier: 'Металл Групп',
    items: [
      { name: 'Арматура 12мм', quantity: 200, unit: 'м', price: 850 },
      { name: 'Сетка сварная', quantity: 20, unit: 'рулонов', price: 4500 },
    ],
    total: 260000,
    deliveryDate: '2025-01-15',
  },
  {
    id: 'ORD-2025-003',
    date: '2025-01-12T09:15:00',
    status: 'confirmed',
    supplier: 'ЭлектроОпт',
    items: [
      { name: 'Кабель ВВГнг 3x2.5', quantity: 500, unit: 'м', price: 120 },
      { name: 'Автоматы 16А', quantity: 20, unit: 'шт', price: 1200 },
    ],
    total: 84000,
  },
  {
    id: 'ORD-2025-004',
    date: '2025-01-10T16:45:00',
    status: 'pending',
    items: [
      { name: 'Краска фасадная', quantity: 30, unit: 'л' },
      { name: 'Грунтовка', quantity: 20, unit: 'л' },
    ],
  },
  {
    id: 'ORD-2025-005',
    date: '2025-01-08T11:00:00',
    status: 'cancelled',
    supplier: 'СантехПро',
    items: [
      { name: 'Трубы ПВХ 110мм', quantity: 50, unit: 'м' },
    ],
    total: 35000,
  },
];

// Конфигурация статусов
const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending: { label: 'Ожидает', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  confirmed: { label: 'Подтверждён', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  shipped: { label: 'В пути', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
  delivered: { label: 'Доставлен', icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
  cancelled: { label: 'Отменён', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
};

const HISTORY_KEY = 'snap_order_history';

// Загрузка истории из localStorage
function loadHistory(): Order[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      const history = JSON.parse(saved);
      if (Array.isArray(history)) return history;
    }
  } catch {}
  return DEMO_ORDERS;
}

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const history = loadHistory();
    setOrders(history);
  }, []);

  // Фильтрация заказов
  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.supplier?.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Форматирование даты
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric' 
    });
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">История заказов</h1>
            <p className="text-sm text-gray-500">
              {filteredOrders.length} заказов
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по заказам..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="px-4 pb-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                filter === 'all'
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              Все
            </button>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <button
                key={status}
                onClick={() => setFilter(status as OrderStatus)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                  filter === status
                    ? `${config.bg} ${config.color}`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <config.icon className="w-4 h-4" />
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Заказы не найдены</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const statusConfig = STATUS_CONFIG[order.status];
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm p-4 active:bg-gray-50 transition-colors"
                onClick={() => {/* navigate to order details */}}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                    statusConfig.bg,
                    statusConfig.color
                  )}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.label}
                  </div>
                </div>

                {/* Supplier */}
                {order.supplier && (
                  <p className="text-sm text-gray-600 mb-2">
                    Поставщик: <span className="font-medium">{order.supplier}</span>
                  </p>
                )}

                {/* Items preview */}
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-500">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-400 mt-1">
                      +{order.items.length - 2} позиций
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    {order.total && (
                      <p className="font-semibold text-lg text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                    )}
                    {order.deliveryDate && order.status !== 'cancelled' && (
                      <p className="text-xs text-gray-500">
                        {order.status === 'delivered' ? 'Доставлен' : 'Доставка'}: {formatDate(order.deliveryDate)}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
