import type { 
  ScheduleResponse, 
  StageInfo, 
  ScheduleFromItemsRequest, 
  ScheduleFromNamesRequest,
  CustomScheduleRequest 
} from '@/types/schedule';

const API_BASE = import.meta.env.VITE_BRAIN_API_URL || 'http://localhost:8000';

/**
 * API клиент для работы с планировщиком этапов строительства
 */
export const scheduleApi = {
  /**
   * Получить список доступных этапов строительства
   */
  async getStages(): Promise<StageInfo[]> {
    const response = await fetch(`${API_BASE}/api/v1/schedule/stages`);
    if (!response.ok) {
      throw new Error('Failed to fetch stages');
    }
    return response.json();
  },

  /**
   * Получить план строительства для загруженного документа
   */
  async getScheduleFromDocument(documentId: string): Promise<ScheduleResponse> {
    const response = await fetch(`${API_BASE}/api/v1/schedule/document/${documentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    return response.json();
  },

  /**
   * Создать план строительства из списка материалов
   */
  async createScheduleFromItems(request: ScheduleFromItemsRequest): Promise<ScheduleResponse> {
    const response = await fetch(`${API_BASE}/api/v1/schedule/from-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('Failed to create schedule');
    }
    return response.json();
  },

  /**
   * Быстрое создание плана из названий материалов
   */
  async createScheduleFromNames(request: ScheduleFromNamesRequest): Promise<ScheduleResponse> {
    const response = await fetch(`${API_BASE}/api/v1/schedule/from-names`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('Failed to create schedule');
    }
    return response.json();
  },

  /**
   * Создать план с кастомными этапами строительства
   */
  async createCustomSchedule(request: CustomScheduleRequest): Promise<ScheduleResponse> {
    const response = await fetch(`${API_BASE}/api/v1/schedule/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('Failed to create custom schedule');
    }
    return response.json();
  },
};
