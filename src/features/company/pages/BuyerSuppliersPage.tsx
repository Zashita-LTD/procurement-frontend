/**
 * BuyerSuppliersPage - Страница поставщиков для закупщика
 */
import { useState, useEffect } from 'react';
import { 
  Users, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Search,
  Filter,
  ChevronRight,
  Building2,
  ShoppingCart
} from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  rating: number | null;
  total_orders: number;
  total_amount: number;
  created_at: string;
}

interface SupplierStats {
  total_suppliers: number;
  avg_rating: number;
  total_contracts: number;
  active_suppliers: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://34.46.91.149:8000';

export function BuyerSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [cityFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cityFilter) params.append('city', cityFilter);
      params.append('per_page', '50');
      
      const [suppliersRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/suppliers?${params}`),
        fetch(`${API_URL}/api/v1/suppliers/stats`)
      ]);
      
      const suppliersData = await suppliersRes.json();
      const statsData = await statsRes.json();
      
      setSuppliers(suppliersData.suppliers || []);
      setStats(statsData);
      
      // Extract unique cities
      const uniqueCities = [...new Set(
        suppliersData.suppliers
          ?.map((s: Supplier) => s.city)
          .filter((c: string | null) => c)
      )] as string[];
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + ' млн ₸';
    }
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';
  };

  const filteredSuppliers = suppliers.filter(sup => 
    !searchQuery || 
    sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sup.contact_person && sup.contact_person.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-slate-400">Нет рейтинга</span>;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
          />
        ))}
        <span className="text-sm text-slate-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total_suppliers}</p>
            <p className="text-sm text-slate-500">Всего поставщиков</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.avg_rating.toFixed(1)}</p>
            <p className="text-sm text-slate-500">Средний рейтинг</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total_contracts}</p>
            <p className="text-sm text-slate-500">Активных контрактов</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.active_suppliers}</p>
            <p className="text-sm text-slate-500">С высоким рейтингом</p>
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
            placeholder="Поиск по названию или контакту..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все города</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Suppliers Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-8 text-slate-500 bg-white rounded-lg border border-slate-200">
          Поставщики не найдены
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
                  {supplier.contact_person && (
                    <p className="text-sm text-slate-500">{supplier.contact_person}</p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
              
              <div className="mb-3">
                {renderStars(supplier.rating)}
              </div>

              <div className="space-y-2 text-sm">
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{supplier.email}</span>
                  </div>
                )}
                {supplier.city && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.city}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-sm">
                <div>
                  <p className="text-slate-500">Заказов</p>
                  <p className="font-medium text-slate-900">{supplier.total_orders}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500">Сумма</p>
                  <p className="font-medium text-slate-900">{formatPrice(supplier.total_amount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
