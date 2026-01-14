/**
 * Sourcing Optimizer Types
 * Типы для AI-оптимизации закупок
 */

// === Enums ===

export type StrategyType = 'one_stop_shop' | 'best_price' | 'balanced';

// === Request Types ===

export interface StageItem {
  name: string;
  quantity: number;
  unit: string;
  specifications?: Record<string, unknown>;
}

export interface OptimizeStageRequest {
  stage_name?: string;
  items: StageItem[];
  delivery_cost_estimate?: number;
  max_candidates_per_item?: number;
}

// === Response Types ===

export interface ProductMatch {
  product_id: string;
  product_name: string;
  supplier_name: string;
  price: number;
  unit: string;
  quantity_available?: number;
  similarity_score: number;
  requested_name: string;
  requested_quantity: number;
}

export interface SupplierProposal {
  supplier_name: string;
  items: ProductMatch[];
  total_price: number;
  items_count: number;
  coverage_percent: number;
  missing_items: string[];
  delivery_cost: number;
}

export interface SourcingOrder {
  supplier_name: string;
  items: ProductMatch[];
  subtotal: number;
  delivery_cost: number;
  total: number;
}

export interface SourcingStrategy {
  strategy_name: string;
  strategy_type: StrategyType;
  description: string;
  orders: SourcingOrder[];
  total_items_cost: number;
  total_delivery_cost: number;
  total_budget: number;
  suppliers_count: number;
  coverage_percent: number;
  missing_items: string[];
  ai_recommendation: string;
}

export interface OptimizationResult {
  stage_name?: string;
  items_requested: number;
  items_found: number;
  strategies: SourcingStrategy[];
  recommended_strategy?: string;
  ai_summary: string;
  potential_savings: number;
  processing_time_ms: number;
}

export interface StrategyInfo {
  type: StrategyType;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface SourcingHealthResponse {
  product_service: 'healthy' | 'unavailable';
  sourcing_optimizer: 'ready' | 'error';
}

// === Order Generation Types ===

export interface GeneratedOrder {
  id: string;
  supplier_name: string;
  items: OrderItem[];
  subtotal: number;
  delivery_cost: number;
  total: number;
  status: 'draft' | 'pending' | 'sent' | 'confirmed' | 'delivered';
  created_at: string;
  notes?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

export interface CreateOrdersRequest {
  strategy_type: StrategyType;
  stage_name?: string;
  orders: SourcingOrder[];
  notes?: string;
}

export interface CreateOrdersResponse {
  orders: GeneratedOrder[];
  total_orders: number;
  total_budget: number;
}

// === Comparison Types ===

export interface StrategyComparison {
  stage_name?: string;
  items_count: number;
  strategies_found: number;
  recommended: StrategyType | null;
  potential_savings: number;
  summary: string;
  details: StrategyComparisonDetail[];
}

export interface StrategyComparisonDetail {
  name: string;
  type: StrategyType;
  total_budget: number;
  suppliers_count: number;
  coverage_percent: number;
}
