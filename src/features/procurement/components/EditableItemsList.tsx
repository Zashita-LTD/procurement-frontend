/**
 * EditableItemsList - Редактируемый список распознанных позиций
 */
import { useState } from 'react';
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RecognizedItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
}

interface EditableItemsListProps {
  items: RecognizedItem[];
  onChange: (items: RecognizedItem[]) => void;
  disabled?: boolean;
}

export function EditableItemsList({ items, onChange, disabled }: EditableItemsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');

  const startEdit = (item: RecognizedItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQty(String(item.quantity));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditQty('');
  };

  const saveEdit = (id: string) => {
    const updated = items.map(item => 
      item.id === id 
        ? { ...item, name: editName.trim(), quantity: parseFloat(editQty) || 0 }
        : item
    );
    onChange(updated);
    cancelEdit();
  };

  const deleteItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    const newItem: RecognizedItem = {
      id: `item-${Date.now()}`,
      name: 'Новая позиция',
      quantity: 1,
      unit: 'шт'
    };
    onChange([...items, newItem]);
    startEdit(newItem);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Список пуст</p>
        <button
          onClick={addItem}
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2",
            "bg-blue-500 hover:bg-blue-600 text-white",
            "rounded-lg font-medium transition-colors"
          )}
        >
          <Plus className="h-4 w-4" />
          Добавить позицию
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "bg-white rounded-xl border p-4",
            "shadow-sm transition-all",
            editingId === item.id && "ring-2 ring-blue-500"
          )}
        >
          {editingId === item.id ? (
            // Режим редактирования
            <div className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg",
                  "text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                placeholder="Название"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  className={cn(
                    "flex-1 px-3 py-2 border rounded-lg",
                    "text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                  placeholder="Кол-во"
                  min="0"
                  step="any"
                />
                <button
                  onClick={() => saveEdit(item.id)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            // Режим просмотра
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm w-6">{index + 1}.</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} {item.unit || 'шт'}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(item)}
                  disabled={disabled}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  disabled={disabled}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    "text-gray-500 hover:text-red-600 hover:bg-red-50"
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Кнопка добавления */}
      <button
        onClick={addItem}
        disabled={disabled}
        className={cn(
          "w-full py-3 border-2 border-dashed border-gray-300",
          "rounded-xl text-gray-500 font-medium",
          "hover:border-blue-400 hover:text-blue-600",
          "flex items-center justify-center gap-2",
          "transition-colors"
        )}
      >
        <Plus className="h-4 w-4" />
        Добавить позицию
      </button>
    </div>
  );
}
