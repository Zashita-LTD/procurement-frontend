/**
 * BuyerCatalogPage - Страница каталога для закупщика
 */
import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Grid, 
  List,
  ShoppingCart,
  AlertTriangle,
  Tag
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category_code: string | null;
  price: number;
  unit: string | null;
  description: string | null;
  stock_quantity: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  code: string;
  icon: string | null;
  product_count: number;
}

interface CatalogStats {
  total_products: number;
  total_categories: number;
  low_stock_count: number;
  total_stock_value: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://34.46.91.149:8000';

export function BuyerCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CatalogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/products/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/products/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('per_page', '24');
      if (categoryFilter) params.append('category', categoryFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`${API_URL}/api/v1/products?${params}`);
      const data = await response.json();
      
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';
  };

  const getCategoryName = (code: string | null) => {
    if (!code) return 'Без категории';
    const cat = categories.find(c => c.code === code);
    return cat?.name || code;
  };

  const totalPages = Math.ceil(total / 24);

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total_products}</p>
            <p className="text-sm text-slate-500">Товаров в каталоге</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <Tag className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total_categories}</p>
            <p className="text-sm text-slate-500">Категорий</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.low_stock_count}</p>
            <p className="text-sm text-slate-500">Низкий остаток</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {stats.total_stock_value >= 1000000 
                ? (stats.total_stock_value / 1000000).toFixed(1) + ' млн'
                : formatPrice(stats.total_stock_value)}
            </p>
            <p className="text-sm text-slate-500">Стоимость склада</p>
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
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Поиск товаров..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все категории</option>
          {categories.map(cat => (
            <option key={cat.code} value={cat.code}>{cat.name} ({cat.product_count})</option>
          ))}
        </select>
        <div className="flex gap-1 border border-slate-200 rounded-lg p-1">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-500'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-500'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-slate-500 bg-white rounded-lg border border-slate-200">
          Товары не найдены
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                <Package className="h-12 w-12 text-slate-300" />
              </div>
              <span className="text-xs text-blue-600 font-medium">
                {getCategoryName(product.category_code)}
              </span>
              <h3 className="font-medium text-slate-900 mt-1 line-clamp-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
              )}
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
                  <p className="text-xs text-slate-500">за {product.unit || 'шт'}</p>
                </div>
                <div className={`text-sm ${product.stock_quantity < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {product.stock_quantity} шт
                </div>
              </div>
              <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                В заявку
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm text-slate-500">
                <th className="px-4 py-3 font-medium">Товар</th>
                <th className="px-4 py-3 font-medium">Категория</th>
                <th className="px-4 py-3 font-medium">Цена</th>
                <th className="px-4 py-3 font-medium">Остаток</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    {product.description && (
                      <p className="text-sm text-slate-500 line-clamp-1">{product.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getCategoryName(product.category_code)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{formatPrice(product.price)}</p>
                    <p className="text-xs text-slate-500">за {product.unit || 'шт'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                      product.stock_quantity < 10 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {product.stock_quantity} шт
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      В заявку
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Назад
          </button>
          <span className="px-4 py-2 text-slate-600">
            Страница {page} из {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}
