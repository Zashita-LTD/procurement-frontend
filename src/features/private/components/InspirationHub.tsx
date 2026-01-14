import { useState } from 'react';
import { Heart, ShoppingCart, Check, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MaterialKit {
  id: string;
  title: string;
  description: string;
  category: 'electric' | 'plumbing' | 'walls' | 'floor' | 'full';
  roomType: string;
  items: number;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  popular: boolean;
}

const kits: MaterialKit[] = [
  {
    id: '1',
    title: 'Черновая электрика для однушки',
    description: 'Полный комплект для разводки электрики: кабели, автоматы, розетки',
    category: 'electric',
    roomType: '1room',
    items: 47,
    price: 28500,
    originalPrice: 35000,
    rating: 4.8,
    reviews: 156,
    image: '⚡',
    tags: ['Популярное', 'Экономия 18%'],
    popular: true,
  },
  {
    id: '2',
    title: 'Сантехника для ванной 4м²',
    description: 'Трубы, фитинги, смесители и подводка для типовой ванной',
    category: 'plumbing',
    roomType: 'bathroom',
    items: 32,
    price: 18900,
    originalPrice: 23000,
    rating: 4.6,
    reviews: 89,
    image: '🚿',
    tags: ['Быстрая доставка'],
    popular: false,
  },
  {
    id: '3',
    title: 'Выравнивание стен (студия)',
    description: 'Ротбанд, грунтовка, сетка, маяки — на 50м² стен',
    category: 'walls',
    roomType: 'studio',
    items: 15,
    price: 12400,
    originalPrice: 15000,
    rating: 4.9,
    reviews: 234,
    image: '🧱',
    tags: ['Хит продаж'],
    popular: true,
  },
  {
    id: '4',
    title: 'Ламинат + подложка (двушка)',
    description: 'Ламинат 32 класса с подложкой на 60м²',
    category: 'floor',
    roomType: '2room',
    items: 8,
    price: 45000,
    originalPrice: 52000,
    rating: 4.7,
    reviews: 178,
    image: '🪵',
    tags: ['Гарантия 10 лет'],
    popular: false,
  },
  {
    id: '5',
    title: 'Полный набор на кухню',
    description: 'Плитка, затирка, клей, профиль — на кухню до 10м²',
    category: 'full',
    roomType: 'kitchen',
    items: 24,
    price: 19500,
    originalPrice: 24000,
    rating: 4.5,
    reviews: 67,
    image: '🍳',
    tags: ['Новинка'],
    popular: false,
  },
];

const categories = [
  { id: 'all', label: 'Все наборы', icon: Sparkles },
  { id: 'electric', label: 'Электрика', icon: Zap },
  { id: 'plumbing', label: 'Сантехника', icon: null },
  { id: 'walls', label: 'Стены', icon: null },
  { id: 'floor', label: 'Пол', icon: null },
];

/**
 * InspirationHub - готовые наборы материалов
 * "Черновая электрика для однушки"
 */
export function InspirationHub() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  const filteredKits = selectedCategory === 'all' 
    ? kits 
    : kits.filter(k => k.category === selectedCategory);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addToCart = (id: string) => {
    if (!cart.includes(id)) {
      setCart(prev => [...prev, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Готовые наборы 💡</h1>
        <p className="text-gray-500 mt-1">
          Проверенные комплекты материалов для вашего ремонта
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {cat.icon && <cat.icon className="h-4 w-4" />}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Kits Grid */}
      <div className="space-y-4">
        {filteredKits.map((kit) => (
          <div
            key={kit.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="p-4 pb-0">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{kit.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        {kit.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {kit.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(kit.id)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.includes(kit.id)
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Heart 
                        className="h-5 w-5" 
                        fill={favorites.includes(kit.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-3">
                {kit.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${tag.includes('Экономия') || tag.includes('Хит')
                        ? 'bg-green-100 text-green-700'
                        : tag.includes('Популярное')
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 flex items-center justify-between border-t border-gray-100 mt-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {kit.price.toLocaleString()} ₽
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {kit.originalPrice.toLocaleString()} ₽
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <span>★ {kit.rating}</span>
                  <span>•</span>
                  <span>{kit.reviews} отзывов</span>
                  <span>•</span>
                  <span>{kit.items} товаров</span>
                </div>
              </div>
              
              <Button
                onClick={() => addToCart(kit.id)}
                disabled={cart.includes(kit.id)}
                className={cart.includes(kit.id) ? 'bg-green-600' : ''}
              >
                {cart.includes(kit.id) ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    В корзине
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    В корзину
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
          <Shield className="h-6 w-6 text-blue-600 mb-2" />
          <span className="text-xs text-gray-600">Гарантия<br/>качества</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
          <Zap className="h-6 w-6 text-blue-600 mb-2" />
          <span className="text-xs text-gray-600">Доставка<br/>за 1 день</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
          <Sparkles className="h-6 w-6 text-blue-600 mb-2" />
          <span className="text-xs text-gray-600">Проверенные<br/>бренды</span>
        </div>
      </div>
    </div>
  );
}
