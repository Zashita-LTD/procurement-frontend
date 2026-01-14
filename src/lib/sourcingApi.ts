/**
 * Sourcing API service
 * API клиент для AI-оптимизации закупок
 */
import { brainApi } from '@/lib/axios';
import type {
  OptimizeStageRequest,
  OptimizationResult,
  SupplierProposal,
  StrategyInfo,
  SourcingHealthResponse,
  StrategyComparison,
  StageItem,
  CreateOrdersRequest,
  CreateOrdersResponse,
} from '@/types/sourcing';

// Sourcing endpoints через Brain API
const SOURCING_PATH = '/api/v1/sourcing';

/**
 * Оптимизировать закупку для этапа строительства
 * Возвращает стратегии "Комфорт" и "Эконом" с AI-рекомендацией
 */
export async function optimizeStage(request: OptimizeStageRequest): Promise<OptimizationResult> {
  const response = await brainApi.post<OptimizationResult>(`${SOURCING_PATH}/optimize`, request);
  return response.data;
}

/**
 * Получить предложения от всех поставщиков
 * Возвращает поставщиков отсортированных по покрытию и цене
 */
export async function getSupplierProposals(
  items: StageItem[],
  maxCandidates: number = 5
): Promise<SupplierProposal[]> {
  const response = await brainApi.post<SupplierProposal[]>(
    `${SOURCING_PATH}/proposals`,
    items,
    { params: { max_candidates: maxCandidates } }
  );
  return response.data;
}

/**
 * Быстрое сравнение стратегий
 */
export async function compareStrategies(request: OptimizeStageRequest): Promise<StrategyComparison> {
  const response = await brainApi.post<StrategyComparison>(`${SOURCING_PATH}/compare`, request);
  return response.data;
}

/**
 * Получить список доступных стратегий с описанием
 */
export async function getAvailableStrategies(): Promise<StrategyInfo[]> {
  const response = await brainApi.get<StrategyInfo[]>(`${SOURCING_PATH}/strategies`);
  return response.data;
}

/**
 * Проверить доступность Product Service
 */
export async function checkSourcingHealth(): Promise<SourcingHealthResponse> {
  const response = await brainApi.get<SourcingHealthResponse>(`${SOURCING_PATH}/health`);
  return response.data;
}

/**
 * Создать заказы на основе выбранной стратегии
 */
export async function createOrders(request: CreateOrdersRequest): Promise<CreateOrdersResponse> {
  const response = await brainApi.post<CreateOrdersResponse>(`${SOURCING_PATH}/orders`, request);
  return response.data;
}

/**
 * Экспорт заказов в Excel
 */
export async function exportOrdersExcel(orderIds: string[]): Promise<Blob> {
  const response = await brainApi.post(
    `${SOURCING_PATH}/orders/export/excel`,
    { order_ids: orderIds },
    { responseType: 'blob' }
  );
  return response.data;
}

/**
 * Экспорт заказов в PDF
 */
export async function exportOrdersPdf(orderIds: string[]): Promise<Blob> {
  const response = await brainApi.post(
    `${SOURCING_PATH}/orders/export/pdf`,
    { order_ids: orderIds },
    { responseType: 'blob' }
  );
  return response.data;
}
