/**
 * BuyerRequestsPage - Страница заявок для закупщика
 */
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Search,
  Plus,
  ChevronRight
} from 'lucide-react';

interface RequestItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number | null;
  total_price: number | null;
}

interface Request {
  id: number;
  quote_number: string;
  supplier_id: number | null;
  supplier_name: string | null;
  status: string;
  total_amount: number | null;
  valid_until: string | null;
  created_at: string;
  items: RequestItem[];
}

interface RequestStats {
  total_requests: number;
  pending: number;
  accepted: number;
  rejected: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'На рассмотрении', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  accepted: { label: 'Принята', color: 'text-green-600 bg-green-100', icon: CheckCircle2 },
  rejected: { label: 'Отклонена', color: 'text-red-600 bg-red-100', icon: XCircle },
  expired: { label: 'Истекла', color: 'text-gray-600 bg-gray-100', icon: XCircle },
};

const API_URL = import.meta.env.VITE_API_URL || 'http://34.46.91.149:8000';

export function BuyerRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [stats, setStats] = useState<RequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const [requestsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/requests?${params}`),
        fetch(`${API_URL}/api/v1/requests/stats`)
      ]);
      
      const requestsData = await requestsRes.json();
      const statsData = await statsRes.json();
      
      setRequests(requestsData.requests || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredRequests = requests.filter(req => 
    !searchQuery || req.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (req.supplier_name && req.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total_requests}</p>
            <p className="text-sm text-slate-500">Всего заявок</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.pending}</p>
            <p className="text-sm text-slate-500">На рассмотрении</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.accepted}</p>
            <p className="text-sm text-slate-500">Принято</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.rejected}</p>
            <p className="text-sm text-slate-500">Отклонено</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по номеру или поставщику..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все статусы</option>
          <option value="pending">На рассмотрении</option>
          <option value="accepted">Принятые</option>
          <option value="rejected">Отклонённые</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Новая заявка
        </button>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Заявки на котировки</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-500">Загрузка...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Заявки не найдены
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredRequests.map((request) => {
              const status = statusConfig[request.status] || statusConfig.pending;
              const isExpanded = expandedId === request.id;
              
              return (
                <div key={request.id} className="hover:bg-slate-50">
                  <div 
                    className="px-4 py-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : request.id)}
                  >
                    <div className="flex items-center gap-4">
                      <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      <div>
                        <span className="font-medium text-blue-600">{request.quote_number}</span>
                        <p className="text-sm text-slate-500">{request.supplier_name || 'Поставщик не указан'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium text-slate-900">
                          {request.total_amount ? formatPrice(request.total_amount) : '—'}
                        </p>
                        <p className="text-sm text-slate-500">{request.items.length} позиций</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <status.icon className="h-3 w-3" />
                        {status.label}
                      </span>
                      <span className="text-sm text-slate-500">{formatDate(request.created_at)}</span>
                    </div>
                  </div>
                  
                  {isExpanded && request.items.length > 0 && (
                    <div className="px-4 pb-4 pl-14">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                          <tr className="text-left text-slate-500">
                            <th className="px-3 py-2">Товар</th>
                            <th className="px-3 py-2">Кол-во</th>
                            <th className="px-3 py-2">Цена</th>
                            <th className="px-3 py-2">Сумма</th>
                          </tr>
                        </thead>
                        <tbody>
                          {request.items.map((item) => (
                            <tr key={item.id} className="border-t border-slate-100">
                              <td className="px-3 py-2">{item.product_name}</td>
                              <td className="px-3 py-2">{item.quantity}</td>
                              <td className="px-3 py-2">{item.unit_price ? formatPrice(item.unit_price) : '—'}</td>
                              <td className="px-3 py-2">{item.total_price ? formatPrice(item.total_price) : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
