import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Package
} from 'lucide-react';

interface Order {
  id: string;
  number: string;
  supplier: string;
  items: number;
  total: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered';
  date: string;
}

const orders: Order[] = [
  { id: '1', number: 'ORD-2024-001', supplier: 'Петрович', items: 45, total: 156000, status: 'shipped', date: '14.01.2026' },
  { id: '2', number: 'ORD-2024-002', supplier: 'ТехноНИКОЛЬ', items: 12, total: 89000, status: 'pending', date: '13.01.2026' },
  { id: '3', number: 'ORD-2024-003', supplier: 'КнауфГипс', items: 8, total: 45000, status: 'approved', date: '12.01.2026' },
  { id: '4', number: 'ORD-2024-004', supplier: 'Леруа Мерлен', items: 23, total: 67000, status: 'delivered', date: '11.01.2026' },
];

const statusConfig = {
  pending: { label: 'На согласовании', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  approved: { label: 'Одобрен', color: 'text-blue-600 bg-blue-100', icon: CheckCircle2 },
  shipped: { label: 'В доставке', color: 'text-purple-600 bg-purple-100', icon: Package },
  delivered: { label: 'Доставлен', color: 'text-green-600 bg-green-100', icon: CheckCircle2 },
};

/**
 * BuyerOrdersPage - список заказов для закупщика
 */
export function BuyerOrdersPage() {
  const stats = [
    { label: 'Активных заказов', value: '12', change: '+3', icon: ShoppingCart },
    { label: 'На согласовании', value: '5', change: '', icon: Clock },
    { label: 'В доставке', value: '4', change: '', icon: Package },
    { label: 'Сумма заказов', value: '₽1.2M', change: '+15%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-blue-600" />
              {stat.change && (
                <span className="text-xs text-green-600 font-medium">{stat.change}</span>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Заказы</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm text-slate-500">
                <th className="px-4 py-3 font-medium">№ Заказа</th>
                <th className="px-4 py-3 font-medium">Поставщик</th>
                <th className="px-4 py-3 font-medium">Позиций</th>
                <th className="px-4 py-3 font-medium">Сумма</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-blue-600">{order.number}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-900">{order.supplier}</td>
                    <td className="px-4 py-3 text-slate-600">{order.items}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {order.total.toLocaleString()} ₽
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <status.icon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
