import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package,
  Users,
  BarChart3
} from 'lucide-react';

interface KPI {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: any;
}

const kpis: KPI[] = [
  { label: 'Выручка', value: '₽12.5M', change: '+15%', positive: true, icon: DollarSign },
  { label: 'Расходы', value: '₽8.2M', change: '+8%', positive: false, icon: TrendingDown },
  { label: 'Прибыль', value: '₽4.3M', change: '+28%', positive: true, icon: TrendingUp },
  { label: 'Проекты', value: '24', change: '+3', positive: true, icon: Package },
  { label: 'Команда', value: '47', change: '+5', positive: true, icon: Users },
  { label: 'Эффективность', value: '87%', change: '+4%', positive: true, icon: BarChart3 },
];

const projects = [
  { name: 'ЖК "Солнечный"', progress: 78, budget: 15000000, spent: 11700000 },
  { name: 'БЦ "Центральный"', progress: 45, budget: 8500000, spent: 3825000 },
  { name: 'Склад "Логистик"', progress: 92, budget: 5200000, spent: 4784000 },
];

/**
 * ExecutiveAnalyticsPage - аналитика для директора
 */
export function ExecutiveAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className="h-5 w-5 text-slate-400" />
              <span className={`text-sm font-medium ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-sm text-slate-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Выручка по месяцам</h3>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 78, 52, 88, 95, 72, 85, 92, 78, 110, 98, 125].map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${h * 2}px` }}
                />
                <span className="text-xs text-slate-400">
                  {['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Progress */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Прогресс проектов</h3>
          <div className="space-y-4">
            {projects.map((project, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{project.name}</span>
                  <span className="text-sm text-slate-500">{project.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      project.progress > 80 ? 'bg-green-500' : 
                      project.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Потрачено: {(project.spent / 1000000).toFixed(1)}M ₽</span>
                  <span>Бюджет: {(project.budget / 1000000).toFixed(1)}M ₽</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Suppliers */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Топ поставщики</h3>
          <div className="space-y-3">
            {[
              { name: 'Петрович', amount: 4500000, percent: 35 },
              { name: 'ТехноНИКОЛЬ', amount: 2800000, percent: 22 },
              { name: 'КнауфГипс', amount: 1900000, percent: 15 },
            ].map((supplier, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{supplier.name}</p>
                  <p className="text-sm text-slate-500">{(supplier.amount / 1000000).toFixed(1)}M ₽</p>
                </div>
                <span className="text-sm font-medium text-slate-600">{supplier.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Savings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Экономия</h3>
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-green-600">₽890K</p>
            <p className="text-slate-500 mt-1">сэкономлено за месяц</p>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                +12% к прошлому месяцу благодаря оптимизации закупок
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Требуют внимания</h3>
          <div className="space-y-3">
            {[
              { text: '3 заявки ожидают согласования', type: 'warning' },
              { text: 'Бюджет проекта ЖК превышен на 5%', type: 'error' },
              { text: 'Новый поставщик на проверке', type: 'info' },
            ].map((alert, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg text-sm ${
                  alert.type === 'error' ? 'bg-red-50 text-red-700' :
                  alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                {alert.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
