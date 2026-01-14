/**
 * useTaskStatus - React хук для WebSocket статуса задачи
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export type ProcessingStatus = 
  | 'pending' 
  | 'parsing' 
  | 'matching' 
  | 'optimizing' 
  | 'completed' 
  | 'error';

export interface TaskStatusUpdate {
  task_id: string;
  status: ProcessingStatus;
  progress: number;
  message: string | null;
  data: Record<string, unknown> | null;
  timestamp: string;
}

interface UseTaskStatusOptions {
  onStatusChange?: (status: TaskStatusUpdate) => void;
  onError?: (error: Event) => void;
  onComplete?: (data: TaskStatusUpdate) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useTaskStatus(
  taskId: string | null,
  options: UseTaskStatusOptions = {}
) {
  const {
    onStatusChange,
    onError,
    onComplete,
    autoReconnect = true,
    reconnectInterval = 3000,
  } = options;

  const [status, setStatus] = useState<TaskStatusUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!taskId) return;

    // Закрываем предыдущее соединение
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Определяем URL WebSocket
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.host}`;
    const wsUrl = `${wsHost}/api/brain/api/v1/ws/tasks/${taskId}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log(`[WS] Connected to task: ${taskId}`);
      };

      ws.onmessage = (event) => {
        try {
          const data: TaskStatusUpdate = JSON.parse(event.data);
          setStatus(data);
          onStatusChange?.(data);

          if (data.status === 'completed') {
            onComplete?.(data);
          }
        } catch (e) {
          console.error('[WS] Failed to parse message:', e);
        }
      };

      ws.onerror = (event) => {
        console.error('[WS] Error:', event);
        setError('Ошибка соединения');
        onError?.(event);
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log(`[WS] Disconnected from task: ${taskId}`);

        // Авто-переподключение
        if (autoReconnect && status?.status !== 'completed') {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('[WS] Attempting to reconnect...');
            connect();
          }, reconnectInterval);
        }
      };
    } catch (e) {
      setError('Не удалось подключиться');
      console.error('[WS] Connection error:', e);
    }
  }, [taskId, autoReconnect, reconnectInterval, onStatusChange, onError, onComplete, status?.status]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Ping для поддержания соединения
  const ping = useCallback(() => {
    sendMessage({ action: 'ping' });
  }, [sendMessage]);

  // Запуск демо (для тестирования)
  const startDemo = useCallback(() => {
    sendMessage({ action: 'start_demo' });
  }, [sendMessage]);

  // Подключение при изменении taskId
  useEffect(() => {
    if (taskId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [taskId, connect, disconnect]);

  return {
    status,
    isConnected,
    error,
    connect,
    disconnect,
    ping,
    startDemo,
    sendMessage,
  };
}

/**
 * Хелпер для получения текста статуса
 */
export function getStatusText(status: ProcessingStatus): string {
  const texts: Record<ProcessingStatus, string> = {
    pending: 'Ожидание',
    parsing: 'Парсинг документа',
    matching: 'Поиск товаров',
    optimizing: 'Оптимизация',
    completed: 'Завершено',
    error: 'Ошибка',
  };
  return texts[status] || status;
}

/**
 * Хелпер для получения цвета статуса
 */
export function getStatusColor(status: ProcessingStatus): string {
  const colors: Record<ProcessingStatus, string> = {
    pending: 'gray',
    parsing: 'blue',
    matching: 'indigo',
    optimizing: 'purple',
    completed: 'green',
    error: 'red',
  };
  return colors[status] || 'gray';
}
