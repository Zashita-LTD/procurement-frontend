import { useState } from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, FileText, Loader2 } from 'lucide-react';
import { UniversalUploader } from '@/components/shared/UniversalUploader';
import { Button } from '@/components/ui/button';
import { quoteAuditMocks } from '@/lib/mocks';

interface AuditWarning {
  item: string;
  quantity: number;
  expected: number;
  message: string;
  overcharge: number;
}

interface AuditResult {
  status: 'clean' | 'warning' | 'danger';
  warnings: AuditWarning[];
  totalOvercharge: number;
  savings: number;
  recommendation: string;
}

/**
 * QuoteAuditor - проверка смет от рабочих
 * Загрузка сметы -> AI анализ ("Вас обманывают?")
 */
export function QuoteAuditor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleResult = async (uploadResult: any) => {
    if (uploadResult?.type === 'quote_audit') {
      setIsAnalyzing(true);
      
      // Имитация анализа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Используем первый результат из mock данных
      const mockData = quoteAuditMocks.results[0];
      const mockResult: AuditResult = {
        status: mockData.status,
        warnings: mockData.warnings,
        totalOvercharge: mockData.totalOvercharge,
        savings: mockData.savings,
        recommendation: mockData.recommendation
      };
      setResult(mockResult);
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: AuditResult['status']) => {
    switch (status) {
      case 'clean': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'danger': return 'text-red-600 bg-red-50';
    }
  };

  const getStatusIcon = (status: AuditResult['status']) => {
    switch (status) {
      case 'clean': return <CheckCircle2 className="h-8 w-8" />;
      case 'warning': return <AlertTriangle className="h-8 w-8" />;
      case 'danger': return <AlertTriangle className="h-8 w-8" />;
    }
  };

  const getStatusText = (status: AuditResult['status']) => {
    switch (status) {
      case 'clean': return 'Смета в норме';
      case 'warning': return 'Есть завышения';
      case 'danger': return 'Серьёзные нарушения';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Проверить смету 🔍</h1>
        <p className="text-gray-500 mt-1">
          Загрузите смету от рабочих — мы проверим, не обманывают ли вас
        </p>
      </div>

      {/* Uploader */}
      {!result && (
        <UniversalUploader
          onResult={handleResult}
          accept={['.pdf', '.xlsx', '.xls', '.jpg', '.jpeg', '.png']}
          maxFiles={1}
        />
      )}

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-12 bg-blue-50 rounded-2xl">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Анализируем смету...</h3>
          <p className="text-sm text-gray-500 mt-1">Проверяем расход материалов</p>
        </div>
      )}

      {/* Result */}
      {result && !isAnalyzing && (
        <div className="space-y-6">
          {/* Status Card */}
          <div className={`p-6 rounded-2xl ${getStatusColor(result.status)}`}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {getStatusIcon(result.status)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{getStatusText(result.status)}</h2>
                <p className="mt-1 opacity-80">{result.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Завышение</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {result.totalOvercharge.toLocaleString()} ₽
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Экономия</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {result.savings.toLocaleString()} ₽
              </p>
            </div>
          </div>

          {/* Warnings List */}
          {result.warnings.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Найденные проблемы ({result.warnings.length})
              </h3>
              
              {result.warnings.map((warning, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-orange-50 border border-orange-200 rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{warning.item}</h4>
                      <p className="text-sm text-orange-700 mt-1">{warning.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {warning.quantity} шт. вместо {warning.expected}
                      </p>
                      <p className="font-semibold text-red-600">
                        +{warning.overcharge.toLocaleString()} ₽
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setResult(null)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Загрузить другую
            </Button>
            <Button className="flex-1">
              Получить честную смету
            </Button>
          </div>
        </div>
      )}

      {/* Demo Button (for testing) */}
      {!result && !isAnalyzing && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setIsAnalyzing(true);
              setTimeout(() => {
                const mockData = quoteAuditMocks.results[0];
                const demoResult: AuditResult = {
                  status: mockData.status,
                  warnings: mockData.warnings,
                  totalOvercharge: mockData.totalOvercharge,
                  savings: mockData.savings,
                  recommendation: mockData.recommendation
                };
                setResult(demoResult);
                setIsAnalyzing(false);
              }, 2000);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            🧪 Демо: показать пример анализа
          </button>
        </div>
      )}
    </div>
  );
}
