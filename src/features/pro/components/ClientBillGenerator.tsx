import { useState } from 'react';
import { 
  FileText, 
  Send, 
  Download,
  Check,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

const mockPurchasedItems: BillItem[] = [
  { id: '1', name: 'Кабель ВВГнг 3x2.5', quantity: 100, price: 85, unit: 'м' },
  { id: '2', name: 'Розетка Schneider', quantity: 15, price: 350, unit: 'шт' },
  { id: '3', name: 'Автомат ABB 16A', quantity: 8, price: 890, unit: 'шт' },
  { id: '4', name: 'Подрозетник', quantity: 15, price: 45, unit: 'шт' },
  { id: '5', name: 'Гофра 20мм', quantity: 50, price: 25, unit: 'м' },
];

/**
 * ClientBillGenerator - генератор счетов для клиентов
 */
export function ClientBillGenerator() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [markup, setMarkup] = useState(15);
  const [billGenerated, setBillGenerated] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === mockPurchasedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mockPurchasedItems.map(i => i.id));
    }
  };

  const selectedTotal = mockPurchasedItems
    .filter(i => selectedItems.includes(i.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalWithMarkup = Math.round(selectedTotal * (1 + markup / 100));
  const yourProfit = totalWithMarkup - selectedTotal;

  const generateBill = () => {
    setBillGenerated(true);
    setShareLink(`https://bill.stroypro.ru/b/${Math.random().toString(36).substr(2, 8)}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Счёт клиенту 📄</h1>
        <p className="text-gray-400 text-sm mt-1">
          Выберите купленные товары и создайте счёт
        </p>
      </div>

      {!billGenerated ? (
        <>
          {/* Items List */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <button
                onClick={selectAll}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  selectedItems.length === mockPurchasedItems.length
                    ? 'bg-orange-500 border-orange-500'
                    : 'border-gray-600'
                }`}>
                  {selectedItems.length === mockPurchasedItems.length && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                Выбрать все
              </button>
              <span className="text-sm text-gray-400">
                Выбрано: {selectedItems.length}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-700">
              {mockPurchasedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                    selectedItems.includes(item.id) ? 'bg-gray-750' : 'hover:bg-gray-750'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                    selectedItems.includes(item.id)
                      ? 'bg-orange-500 border-orange-500'
                      : 'border-gray-600'
                  }`}>
                    {selectedItems.includes(item.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{item.name}</p>
                    <p className="text-gray-400 text-xs">
                      {item.quantity} {item.unit} × {item.price} ₽
                    </p>
                  </div>
                  <p className="text-white font-medium">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Markup */}
          <div className="bg-gray-800 rounded-xl p-4">
            <label className="block text-sm text-gray-400 mb-2">
              Ваша наценка (%)
            </label>
            <div className="flex items-center gap-3">
              {[10, 15, 20, 25, 30].map((m) => (
                <button
                  key={m}
                  onClick={() => setMarkup(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    markup === m
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {m}%
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedItems.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Закупочная стоимость</span>
                <span className="text-white">{selectedTotal.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Наценка {markup}%</span>
                <span className="text-green-400">+{yourProfit.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-700">
                <span className="text-white font-medium">Итого для клиента</span>
                <span className="text-xl font-bold text-white">
                  {totalWithMarkup.toLocaleString()} ₽
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <Button
            onClick={generateBill}
            disabled={selectedItems.length === 0}
            className="w-full py-6 bg-orange-500 hover:bg-orange-600"
          >
            <FileText className="h-5 w-5 mr-2" />
            Сформировать счёт
          </Button>
        </>
      ) : (
        /* Generated Bill */
        <div className="space-y-4">
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 text-center">
            <Check className="h-12 w-12 text-green-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white">Счёт готов!</h3>
            <p className="text-green-400 text-sm mt-1">
              Ваша прибыль: {yourProfit.toLocaleString()} ₽
            </p>
          </div>

          {/* Share Link */}
          <div className="bg-gray-800 rounded-xl p-4">
            <label className="block text-sm text-gray-400 mb-2">
              Ссылка для клиента
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white"
              />
              <Button onClick={copyLink} variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="py-4">
              <Download className="h-4 w-4 mr-2" />
              Скачать PDF
            </Button>
            <Button className="py-4 bg-orange-500 hover:bg-orange-600">
              <Send className="h-4 w-4 mr-2" />
              Отправить
            </Button>
          </div>

          <button
            onClick={() => {
              setBillGenerated(false);
              setSelectedItems([]);
            }}
            className="w-full text-center text-sm text-gray-400 hover:text-white py-2"
          >
            ← Создать новый счёт
          </button>
        </div>
      )}
    </div>
  );
}
