/**
 * Schedule API service
 * API клиент для работы с планированием строительства
 */
import { brainApi } from '@/lib/axios';
import type {
  ScheduleResponse,
  StageInfo,
  ScheduleFromItemsRequest,
  ScheduleFromNamesRequest,
  CustomScheduleRequest,
  UpdateProgressRequest,
  AddDependencyRequest,
} from '@/types/schedule';

// Schedule endpoints через Brain API
const SCHEDULE_PATH = '/api/v1/schedule';

/**
 * Получить список доступных этапов строительства
 */
export async function getAvailableStages(): Promise<StageInfo[]> {
  const response = await brainApi.get<StageInfo[]>(`${SCHEDULE_PATH}/stages`);
  return response.data;
}

/**
 * Получить план строительства для загруженного документа
 */
export async function getScheduleFromDocument(documentId: string): Promise<ScheduleResponse> {
  const response = await brainApi.get<ScheduleResponse>(`${SCHEDULE_PATH}/document/${documentId}`);
  return response.data;
}

/**
 * Создать план строительства из списка материалов
 */
export async function createScheduleFromItems(request: ScheduleFromItemsRequest): Promise<ScheduleResponse> {
  const response = await brainApi.post<ScheduleResponse>(`${SCHEDULE_PATH}/from-items`, request);
  return response.data;
}

/**
 * Быстрое создание плана из названий материалов
 */
export async function createScheduleFromNames(request: ScheduleFromNamesRequest): Promise<ScheduleResponse> {
  const response = await brainApi.post<ScheduleResponse>(`${SCHEDULE_PATH}/from-names`, request);
  return response.data;
}

/**
 * Создать план с кастомными этапами
 */
export async function createCustomSchedule(request: CustomScheduleRequest): Promise<ScheduleResponse> {
  const response = await brainApi.post<ScheduleResponse>(`${SCHEDULE_PATH}/custom`, request);
  return response.data;
}

/**
 * Обновить прогресс этапа
 */
export async function updateStageProgress(request: UpdateProgressRequest): Promise<{ message: string }> {
  const response = await brainApi.post<{ message: string }>(`${SCHEDULE_PATH}/progress`, request);
  return response.data;
}

/**
 * Добавить зависимость между этапами
 */
export async function addStageDependency(request: AddDependencyRequest): Promise<{ message: string }> {
  const response = await brainApi.post<{ message: string }>(`${SCHEDULE_PATH}/dependencies`, request);
  return response.data;
}

/**
 * Экспорт в Excel
 */
export async function exportToExcel(
  request: ScheduleFromItemsRequest,
  startDate?: string
): Promise<Blob> {
  const url = startDate
    ? `${SCHEDULE_PATH}/export/excel?start_date=${startDate}`
    : `${SCHEDULE_PATH}/export/excel`;
  
  const response = await brainApi.post(url, request, {
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Экспорт в CSV
 */
export async function exportToCsv(request: ScheduleFromItemsRequest): Promise<Blob> {
  const response = await brainApi.post(`${SCHEDULE_PATH}/export/csv`, request, {
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Скачать файл экспорта
 */
export function downloadExport(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
