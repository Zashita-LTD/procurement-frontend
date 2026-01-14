/**
 * Schedule API service
 * API клиент для работы с планированием строительства
 */
import axios from '@/lib/axios';
import type {
  ScheduleResponse,
  StageInfo,
  ScheduleFromItemsRequest,
  ScheduleFromNamesRequest,
  CustomScheduleRequest,
  UpdateProgressRequest,
  AddDependencyRequest,
} from '@/types/schedule';

const BASE_URL = '/api/v1/schedule';

/**
 * Получить список доступных этапов строительства
 */
export async function getAvailableStages(): Promise<StageInfo[]> {
  const response = await axios.get<StageInfo[]>(`${BASE_URL}/stages`);
  return response.data;
}

/**
 * Получить план строительства для загруженного документа
 */
export async function getScheduleFromDocument(documentId: string): Promise<ScheduleResponse> {
  const response = await axios.get<ScheduleResponse>(`${BASE_URL}/document/${documentId}`);
  return response.data;
}

/**
 * Создать план строительства из списка материалов
 */
export async function createScheduleFromItems(request: ScheduleFromItemsRequest): Promise<ScheduleResponse> {
  const response = await axios.post<ScheduleResponse>(`${BASE_URL}/from-items`, request);
  return response.data;
}

/**
 * Быстрое создание плана из названий материалов
 */
export async function createScheduleFromNames(request: ScheduleFromNamesRequest): Promise<ScheduleResponse> {
  const response = await axios.post<ScheduleResponse>(`${BASE_URL}/from-names`, request);
  return response.data;
}

/**
 * Создать план с кастомными этапами
 */
export async function createCustomSchedule(request: CustomScheduleRequest): Promise<ScheduleResponse> {
  const response = await axios.post<ScheduleResponse>(`${BASE_URL}/custom`, request);
  return response.data;
}

/**
 * Обновить прогресс этапа
 */
export async function updateStageProgress(request: UpdateProgressRequest): Promise<{ message: string }> {
  const response = await axios.post<{ message: string }>(`${BASE_URL}/progress`, request);
  return response.data;
}

/**
 * Добавить зависимость между этапами
 */
export async function addStageDependency(request: AddDependencyRequest): Promise<{ message: string }> {
  const response = await axios.post<{ message: string }>(`${BASE_URL}/dependencies`, request);
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
    ? `${BASE_URL}/export/excel?start_date=${startDate}`
    : `${BASE_URL}/export/excel`;
  
  const response = await axios.post(url, request, {
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Экспорт в CSV
 */
export async function exportToCsv(request: ScheduleFromItemsRequest): Promise<Blob> {
  const response = await axios.post(`${BASE_URL}/export/csv`, request, {
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
