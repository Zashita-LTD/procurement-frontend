/**
 * Service Worker для Procurement Frontend
 * Offline кэширование и синхронизация
 */

const CACHE_NAME = 'procurement-v1';

// Ресурсы для предварительного кэширования
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Пропускаем не-GET запросы
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Для API запросов - network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  
  // Для статических ресурсов - cache first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$/) ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
  
  // Для остального - network first
  event.respondWith(networkFirst(event.request));
});

// Cache First стратегия
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache first error:', error);
    
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    throw error;
  }
}

// Network First стратегия  
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Message handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background Sync
self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);
  
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// Sync orders
async function syncOrders() {
  try {
    const db = await openDB();
    const tx = db.transaction('pendingOrders', 'readonly');
    const store = tx.objectStore('pendingOrders');
    const orders = await getAllFromStore(store);
    
    for (const order of orders) {
      try {
        await fetch('/api/brain/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
        
        const deleteTx = db.transaction('pendingOrders', 'readwrite');
        const deleteStore = deleteTx.objectStore('pendingOrders');
        deleteStore.delete(order.id);
      } catch (e) {
        console.error('[SW] Failed to sync order:', order.id, e);
      }
    }
  } catch (error) {
    console.error('[SW] Sync orders failed:', error);
  }
}

// IndexedDB helpers
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('procurement-offline', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingOrders')) {
        db.createObjectStore('pendingOrders', { keyPath: 'id' });
      }
    };
  });
}

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

// Push notification
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Новое уведомление',
    icon: '/logo192.png',
    badge: '/badge72.png',
    tag: data.tag || 'procurement-notification',
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Открыть' },
      { action: 'close', title: 'Закрыть' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Procurement', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

console.log('[SW] Service Worker loaded');
