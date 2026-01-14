import { useState } from 'react';
import { CreditCard, Plus, Barcode, QrCode, ChevronRight, Star } from 'lucide-react';

interface LoyaltyCard {
  id: string;
  store: string;
  cardNumber: string;
  balance?: number;
  discount?: number;
  level?: string;
  color: string;
  logo: string;
}

const mockCards: LoyaltyCard[] = [
  {
    id: '1',
    store: 'Петрович',
    cardNumber: '4276 **** **** 1234',
    balance: 12500,
    discount: 7,
    level: 'Золотой',
    color: 'from-yellow-500 to-orange-600',
    logo: '🏪',
  },
  {
    id: '2',
    store: 'Леруа Мерлен',
    cardNumber: '5521 **** **** 5678',
    discount: 5,
    level: 'Про',
    color: 'from-green-500 to-emerald-600',
    logo: '🏠',
  },
  {
    id: '3',
    store: 'ОБИ',
    cardNumber: '4012 **** **** 9012',
    balance: 3200,
    color: 'from-orange-500 to-red-600',
    logo: '🔧',
  },
  {
    id: '4',
    store: 'СтройМастер',
    cardNumber: '6011 **** **** 3456',
    discount: 10,
    color: 'from-blue-500 to-indigo-600',
    logo: '🛠',
  },
];

/**
 * LoyaltyWallet - кошелёк карт лояльности
 */
export function LoyaltyWallet() {
  const [selectedCard, setSelectedCard] = useState<LoyaltyCard | null>(null);
  const [showBarcode, setShowBarcode] = useState(false);

  const totalBalance = mockCards.reduce((sum, card) => sum + (card.balance || 0), 0);

  if (selectedCard) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => { setSelectedCard(null); setShowBarcode(false); }}
          className="text-gray-400 hover:text-white flex items-center gap-1"
        >
          ← Назад
        </button>

        {/* Card Detail */}
        <div className={`bg-gradient-to-br ${selectedCard.color} rounded-2xl p-6 text-white`}>
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-4xl">{selectedCard.logo}</span>
              <h2 className="text-xl font-bold mt-2">{selectedCard.store}</h2>
              {selectedCard.level && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm opacity-90">{selectedCard.level}</span>
                </div>
              )}
            </div>
            <CreditCard className="h-8 w-8 opacity-50" />
          </div>

          <p className="text-2xl font-mono tracking-wider">
            {selectedCard.cardNumber}
          </p>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
            {selectedCard.balance !== undefined && (
              <div>
                <p className="text-sm opacity-75">Баланс бонусов</p>
                <p className="text-xl font-bold">{selectedCard.balance.toLocaleString()} ₽</p>
              </div>
            )}
            {selectedCard.discount !== undefined && (
              <div className="text-right">
                <p className="text-sm opacity-75">Скидка</p>
                <p className="text-xl font-bold">{selectedCard.discount}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Barcode */}
        <button
          onClick={() => setShowBarcode(!showBarcode)}
          className="w-full bg-gray-800 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Barcode className="h-6 w-6 text-orange-400" />
            <span className="text-white font-medium">Показать штрих-код</span>
          </div>
          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${showBarcode ? 'rotate-90' : ''}`} />
        </button>

        {showBarcode && (
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="h-20 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px)] mb-3" />
            <p className="text-gray-900 font-mono text-sm">
              {selectedCard.cardNumber.replace(/\s/g, '')}
            </p>
          </div>
        )}

        {/* QR Code */}
        <button className="w-full bg-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QrCode className="h-6 w-6 text-orange-400" />
            <span className="text-white font-medium">QR-код</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Мои карты 💳</h1>
        <p className="text-gray-400 text-sm mt-1">
          Карты лояльности строительных магазинов
        </p>
      </div>

      {/* Total Balance */}
      <div className="bg-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-sm">Всего бонусов</p>
        <p className="text-3xl font-bold text-green-400 mt-1">
          {totalBalance.toLocaleString()} ₽
        </p>
      </div>

      {/* Cards Grid */}
      <div className="space-y-3">
        {mockCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className={`w-full bg-gradient-to-br ${card.color} rounded-xl p-4 text-white text-left`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{card.logo}</span>
                <div>
                  <h3 className="font-semibold">{card.store}</h3>
                  <p className="text-sm opacity-75 font-mono">
                    {card.cardNumber}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {card.balance !== undefined && (
                  <p className="font-bold">{card.balance.toLocaleString()} ₽</p>
                )}
                {card.discount !== undefined && (
                  <p className="text-sm opacity-75">−{card.discount}%</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Add Card */}
      <button className="w-full border-2 border-dashed border-gray-700 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
        <Plus className="h-5 w-5" />
        Добавить карту
      </button>
    </div>
  );
}
