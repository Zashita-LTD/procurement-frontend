/**
 * ExpensesDashboardPage - Дашборд расходов по проектам
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Типы
interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface MonthlyExpense {
  month: string;
  amount: number;
  budget: number;
}

interface ProjectExpense {
  id: string;
  name: string;
  spent: number;
  budget: number;
  categories: ExpenseCategory[];
}

// Демо данные
const DEMO_CATEGORIES: ExpenseCategory[] = [
  { name: 'Строительные материалы', amount: 1250000, percentage: 45, color: 'bg-blue-500' },
  { name: 'Металлоконструкции', amount: 680000, percentage: 24, color: 'bg-green-500' },
  { name: 'Электрика', amount: 420000, percentage: 15, color: 'bg-yellow-500' },
  { name: 'Сантехника', amount: 280000, percentage: 10, color: 'bg-purple-500' },
  { name: 'Прочее', amount: 170000, percentage: 6, color: 'bg-gray-400' },
];

const DEMO_MONTHLY: MonthlyExpense[] = [
  { month: 'Авг', amount: 380000, budget: 400000 },
  { month: 'Сен', amount: 520000, budget: 500000 },
  { month: 'Окт', amount: 450000, budget: 500000 },
  { month: 'Ноя', amount: 680000, budget: 600000 },
  { month: 'Дек', amount: 420000, budget: 500000 },
  { month: 'Янв', amount: 350000, budget: 500000 },
];

const DEMO_PROJECTS: ProjectExpense[] = [
  { 
    id: '1', 
    name: 'ЖК Саяхат', 
    spent: 1450000, 
    budget: 2000000,
    categories: [
      { name: 'Материалы', amount: 850000, percentage: 58, color: 'bg-blue-500' },
      { name: 'Работы', amount: 600000, percentage: 42, color: 'bg-green-500' },
    ]
  },
  { 
    id: '2', 
    name: 'Офис Нурлы Тау', 
    spent: 780000, 
    budget: 1000000,
    categories: [
      { name: 'Материалы', amount: 520000, percentage: 67, color: 'bg-blue-500' },
      { name: 'Работы', amount: 260000, percentage: 33, color: 'bg-green-500' },
    ]
  },
  { 
    id: '3', 
    name: 'Склад Алатау', 
    spent: 570000, 
    budget: 500000,
    categories: [
      { name: 'Материалы', amount: 400000, percentage: 70, color: 'bg-blue-500' },
      { name: 'Работы', amount: 170000, percentage: 30, color: 'bg-green-500' },
    ]
  },
];

// Форматирование цены
const formatPrice = (amount: number) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' млн ₸';
  }
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';
};

export function ExpensesDashboardPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Подсчёт общих показателей
  const totalSpent = DEMO_CATEGORIES.reduce((sum, cat) => sum + cat.amount, 0);
  const totalBudget = 3500000;
  const budgetUsed = Math.round((totalSpent / totalBudget) * 100);
  const vsLastMonth = 12; // % к прошлому месяцу

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
            <h1 className="text-lg font-semibold">Расходы</h1>
            <p className="text-sm text-gray-500">Аналитика закупок</p>
          </div>
        </div>

        {/* Period tabs */}
        <div className="px-4 pb-3 flex gap-2">
          {(['month', 'quarter', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                period === p
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {p === 'month' && 'Месяц'}
              {p === 'quarter' && 'Квартал'}
              {p === 'year' && 'Год'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Расходы</span>
            </div>
            <p className="text-2xl font-bold">{formatPrice(totalSpent)}</p>
            <div className="flex items-center gap-1 mt-1">
              {vsLastMonth > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500" />
              )}
              <span className={cn(
                "text-sm font-medium",
                vsLastMonth > 0 ? "text-red-500" : "text-green-500"
              )}>
                {vsLastMonth > 0 ? '+' : ''}{vsLastMonth}%
              </span>
              <span className="text-xs text-gray-400">vs прошл.</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Package className="w-4 h-4" />
              <span className="text-sm">Бюджет</span>
            </div>
            <p className="text-2xl font-bold">{budgetUsed}%</p>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    budgetUsed > 100 ? "bg-red-500" : budgetUsed > 80 ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {formatPrice(totalBudget - totalSpent)} осталось
              </p>
            </div>
          </div>
        </div>

        {/* Monthly chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold">Расходы по месяцам</h2>
            </div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-end justify-between h-40 gap-2">
            {DEMO_MONTHLY.map((item, idx) => {
              const maxAmount = Math.max(...DEMO_MONTHLY.map(m => Math.max(m.amount, m.budget)));
              const height = (item.amount / maxAmount) * 100;
              const budgetHeight = (item.budget / maxAmount) * 100;
              const overBudget = item.amount > item.budget;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full h-32 flex items-end justify-center">
                    {/* Budget line */}
                    <div 
                      className="absolute w-full border-t-2 border-dashed border-gray-300"
                      style={{ bottom: `${budgetHeight}%` }}
                    />
                    {/* Amount bar */}
                    <div 
                      className={cn(
                        "w-full max-w-8 rounded-t-lg transition-all",
                        overBudget ? "bg-red-400" : "bg-blue-400"
                      )}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-400" />
              <span>Расходы</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-0 border-t-2 border-dashed border-gray-300" />
              <span>Бюджет</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold">По категориям</h2>
          </div>

          {/* Simple pie chart representation */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {DEMO_CATEGORIES.reduce((acc, cat, idx) => {
                  const offset = acc.offset;
                  acc.elements.push(
                    <circle
                      key={idx}
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="transparent"
                      stroke={cat.color.replace('bg-', 'var(--')}
                      strokeWidth="3"
                      strokeDasharray={`${cat.percentage} ${100 - cat.percentage}`}
                      strokeDashoffset={-offset}
                      className={cat.color.replace('bg-', 'stroke-')}
                    />
                  );
                  acc.offset += cat.percentage;
                  return acc;
                }, { elements: [] as JSX.Element[], offset: 0 }).elements}
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              {DEMO_CATEGORIES.slice(0, 3).map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded", cat.color)} />
                    <span className="text-gray-600">{cat.name}</span>
                  </div>
                  <span className="font-medium">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full list */}
          <div className="space-y-3">
            {DEMO_CATEGORIES.map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{cat.name}</span>
                  <span className="font-medium">{formatPrice(cat.amount)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", cat.color)}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold mb-4">Расходы по проектам</h2>
          
          <div className="space-y-4">
            {DEMO_PROJECTS.map((project) => {
              const progress = Math.round((project.spent / project.budget) * 100);
              const overBudget = progress > 100;
              
              return (
                <div key={project.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(project.spent)} / {formatPrice(project.budget)}
                      </p>
                    </div>
                    <span className={cn(
                      "text-sm font-semibold",
                      overBudget ? "text-red-500" : "text-green-500"
                    )}>
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        overBudget ? "bg-red-500" : "bg-blue-500"
                      )}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
