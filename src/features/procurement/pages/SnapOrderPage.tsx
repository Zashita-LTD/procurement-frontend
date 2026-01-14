/**
 * SnapOrderPage - Страница быстрого заказа по фото (Mobile First)
 * С голосовым вводом, сжатием изображений и сохранением черновиков
 */
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ArrowLeft, 
  Mic,
  MicOff,
  AlertCircle,
  Loader2,
  Save,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CameraUpload } from '../components/CameraUpload';
import { EditableItemsList, RecognizedItem } from '../components/EditableItemsList';
import { brainApi } from '@/lib/axios';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { compressImage, formatFileSize } from '@/utils/imageCompression';

type Step = 'photo' | 'recognizing' | 'edit' | 'searching';

const DRAFT_KEY = 'snap_order_draft';

// Загрузка черновика из localStorage
function loadDraft(): { items: RecognizedItem[]; comment: string } | null {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const draft = JSON.parse(saved);
      if (draft.items?.length > 0) return draft;
    }
  } catch {}
  return null;
}

// Сохранение черновика
function saveDraft(items: RecognizedItem[], comment: string) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ items, comment, savedAt: Date.now() }));
  } catch {}
}

// Удаление черновика
function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export function SnapOrderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('photo');
  const [items, setItems] = useState<RecognizedItem[]>([]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  // Голосовой ввод
  const { isListening, isSupported: voiceSupported, toggleListening, transcript } = useVoiceInput({
    onResult: (text) => {
      // Парсинг голосовой команды: "цемент 10 мешков"
      const match = text.match(/^(.+?)\s+(\d+)\s*(.*)$/i);
      if (match) {
        const newItem: RecognizedItem = {
          id: Date.now().toString(),
          name: match[1].trim(),
          quantity: parseInt(match[2], 10),
          unit: match[3].trim() || 'шт',
        };
        setItems(prev => [...prev, newItem]);
      } else {
        // Просто добавить как название
        setItems(prev => [...prev, {
          id: Date.now().toString(),
          name: text.trim(),
          quantity: 1,
          unit: 'шт',
        }]);
      }
    },
    onError: (err) => setError(err),
  });

  // Загрузка черновика при старте
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setHasDraft(true);
    }
  }, []);

  // Автосохранение черновика
  useEffect(() => {
    if (items.length > 0) {
      saveDraft(items, comment);
    }
  }, [items, comment]);

  // Восстановление черновика
  const handleRestoreDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setItems(draft.items);
      setComment(draft.comment || '');
      setStep('edit');
      setHasDraft(false);
    }
  };

  // Обработка загрузки фото с сжатием
  const handleFileSelect = useCallback(async (file: File) => {
    setStep('recognizing');
    setError(null);
    setUploadProgress(0);
    setCompressionInfo(null);

    try {
      // Сжимаем изображение
      const originalSize = file.size;
      const compressed = await compressImage(file, 1920, 1080, 0.8);
      const compressedSize = compressed.size;
      
      if (compressedSize < originalSize) {
        setCompressionInfo(
          `Сжато: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)}`
        );
      }

      // Прогресс
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Отправка на распознавание
      const formData = new FormData();
      formData.append('file', compressed, file.name);
      
      const response = await brainApi.post('/documents/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data?.items?.length > 0) {
        const recognized: RecognizedItem[] = response.data.items.map(
          (item: any, idx: number) => ({
            id: `${Date.now()}-${idx}`,
            name: item.name,
            quantity: Number(item.quantity) || 1,
            unit: item.unit || 'шт',
          })
        );
        setItems(recognized);
        clearDraft(); // Очищаем старый черновик
        setStep('edit');
      } else {
        setError('Не удалось распознать материалы. Попробуйте другое фото.');
        setStep('photo');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка распознавания');
      setStep('photo');
    }
  }, []);

  // Поиск поставщиков
  const handleSearch = useCallback(() => {
    if (items.length === 0) return;
    
    setStep('searching');
    clearDraft(); // Очищаем черновик после отправки
    
    // Формируем query string
    const searchQuery = items.map(i => `${i.name} ${i.quantity} ${i.unit}`).join(', ');
    
    setTimeout(() => {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
    }, 1000);
  }, [items, navigate]);

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
            <h1 className="text-lg font-semibold">Заказ по фото</h1>
            <p className="text-sm text-gray-500">
              {step === 'photo' && 'Сфотографируйте смету'}
              {step === 'recognizing' && 'Распознаём...'}
              {step === 'edit' && `${items.length} позиций`}
              {step === 'searching' && 'Ищем поставщиков...'}
            </p>
          </div>
          {step === 'edit' && voiceSupported && (
            <button
              onClick={toggleListening}
              className={cn(
                "p-3 rounded-full transition-all",
                isListening 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              )}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
        </div>
        
        {/* Voice transcript */}
        {isListening && transcript && (
          <div className="px-4 pb-2">
            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
              🎤 {transcript}
            </div>
          </div>
        )}
      </div>

      {/* Draft restore banner */}
      {hasDraft && step === 'photo' && (
        <div className="mx-4 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-yellow-800">Есть незавершённый заказ</p>
              <p className="text-sm text-yellow-600">Восстановить черновик?</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { clearDraft(); setHasDraft(false); }}
                className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleRestoreDraft}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium"
              >
                Восстановить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-sm text-red-600 underline mt-1"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="p-4">
        {/* Step: Photo */}
        {step === 'photo' && (
          <CameraUpload onFileSelect={handleFileSelect} />
        )}

        {/* Step: Recognizing */}
        {step === 'recognizing' && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Распознаём материалы</h2>
            <p className="text-gray-500 mb-4">Gemini AI анализирует фото...</p>
            
            {/* Progress bar */}
            <div className="max-w-xs mx-auto">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">{uploadProgress}%</p>
            </div>
            
            {/* Compression info */}
            {compressionInfo && (
              <p className="text-xs text-green-600 mt-4">{compressionInfo}</p>
            )}
          </div>
        )}

        {/* Step: Edit */}
        {step === 'edit' && (
          <div className="space-y-4">
            {/* Voice hint */}
            {voiceSupported && (
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                💡 Нажмите 🎤 и скажите: "Цемент 10 мешков"
              </div>
            )}

            <EditableItemsList 
              items={items} 
              onChange={setItems} 
            />

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Комментарий к заказу
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Например: нужна доставка на объект..."
                className="w-full p-3 border border-gray-300 rounded-xl resize-none h-20"
              />
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Save className="w-3 h-3" />
              <span>Черновик сохранён автоматически</span>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              disabled={items.length === 0}
              className={cn(
                "w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3",
                items.length > 0
                  ? "bg-green-500 text-white active:bg-green-600"
                  : "bg-gray-200 text-gray-400"
              )}
            >
              <Search className="w-6 h-6" />
              Найти поставщиков
            </button>
          </div>
        )}

        {/* Step: Searching */}
        {step === 'searching' && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Ищем поставщиков</h2>
            <p className="text-gray-500">Подбираем лучшие цены...</p>
          </div>
        )}
      </div>
    </div>
  );
}
