/**
 * Service Worker Registration
 * Подключение offline функциональности
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker не поддерживается');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker зарегистрирован:', registration.scope);

    // Обработка обновлений
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Новая версия доступна
            console.log('Доступна новая версия приложения');
            
            // Показать уведомление пользователю
            if (window.confirm('Доступна новая версия! Обновить?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Ошибка регистрации Service Worker:', error);
    return null;
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.unregister();
  } catch (error) {
    console.error('Ошибка отмены регистрации Service Worker:', error);
    return false;
  }
}

// Запрос разрешения на уведомления
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('Уведомления не поддерживаются');
    return 'denied';
  }

  return await Notification.requestPermission();
}

// Проверка статуса offline
export function isOffline(): boolean {
  return !navigator.onLine;
}

// Подписка на изменения онлайн/оффлайн
export function subscribeToNetworkChanges(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
