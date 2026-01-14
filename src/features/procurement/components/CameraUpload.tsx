/**
 * CameraUpload - Компонент загрузки фото с камеры (Mobile First)
 */
import { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload, X, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface CameraUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  disabled?: boolean;
  className?: string;
}

export function CameraUpload({
  onFileSelect,
  isUploading = false,
  uploadProgress = 0,
  disabled = false,
  className,
}: CameraUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем что это изображение
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Создаём превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Скрытый input для файла */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Основная область */}
      {!preview ? (
        // Кнопка захвата фото
        <button
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
          className={cn(
            "w-full aspect-square max-w-sm",
            "flex flex-col items-center justify-center gap-4",
            "bg-gradient-to-br from-blue-500 to-blue-600",
            "hover:from-blue-600 hover:to-blue-700",
            "active:from-blue-700 active:to-blue-800",
            "text-white rounded-3xl shadow-lg",
            "transition-all duration-200",
            "min-h-[200px]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Camera className="h-20 w-20" />
          <span className="text-xl font-semibold">Сделать фото</span>
          <span className="text-sm opacity-80">или загрузить из галереи</span>
        </button>
      ) : (
        // Превью изображения
        <div className="relative w-full max-w-sm">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
          />
          
          {/* Кнопка сброса */}
          {!isUploading && (
            <button
              onClick={handleReset}
              className={cn(
                "absolute top-3 right-3",
                "p-2 rounded-full",
                "bg-black/50 hover:bg-black/70",
                "text-white transition-colors"
              )}
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Индикатор загрузки */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
              <div className="text-center text-white">
                <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mx-auto mb-3" />
                <span className="text-sm">Загрузка...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Прогресс-бар */}
      {isUploading && (
        <div className="w-full max-w-sm">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-center text-sm text-gray-500 mt-1">
            {uploadProgress}% загружено
          </p>
        </div>
      )}

      {/* Кнопки действий */}
      {preview && !isUploading && (
        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={handleReset}
            className={cn(
              "flex-1 py-4 px-6 rounded-xl",
              "bg-gray-100 hover:bg-gray-200",
              "text-gray-700 font-medium",
              "flex items-center justify-center gap-2",
              "transition-colors min-h-[56px]"
            )}
          >
            <RotateCcw className="h-5 w-5" />
            Переснять
          </button>
          <button
            onClick={handleUpload}
            className={cn(
              "flex-1 py-4 px-6 rounded-xl",
              "bg-green-500 hover:bg-green-600",
              "text-white font-medium",
              "flex items-center justify-center gap-2",
              "transition-colors min-h-[56px]"
            )}
          >
            <Upload className="h-5 w-5" />
            Загрузить
          </button>
        </div>
      )}

      {/* Альтернативная загрузка из галереи */}
      {!preview && (
        <button
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
          className={cn(
            "flex items-center gap-2 py-3 px-6",
            "text-blue-600 hover:text-blue-700",
            "font-medium transition-colors"
          )}
        >
          <ImageIcon className="h-5 w-5" />
          Выбрать из галереи
        </button>
      )}
    </div>
  );
}
