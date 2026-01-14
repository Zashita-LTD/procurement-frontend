/**
 * OfflineIndicator - Индикатор оффлайн режима
 */
import { useState, useEffect } from 'react';
import { WifiOff, Wifi, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { subscribeToNetworkChanges, isOffline } from '@/lib/serviceWorker';

interface Props {
  showAlways?: boolean;
}

export function OfflineIndicator({ showAlways = false }: Props) {
  const [offline, setOffline] = useState(isOffline());
  const [wasOffline, setWasOffline] = useState(false);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToNetworkChanges(
      () => {
        setOffline(false);
        if (wasOffline) {
          setShowOnlineMessage(true);
          setTimeout(() => setShowOnlineMessage(false), 3000);
        }
      },
      () => {
        setOffline(true);
        setWasOffline(true);
      }
    );

    return unsubscribe;
  }, [wasOffline]);

  // Offline banner
  if (offline) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
        <div className="bg-orange-500 text-white rounded-xl p-4 shadow-lg flex items-center gap-3">
          <WifiOff className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Нет подключения</p>
            <p className="text-sm text-orange-100">
              Работаем в оффлайн режиме. Данные сохраняются локально.
            </p>
          </div>
          <CloudOff className="w-5 h-5 opacity-50" />
        </div>
      </div>
    );
  }

  // Back online message
  if (showOnlineMessage) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
        <div className="bg-green-500 text-white rounded-xl p-4 shadow-lg flex items-center gap-3">
          <Wifi className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Подключение восстановлено</p>
            <p className="text-sm text-green-100">
              Синхронизация данных...
            </p>
          </div>
          <RefreshCw className="w-5 h-5 animate-spin" />
        </div>
      </div>
    );
  }

  // Show always indicator (small)
  if (showAlways) {
    return (
      <div className="inline-flex items-center gap-1.5 text-green-600">
        <Cloud className="w-4 h-4" />
        <span className="text-xs">Онлайн</span>
      </div>
    );
  }

  return null;
}

// CSS для анимации (добавить в index.css)
// @keyframes slide-up {
//   from { transform: translateY(100%); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// }
// .animate-slide-up { animation: slide-up 0.3s ease-out; }
