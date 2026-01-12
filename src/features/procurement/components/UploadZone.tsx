import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUploadDocument } from '../api/useUploadDocument'

interface UploadZoneProps {
  projectId: string
  onUploadComplete?:  () => void
}

export function UploadZone({ projectId, onUploadComplete }: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const uploadMutation = useUploadDocument()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['. xlsx'],
      'application/vnd.ms-excel':  ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    for (const file of files) {
      await uploadMutation.mutateAsync({ projectId, file })
    }
    setFiles([])
    onUploadComplete?.()
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ?  'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm text-gray-600">
          {isDragActive
            ? 'Отпустите файлы здесь.. .'
            : 'Перетащите файлы сюда или нажмите для выбора'}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Поддерживаемые форматы: PDF, Excel, CSV (до 10MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Выбранные файлы:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <File className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm">{file.name}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation. isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Загрузить и обработать
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}