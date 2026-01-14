import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Camera, 
  FileText, 
  Table, 
  Mic, 
  X, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole } from '@/types/roles';

interface UploadedFile {
  id: string;
  file: File;
  type: 'image' | 'pdf' | 'excel' | 'voice' | 'other';
  status: 'uploading' | 'processing' | 'done' | 'error';
  result?: any;
  error?: string;
}

interface UniversalUploaderProps {
  onUpload?: (files: UploadedFile[]) => void;
  onResult?: (result: any) => void;
  accept?: string[];
  maxFiles?: number;
  className?: string;
}

// Тексты для разных ролей
const roleTexts: Record<UserRole, { title: string; description: string; hint: string }> = {
  private: {
    title: 'Загрузите смету',
    description: 'Мы проверим, не обманывают ли вас рабочие',
    hint: 'Перетащите файл сюда или нажмите для выбора',
  },
  pro: {
    title: 'Добавить документ',
    description: 'Загрузите накладную или счёт от поставщика',
    hint: 'Фото, PDF или Excel',
  },
  foreman: {
    title: 'Загрузить документ',
    description: 'Накладная, акт или смета',
    hint: 'Поддерживаются все форматы',
  },
  buyer: {
    title: 'Импорт данных',
    description: 'Загрузите спецификацию или прайс-лист',
    hint: 'Excel, PDF или изображение',
  },
  executive: {
    title: 'Загрузить отчёт',
    description: 'Импорт данных для анализа',
    hint: 'Excel или CSV файлы',
  },
};

// Иконки для типов файлов
const fileTypeIcons: Record<UploadedFile['type'], React.ReactNode> = {
  image: <ImageIcon className="h-5 w-5" />,
  pdf: <FileText className="h-5 w-5" />,
  excel: <Table className="h-5 w-5" />,
  voice: <Mic className="h-5 w-5" />,
  other: <FileText className="h-5 w-5" />,
};

function getFileType(file: File): UploadedFile['type'] {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const mime = file.type.toLowerCase();
  
  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
    return 'image';
  }
  if (mime === 'application/pdf' || ext === 'pdf') {
    return 'pdf';
  }
  if (mime.includes('spreadsheet') || mime.includes('excel') || ['xlsx', 'xls', 'csv'].includes(ext || '')) {
    return 'excel';
  }
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) {
    return 'voice';
  }
  return 'other';
}

export function UniversalUploader({
  onUpload,
  onResult,
  accept,
  maxFiles = 5,
  className = '',
}: UniversalUploaderProps) {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const role = user?.role || 'private';
  const texts = roleTexts[role];

  const processFile = async (uploadedFile: UploadedFile): Promise<UploadedFile> => {
    // Имитация обработки файла
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock результат в зависимости от роли
    let result: any = { success: true };
    
    if (role === 'private' && uploadedFile.type === 'pdf') {
      // Для частников - анализ сметы
      result = {
        type: 'quote_audit',
        warnings: [
          { item: 'Ротбанд 30кг', quantity: 50, expected: 15, message: 'Норма расхода превышена в 3 раза' },
        ],
        totalOvercharge: 45000,
        recommendation: 'Рекомендуем уточнить расчёт материалов',
      };
    } else if (role === 'buyer' && uploadedFile.type === 'excel') {
      // Для закупщиков - парсинг спецификации
      result = {
        type: 'specification',
        items: 156,
        categories: 12,
        estimatedTotal: 2450000,
      };
    }
    
    return { ...uploadedFile, status: 'done', result };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: getFileType(file),
      status: 'uploading' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    onUpload?.(newFiles);

    // Обрабатываем файлы
    for (const uploadedFile of newFiles) {
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id ? { ...f, status: 'processing' } : f
      ));

      try {
        const processed = await processFile(uploadedFile);
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? processed : f
        ));
        onResult?.(processed.result);
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'error', error: 'Ошибка обработки' } 
            : f
        ));
      }
    }
  }, [onUpload, onResult, role]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: accept ? { 'application/*': accept } : undefined,
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`
            p-4 rounded-full transition-colors
            ${isDragActive 
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
              : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
            }
          `}>
            <Upload className="h-8 w-8" />
          </div>
          
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {texts.title}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {texts.description}
            </p>
          </div>

          <p className="text-xs text-gray-400">
            {texts.hint}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Camera className="h-3.5 w-3.5" />
            Камера
          </button>
          <button
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              setIsRecording(!isRecording);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg ${
              isRecording 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            {isRecording ? 'Запись...' : 'Голос'}
          </button>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              {/* Icon */}
              <div className={`
                p-2 rounded-lg
                ${file.status === 'error' 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : file.status === 'done'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                }
              `}>
                {fileTypeIcons[file.type]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {file.status === 'uploading' && 'Загрузка...'}
                  {file.status === 'processing' && 'Обработка...'}
                  {file.status === 'done' && 'Готово'}
                  {file.status === 'error' && file.error}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {(file.status === 'uploading' || file.status === 'processing') && (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                )}
                {file.status === 'done' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
