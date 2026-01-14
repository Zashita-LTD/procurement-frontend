/**
 * ForecastPage - Страница прогнозов спроса
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Minus,
  BarChart3,
  RefreshCw,
  AlertCircle,
  Package,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { brainApi } from '@/lib/axios';

interface Forecast {
  product_id: string;
  product_name: string;
  current_demand: number;
  predicted_demand: number;
  change_percent: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  recommended_quantity: number;
  forecast_period: string;
}

interface Summary {
  total_products: number;
  trending_up: number;
  trending_down: number;
  stable: number;
  average_confidence: number;
}

export function ForecastPage() {
  const navigate = useNavigate();
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'up' | 'down' | 'stable'>('all');
  const [periods, setPeriods] = useState(3);

  // Загрузка данных
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [forecastRes, summaryRes] = await Promise.all([
        brainApi.get(`/analytics/forecast?periods=${periods}&limit=50`),
        brainApi.get('/analytics/summary'),
      ]);
      
      setForecasts(forecastRes.data.forecasts || []);
      setSummary(summaryRes.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки прогнозов');
      // Демо данные при ошибке
      setForecasts(DEMO_FORECASTS);
      setSummary(DEMO_SUMMARY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [periods]);

  // Фильтрация
  const filteredForecasts = forecasts.filter(f => 
    filter === 'all' || f.trend === filter
  );

  // Тренд иконка
  const TrendIcon = ({ trend }: { trend: string }) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
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
            <h1 className="text-lg font-semibold">Прогноз спроса</h1>
            <p className="text-sm text-gray-500">ML аналитика</p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>

        {/* Period selector */}
        <div className="px-4 pb-3 flex gap-2">
          {[1, 3, 6, 12].map((p) => (
            <button
              key={p}
              onClick={() => setPeriods(p)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                periods === p
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {p} мес
            </button>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'Все', icon: Package },
            { key: 'up', label: 'Рост', icon: TrendingUp },
            { key: 'down', label: 'Падение', icon: TrendingDown },
            { key: 'stable', label: 'Стабильно', icon: Minus },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap",
                filter === key
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-700">{error}</span>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold">{summary.total_products}</p>
              <p className="text-xs text-gray-500">Товаров</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{summary.trending_up}</p>
              <p className="text-xs text-green-600">Рост</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{summary.trending_down}</p>
              <p className="text-xs text-red-600">Падение</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-600">{summary.stable}</p>
              <p className="text-xs text-gray-500">Стабильно</p>
            </div>
          </div>
        )}

        {/* Forecasts list */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
            <p className="text-gray-500 mt-2">Загрузка прогнозов...</p>
          </div>
        ) : filteredForecasts.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-gray-500 mt-2">Нет данных для отображения</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredForecasts.map((forecast) => (
              <div
                key={forecast.product_id}
                className="bg-white rounded-2xl shadow-sm p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{forecast.product_name}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{forecast.forecast_period}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
                    forecast.trend === 'up' && "bg-green-100 text-green-700",
                    forecast.trend === 'down' && "bg-red-100 text-red-700",
                    forecast.trend === 'stable' && "bg-gray-100 text-gray-700"
                  )}>
                    <TrendIcon trend={forecast.trend} />
                    {forecast.change_percent > 0 ? '+' : ''}{forecast.change_percent}%
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-lg font-bold">{forecast.current_demand}</p>
                    <p className="text-xs text-gray-500">Сейчас</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-2">
                    <p className="text-lg font-bold text-blue-600">{forecast.predicted_demand}</p>
                    <p className="text-xs text-blue-600">Прогноз</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-2">
                    <p className="text-lg font-bold text-purple-600">{forecast.recommended_quantity}</p>
                    <p className="text-xs text-purple-600">Рекоменд.</p>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Уверенность</span>
                    <span className="font-medium">{Math.round(forecast.confidence * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${forecast.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Демо данные
const DEMO_FORECASTS: Forecast[] = [
  { product_id: 'P001', product_name: 'Цемент М500', current_demand: 150, predicted_demand: 195, change_percent: 30, confidence: 0.85, trend: 'up', recommended_quantity: 224, forecast_period: 'Апрель 2026' },
  { product_id: 'P002', product_name: 'Арматура 12мм', current_demand: 200, predicted_demand: 240, change_percent: 20, confidence: 0.82, trend: 'up', recommended_quantity: 276, forecast_period: 'Апрель 2026' },
  { product_id: 'P003', product_name: 'Кирпич красный', current_demand: 1000, predicted_demand: 1150, change_percent: 15, confidence: 0.78, trend: 'up', recommended_quantity: 1322, forecast_period: 'Апрель 2026' },
  { product_id: 'P004', product_name: 'Песок речной', current_demand: 300, predicted_demand: 285, change_percent: -5, confidence: 0.75, trend: 'stable', recommended_quantity: 328, forecast_period: 'Апрель 2026' },
  { product_id: 'P005', product_name: 'Краска фасадная', current_demand: 50, predicted_demand: 38, change_percent: -24, confidence: 0.72, trend: 'down', recommended_quantity: 44, forecast_period: 'Апрель 2026' },
];

const DEMO_SUMMARY: Summary = {
  total_products: 8,
  trending_up: 4,
  trending_down: 2,
  stable: 2,
  average_confidence: 0.78,
};
