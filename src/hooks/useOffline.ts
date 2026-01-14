/**
 * useOffline - Хук для управления offline режимом
 */
import { useState, useEffect, useCallback } from 'react';

interface OfflineData {
  key: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

const DB_NAME = 'procurement-offline';
const STORE_NAME = 'pending-data';

// IndexedDB операции
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

async function saveToIndexedDB(key: string, data: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const item: OfflineData = {
      key,
      data,
      timestamp: Date.now(),
      synced: false,
    };
    
    store.put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getFromIndexedDB(key: string): Promise<OfflineData | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function getAllPending(): Promise<OfflineData[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const all = request.result || [];
      resolve(all.filter((item: OfflineData) => !item.synced));
    };
    request.onerror = () => reject(request.error);
  });
}

async function markAsSynced(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    
    request.onsuccess = () => {
      const item = request.result;
      if (item) {
        item.synced = true;
        store.put(item);
      }
      tx.oncomplete = () => resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

interface UseOfflineReturn {
  isOnline: boolean;
  isServiceWorkerReady: boolean;
  pendingCount: number;
  saveOffline: (key: string, data: any) => Promise<void>;
  getOffline: (key: string) => Promise<any>;
  syncNow: () => Promise<number>;
  registerServiceWorker: () => Promise<void>;
}

export function useOffline(): UseOfflineReturn {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServiceWorkerReady, setServiceWorkerReady] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Online/offline события
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Подсчёт pending данных
  useEffect(() => {
    const updatePendingCount = async () => {
      try {
        const pending = await getAllPending();
        setPendingCount(pending.length);
      } catch {
        setPendingCount(0);
      }
    };
    
    updatePendingCount();
    const interval = setInterval(updatePendingCount, 10000);
    return () => clearInterval(interval);
  }, []);

  // Регистрация Service Worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration.scope);
      setServiceWorkerReady(true);
      
      // Авто-синхронизация при возврате онлайн
      if ('sync' in registration) {
        navigator.serviceWorker.ready.then((reg) => {
          // @ts-ignore
          reg.sync.register('sync-orders');
        });
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }, []);

  // Сохранение данных offline
  const saveOffline = useCallback(async (key: string, data: any) => {
    await saveToIndexedDB(key, data);
    const pending = await getAllPending();
    setPendingCount(pending.length);
  }, []);

  // Получение данных offline
  const getOffline = useCallback(async (key: string) => {
    const item = await getFromIndexedDB(key);
    return item?.data || null;
  }, []);

  // Синхронизация
  const syncNow = useCallback(async (): Promise<number> => {
    if (!isOnline) return 0;
    
    const pending = await getAllPending();
    let synced = 0;
    
    for (const item of pending) {
      try {
        // Отправляем данные на сервер
        const response = await fetch('/api/brain/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });
        
        if (response.ok) {
          await markAsSynced(item.key);
          synced++;
        }
      } catch (error) {
        console.error('Sync failed for', item.key, error);
      }
    }
    
    const remaining = await getAllPending();
    setPendingCount(remaining.length);
    
    return synced;
  }, [isOnline]);

  return {
    isOnline,
    isServiceWorkerReady,
    pendingCount,
    saveOffline,
    getOffline,
    syncNow,
    registerServiceWorker,
  };
}
