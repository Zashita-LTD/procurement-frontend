/**
 * Analytics API client - Клиент для API аналитики
 */
import { brainApi } from './axios';

// Типы
export interface SupplierStats {
  supplier_id: string;
  supplier_name: string;
  total_orders: number;
  total_amount: number;
  coverage_percent: number;
  avg_delivery_days: number;
  rating: number;
}

export interface SavingsStats {
  total_savings: number;
  percent_savings: number;
  best_price_savings: number;
  consolidation_savings: number;
  negotiation_savings: number;
  avg_savings_per_order: number;
}

export interface MonthlyStats {
  month: string;
  orders: number;
  amount: number;
  savings: number;
}

export interface RecentOptimization {
  stage_name: string;
  project_name: string;
  strategy: string;
  original_cost: number;
  optimized_cost: number;
  savings: number;
  date: string;
}

export interface AnalyticsDashboard {
  period: string;
  start_date: string;
  end_date: string;
  total_orders: number;
  total_amount: number;
  average_order_amount: number;
  top_suppliers: SupplierStats[];
  savings_stats: SavingsStats;
  strategy_distribution: Record<string, number>;
  monthly_stats: MonthlyStats[];
  recent_optimizations: RecentOptimization[];
}

export interface SupplierAnalytics {
  supplier_id: string;
  period: string;
  orders_count: number;
  total_amount: number;
  products_supplied: number;
  unique_products: number;
  avg_price_competitiveness: number;
  delivery_on_time_rate: number;
  quality_rating: number;
  monthly_trend: { month: string; amount: number }[];
  top_categories: { name: string; amount: number }[];
}

export interface SavingsBreakdown {
  period: string;
  total_savings: number;
  breakdown: {
    price_optimization: { amount: number; percent: number; description: string };
    volume_consolidation: { amount: number; percent: number; description: string };
    negotiation: { amount: number; percent: number; description: string };
  };
  comparison_with_market: {
    our_avg_price: number;
    market_avg_price: number;
    savings_vs_market: number;
  };
  optimization_opportunities: {
    category: string;
    potential_savings: number;
    recommendation: string;
  }[];
}

export interface TrendsData {
  metric: string;
  period: string;
  data: { period: string; value: number; change: number | null }[];
  summary: {
    total: number;
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
}

// API функции
export const analyticsApi = {
  /**
   * Получить данные для дашборда
   */
  async getDashboard(
    period: 'week' | 'month' | 'quarter' | 'year' = 'month',
    projectId?: string
  ): Promise<AnalyticsDashboard> {
    const params = new URLSearchParams({ period });
    if (projectId) params.append('project_id', projectId);
    
    const response = await brainApi.get<AnalyticsDashboard>(
      `/api/v1/analytics/dashboard?${params}`
    );
    return response.data;
  },

  /**
   * Получить аналитику по поставщику
   */
  async getSupplierAnalytics(
    supplierId: string,
    period: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<SupplierAnalytics> {
    const response = await brainApi.get<SupplierAnalytics>(
      `/api/v1/analytics/suppliers/${supplierId}?period=${period}`
    );
    return response.data;
  },

  /**
   * Получить разбивку экономии
   */
  async getSavingsBreakdown(
    period: 'week' | 'month' | 'quarter' | 'year' = 'month',
    projectId?: string
  ): Promise<SavingsBreakdown> {
    const params = new URLSearchParams({ period });
    if (projectId) params.append('project_id', projectId);
    
    const response = await brainApi.get<SavingsBreakdown>(
      `/api/v1/analytics/savings?${params}`
    );
    return response.data;
  },

  /**
   * Получить тренды
   */
  async getTrends(
    period: 'week' | 'month' | 'quarter' | 'year' = 'quarter',
    metric: 'amount' | 'orders' | 'savings' = 'amount'
  ): Promise<TrendsData> {
    const response = await brainApi.get<TrendsData>(
      `/api/v1/analytics/trends?period=${period}&metric=${metric}`
    );
    return response.data;
  }
};
