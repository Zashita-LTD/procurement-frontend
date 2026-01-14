/**
 * OrdersPreview - Предпросмотр и экспорт заказов
 */
import { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Send,
  Printer,
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportOrdersExcel, exportOrdersPdf } from '@/lib/sourcingApi';
import type { SourcingStrategy, SourcingOrder } from '@/types/sourcing';

interface OrdersPreviewProps {
  strategy: SourcingStrategy;
  stageName?: string;
}

export function OrdersPreview({ strategy, stageName }: OrdersPreviewProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(
    new Set([0]) // Первый заказ развёрнут по умолчанию
  );
  const [copiedOrder, setCopiedOrder] = useState<number | null>(null);
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);

  const toggleOrder = (index: number) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const copyOrderToClipboard = async (order: SourcingOrder, index: number) => {
    const text = formatOrderAsText(order);
    await navigator.clipboard.writeText(text);
    setCopiedOrder(index);
    setTimeout(() => setCopiedOrder(null), 2000);
  };

  const formatOrderAsText = (order: SourcingOrder): string => {
    const lines = [
      `Заказ для: ${order.supplier_name}`,
      `Этап: ${stageName || 'Не указан'}`,
      '',
      'Позиции:',
      ...order.items.map((item, i) => 
        `${i + 1}. ${item.product_name} - ${item.requested_quantity} ${item.unit} x ${item.price.toLocaleString('ru-RU')} ₽ = ${(item.price * item.requested_quantity).toLocaleString('ru-RU')} ₽`
      ),
      '',
      `Итого товары: ${order.subtotal.toLocaleString('ru-RU')} ₽`,
      `Доставка: ${order.delivery_cost.toLocaleString('ru-RU')} ₽`,
      `ВСЕГО: ${order.total.toLocaleString('ru-RU')} ₽`
    ];
    return lines.join('\n');
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    setExporting(format);
    try {
      const orderIds = strategy.orders.map((_, i) => `order-${i}`);
      const blob = format === 'excel' 
        ? await exportOrdersExcel(orderIds)
        : await exportOrdersPdf(orderIds);
      
      // Создаём ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${stageName || 'all'}-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Заказы для размещения
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('excel')}
            disabled={exporting !== null}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
              "bg-green-100 text-green-700 hover:bg-green-200 transition-colors",
              "disabled:opacity-50"
            )}
          >
            <FileSpreadsheet className="h-4 w-4" />
            {exporting === 'excel' ? 'Экспорт...' : 'Excel'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting !== null}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
              "bg-red-100 text-red-700 hover:bg-red-200 transition-colors",
              "disabled:opacity-50"
            )}
          >
            <FileText className="h-4 w-4" />
            {exporting === 'pdf' ? 'Экспорт...' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {strategy.orders.length}
            </div>
            <div className="text-sm text-gray-500">заказов</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {strategy.orders.reduce((sum, o) => sum + o.items.length, 0)}
            </div>
            <div className="text-sm text-gray-500">позиций</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {strategy.total_budget.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-sm text-gray-500">итого</div>
          </div>
        </div>
      </div>

      {/* Список заказов */}
      <div className="space-y-3">
        {strategy.orders.map((order, index) => (
          <div 
            key={index}
            className="border rounded-lg overflow-hidden bg-white"
          >
            {/* Заголовок заказа */}
            <button
              onClick={() => toggleOrder(index)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedOrders.has(index) ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
                <Building2 className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">{order.supplier_name}</div>
                  <div className="text-sm text-gray-500">
                    {order.items.length} позиций
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {order.total.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-xs text-gray-500">
                  вкл. доставку {order.delivery_cost.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </button>

            {/* Развёрнутое содержимое */}
            {expandedOrders.has(index) && (
              <div className="border-t">
                {/* Таблица позиций */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-gray-600">Товар</th>
                        <th className="text-right px-4 py-2 font-medium text-gray-600">Кол-во</th>
                        <th className="text-right px-4 py-2 font-medium text-gray-600">Цена</th>
                        <th className="text-right px-4 py-2 font-medium text-gray-600">Сумма</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {order.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="font-medium text-gray-900">{item.product_name}</div>
                            <div className="text-xs text-gray-500">
                              Запрошено: {item.requested_name}
                            </div>
                          </td>
                          <td className="text-right px-4 py-2 text-gray-600">
                            {item.requested_quantity} {item.unit}
                          </td>
                          <td className="text-right px-4 py-2 text-gray-600">
                            {item.price.toLocaleString('ru-RU')} ₽
                          </td>
                          <td className="text-right px-4 py-2 font-medium text-gray-900">
                            {(item.price * item.requested_quantity).toLocaleString('ru-RU')} ₽
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right text-gray-600">
                          Товары:
                        </td>
                        <td className="px-4 py-2 text-right text-gray-900">
                          {order.subtotal.toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right text-gray-600">
                          Доставка:
                        </td>
                        <td className="px-4 py-2 text-right text-gray-900">
                          {order.delivery_cost.toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                      <tr className="text-lg">
                        <td colSpan={3} className="px-4 py-2 text-right text-gray-900">
                          Итого:
                        </td>
                        <td className="px-4 py-2 text-right text-green-600 font-bold">
                          {order.total.toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Действия */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 border-t">
                  <button
                    onClick={() => copyOrderToClipboard(order, index)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                      "bg-white border hover:bg-gray-100 transition-colors",
                      copiedOrder === index && "bg-green-100 border-green-300"
                    )}
                  >
                    {copiedOrder === index ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Скопировано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-600">Копировать</span>
                      </>
                    )}
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white border hover:bg-gray-100 transition-colors"
                  >
                    <Printer className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Печать</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors ml-auto"
                  >
                    <Send className="h-4 w-4" />
                    <span>Отправить заявку</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
