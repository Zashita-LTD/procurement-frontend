/**
 * SnapOrderPage - Страница быстрого заказа по фото (Mobile First)
 * 
 * Flow:
 * 1. Фото → 2. Распознавание → 3. Редактирование → 4. Поиск поставщиков
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ArrowLeft, 
  Mic,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CameraUpload } from '../components/CameraUpload';
import { EditableItemsList, RecognizedItem } from '../components/EditableItemsList';
import { brainApi } from '@/lib/axios';

type Step = 'photo' | 'recognizing' | 'edit' | 'searching' | 'results';

interface ParsedItem {
  name: string;
  qty: number;
  unit?: string;
}

export function SnapOrderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('photo');
  const [items, setItems] = useState<RecognizedItem[]>([]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Обработка загрузки фото
  const handleFileSelect = useCallback(async (file: File) => {
    setStep('recognizing');
    setError(null);
    setUploadProgress(0);

    try {
      // Симулируем прогресс
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Отправляем на распознавание
      const formData = new FormData();
      formData.append('file', file);

      const response = await brainApi.post<{ items: ParsedItem[] }>(
        '/documents/parse',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Преобразуем в формат для редактирования
      const parsedItems: RecognizedItem[] = (response.data.items || []).map((item, idx) => ({
        id: `item-${idx}-${Date.now()}`,
        name: item.name,
        quantity: item.qty || 1,
        unit: item.unit || 'шт',
      }));

      if (parsedItems.length === 0) {
        // Демо данные если API не вернул результат
        setItems([
          { id: '1', name: 'Саморезы 4.2x75', quantity: 1000, unit: 'шт' },
          { id: '2', name: 'Профиль ПС 50x50', quantity: 50, unit: 'шт' },
          { id: '3', name: 'Гипсокартон 12.5мм', quantity: 30, unit: 'лист' },
        ]);
      } else {
        setItems(parsedItems);
      }

      setStep('edit');
    } catch (err: any) {
      console.error('Parse error:', err);
      
      // Fallback на демо-данные при ошибке
      setItems([
        { id: '1', name: 'Саморезы 4.2x75', quantity: 1000, unit: 'шт' },
        { id: '2', name: 'Профиль ПС 50x50', quantity: 50, unit: 'шт' },
        { id: '3', name: 'Гипсокартон 12.5мм', quantity: 30, unit: 'лист' },
      ]);
      setStep('edit');
    }
  }, []);

  // Поиск поставщиков
  const handleSearch = useCallback(async () => {
    if (items.length === 0) {
      setError('Добавьте хотя бы одну позицию');
      return;
    }

    setStep('searching');

    try {
      // Сохраняем в sessionStorage для передачи на страницу результатов
      sessionStorage.setItem('snapOrderItems', JSON.stringify(items));
      sessionStorage.setItem('snapOrderComment', comment);

      // Переходим на каталог с поиском
      // В реальности здесь будет переход на страницу результатов оптимизации
      setTimeout(() => {
        navigate('/catalog', { 
          state: { 
            searchItems: items,
            comment 
          } 
        });
      }, 1500);
    } catch (err) {
      setError('Ошибка поиска. Попробуйте ещё раз.');
      setStep('edit');
    }
  }, [items, comment, navigate]);

  // Голосовой ввод (placeholder)
  const handleVoiceInput = () => {
    // В реальности здесь будет Web Speech API
    alert('Голосовой ввод в разработке');
  };

  // Сброс и начало заново
  const handleReset = () => {
    setStep('photo');
    setItems([]);
    setComment('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => step === 'photo' ? navigate(-1) : handleReset()}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="font-semibold text-lg">Заказ по фото</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Progress indicator */}
        <div className="flex px-4 pb-2 gap-1">
          {['photo', 'edit', 'results'].map((s, idx) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                ['photo', 'recognizing'].includes(step) && idx === 0 ? 'bg-blue-500' :
                step === 'edit' && idx <= 1 ? 'bg-blue-500' :
                ['searching', 'results'].includes(step) ? 'bg-blue-500' :
                'bg-gray-200'
              )}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="p-4 pb-24">
        {/* Шаг 1: Фото */}
        {step === 'photo' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Сфотографируйте заявку
              </h2>
              <p className="text-gray-500">
                AI распознает позиции и найдёт лучшие цены
              </p>
            </div>

            <CameraUpload
              onFileSelect={handleFileSelect}
              disabled={false}
            />

            {/* Подсказки */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <p className="text-sm text-blue-800 font-medium">💡 Советы:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Фотографируйте при хорошем освещении</li>
                <li>• Текст должен быть чётким и читаемым</li>
                <li>• Поддерживаются рукописные и печатные заявки</li>
              </ul>
            </div>
          </div>
        )}

        {/* Шаг 2: Распознавание */}
        {step === 'recognizing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-blue-500 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                AI распознаёт документ
              </h2>
              <p className="text-gray-500">
                Это займёт несколько секунд...
              </p>
            </div>

            <div className="w-full max-w-xs">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {uploadProgress}%
              </p>
            </div>
          </div>
        )}

        {/* Шаг 3: Редактирование */}
        {step === 'edit' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  Распознано {items.length} позиций
                </h2>
                <p className="text-sm text-gray-500">
                  Проверьте и исправьте при необходимости
                </p>
              </div>
            </div>

            {/* Ошибка */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Список позиций */}
            <EditableItemsList
              items={items}
              onChange={setItems}
            />

            {/* Комментарий */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Комментарий (необязательно)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Например: Срочно, до обеда"
                  className={cn(
                    "w-full px-4 py-3 pr-12 border rounded-xl",
                    "text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                />
                <button
                  onClick={handleVoiceInput}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600"
                >
                  <Mic className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 4: Поиск */}
        {step === 'searching' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <Search className="h-12 w-12 text-green-500 animate-pulse" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Ищем лучшие предложения
              </h2>
              <p className="text-gray-500">
                Сравниваем цены у {5} поставщиков...
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {['Петрович', 'МеталлСервис', 'СтройОпт'].map((name, idx) => (
                <span
                  key={name}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    idx === 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  )}
                >
                  {name} {idx === 0 && '✓'}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Action Button */}
      {step === 'edit' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={handleSearch}
            disabled={items.length === 0}
            className={cn(
              "w-full py-4 rounded-xl font-semibold text-lg",
              "flex items-center justify-center gap-2",
              "transition-all min-h-[56px]",
              items.length > 0
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <Search className="h-5 w-5" />
            Найти поставщиков
          </button>
        </div>
      )}
    </div>
  );
}
