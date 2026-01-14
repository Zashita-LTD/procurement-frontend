/**
 * NotificationSettingsPage - Настройки уведомлений
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell,
  Send,
  MessageCircle,
  Mail,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationSettings {
  telegramEnabled: boolean;
  telegramChatId: string;
  emailEnabled: boolean;
  emailAddress: string;
  orderUpdates: boolean;
  priceAlerts: boolean;
  budgetWarnings: boolean;
}

const SETTINGS_KEY = 'notification_settings';

// Загрузка настроек из localStorage
function loadSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    telegramEnabled: false,
    telegramChatId: '',
    emailEnabled: false,
    emailAddress: '',
    orderUpdates: true,
    priceAlerts: true,
    budgetWarnings: true,
  };
}

// Сохранение настроек
function saveSettings(settings: NotificationSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function NotificationSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);

  // Обновление настроек
  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Тестовое уведомление
  const sendTestNotification = async () => {
    if (!settings.telegramChatId) return;
    
    setTestStatus('loading');
    try {
      const response = await fetch(`/api/brain/notifications/test/${settings.telegramChatId}`, {
        method: 'POST',
      });
      if (response.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch {
      setTestStatus('error');
    }
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Уведомления</h1>
            <p className="text-sm text-gray-500">Настройка оповещений</p>
          </div>
          {saved && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              Сохранено
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Telegram */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Telegram</p>
                  <p className="text-sm text-gray-500">Мгновенные уведомления</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('telegramEnabled', !settings.telegramEnabled)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  settings.telegramEnabled ? "bg-blue-500" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute w-5 h-5 bg-white rounded-full top-1 transition-all shadow-sm",
                  settings.telegramEnabled ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </div>
          
          {settings.telegramEnabled && (
            <div className="p-4 space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Chat ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.telegramChatId}
                    onChange={(e) => updateSetting('telegramChatId', e.target.value)}
                    placeholder="Ваш Chat ID"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendTestNotification}
                    disabled={!settings.telegramChatId || testStatus === 'loading'}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors",
                      testStatus === 'success' 
                        ? "bg-green-500 text-white"
                        : testStatus === 'error'
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white disabled:bg-gray-300"
                    )}
                  >
                    {testStatus === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : testStatus === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Напишите @userinfobot в Telegram чтобы узнать ваш Chat ID
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-500">Отчёты и сводки</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('emailEnabled', !settings.emailEnabled)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  settings.emailEnabled ? "bg-purple-500" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute w-5 h-5 bg-white rounded-full top-1 transition-all shadow-sm",
                  settings.emailEnabled ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </div>
          
          {settings.emailEnabled && (
            <div className="p-4">
              <label className="text-sm text-gray-600 block mb-1">Email адрес</label>
              <input
                type="email"
                value={settings.emailAddress}
                onChange={(e) => updateSetting('emailAddress', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Notification types */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="font-semibold mb-4">Типы уведомлений</h2>
          
          <div className="space-y-4">
            {/* Order updates */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Статусы заказов</p>
                  <p className="text-sm text-gray-500">Отслеживание доставки</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('orderUpdates', !settings.orderUpdates)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  settings.orderUpdates ? "bg-blue-500" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute w-5 h-5 bg-white rounded-full top-1 transition-all shadow-sm",
                  settings.orderUpdates ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            {/* Price alerts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Изменения цен</p>
                  <p className="text-sm text-gray-500">Когда цена падает/растёт</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('priceAlerts', !settings.priceAlerts)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  settings.priceAlerts ? "bg-green-500" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute w-5 h-5 bg-white rounded-full top-1 transition-all shadow-sm",
                  settings.priceAlerts ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            {/* Budget warnings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Бюджет</p>
                  <p className="text-sm text-gray-500">При превышении лимита</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('budgetWarnings', !settings.budgetWarnings)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  settings.budgetWarnings ? "bg-yellow-500" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute w-5 h-5 bg-white rounded-full top-1 transition-all shadow-sm",
                  settings.budgetWarnings ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex gap-3">
            <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Как подключить Telegram:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-600">
                <li>Найдите бота @ProcurementNotifyBot</li>
                <li>Напишите /start</li>
                <li>Скопируйте Chat ID</li>
                <li>Вставьте сюда и нажмите Тест</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
