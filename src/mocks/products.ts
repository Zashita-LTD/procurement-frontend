/**
 * Карточки товаров - полный каталог продукции.
 * Реалистичные товары строительных материалов и оборудования.
 */

import type { ProductCard, Category } from '../types/extended';

// === КАТЕГОРИИ ===

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Гипсокартон и комплектующие', slug: 'gypsum', icon: '🏗️', parent_id: null, products_count: 45 },
  { id: 'cat-2', name: 'Сухие смеси', slug: 'dry-mixes', icon: '📦', parent_id: null, products_count: 78 },
  { id: 'cat-3', name: 'Электрика', slug: 'electrical', icon: '⚡', parent_id: null, products_count: 234 },
  { id: 'cat-4', name: 'Сантехника', slug: 'plumbing', icon: '🚿', parent_id: null, products_count: 156 },
  { id: 'cat-5', name: 'Теплоизоляция', slug: 'insulation', icon: '🧱', parent_id: null, products_count: 67 },
  { id: 'cat-6', name: 'Кровельные материалы', slug: 'roofing', icon: '🏠', parent_id: null, products_count: 89 },
  { id: 'cat-7', name: 'Инструменты', slug: 'tools', icon: '🔧', parent_id: null, products_count: 312 },
  { id: 'cat-8', name: 'Краски и лаки', slug: 'paints', icon: '🎨', parent_id: null, products_count: 178 },
];

// === ПРОДУКТЫ ===

export const PRODUCTS: ProductCard[] = [
  // === ГИПСОКАРТОН KNAUF ===
  {
    id: 'prod-1001',
    sku: 'KNAUF-GKL-1250-12',
    name: 'Гипсокартонный лист KNAUF 1250x2500x12.5мм',
    short_description: 'Стандартный гипсокартонный лист для внутренней отделки',
    description: `
      Гипсокартонный лист KNAUF — это строительно-отделочный материал, состоящий из гипсового сердечника и облицовочного картона.
      
      **Применение:**
      - Облицовка стен
      - Устройство межкомнатных перегородок
      - Облицовка потолков
      - Создание декоративных элементов
      
      **Преимущества:**
      - Экологически чистый материал
      - Легкий в обработке
      - Создает идеально ровную поверхность
      - Регулирует влажность в помещении
    `,
    
    manufacturer_id: 'company-1001-knauf',
    manufacturer_name: 'KNAUF',
    brand: 'KNAUF',
    
    category_id: 'cat-1',
    category_name: 'Гипсокартон и комплектующие',
    
    price: 450,
    price_currency: 'RUB',
    price_unit: 'за лист',
    old_price: 520,
    discount_percent: 13,
    
    in_stock: true,
    stock_quantity: 15000,
    min_order_quantity: 50,
    
    images: [
      { url: '/images/products/knauf-gkl-main.jpg', alt: 'KNAUF GKL 12.5мм', is_primary: true },
      { url: '/images/products/knauf-gkl-stack.jpg', alt: 'Штабель гипсокартона', is_primary: false },
    ],
    
    specifications: {
      'Размер, мм': '1250 x 2500 x 12.5',
      'Вес листа, кг': '26',
      'Площадь листа, м²': '3.125',
      'Тип кромки': 'УК (утоненная)',
      'Цвет картона': 'серый',
      'Группа горючести': 'Г1',
      'Предел прочности при изгибе, Н': '450',
      'Водопоглощение, %': 'не более 30'
    },
    
    tags: ['гипсокартон', 'knauf', 'отделка', 'стены', 'потолок'],
    
    rating: 4.8,
    reviews_count: 1247,
    orders_count: 45678,
    
    delivery_info: 'Доставка от 1 дня. Бесплатно от 50 000 ₽',
    warranty_info: 'Гарантия производителя 12 месяцев',
    
    related_products: ['prod-1002', 'prod-1003', 'prod-2001'],
    
    seo_title: 'Гипсокартон KNAUF 12.5мм купить по лучшей цене',
    seo_description: 'Гипсокартонный лист KNAUF 1250x2500x12.5мм. Официальный дилер. Доставка по России.',
    
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2026-01-10T14:30:00Z'
  },
  {
    id: 'prod-1002',
    sku: 'KNAUF-GKLV-1250-12',
    name: 'Гипсокартонный лист влагостойкий KNAUF 1250x2500x12.5мм',
    short_description: 'Влагостойкий гипсокартон для влажных помещений',
    description: `
      Влагостойкий гипсокартонный лист KNAUF (ГКЛВ) предназначен для применения в помещениях с повышенной влажностью.
      
      **Применение:**
      - Ванные комнаты
      - Санузлы
      - Кухни
      - Подсобные помещения
      
      **Особенности:**
      - Гидрофобизированный гипсовый сердечник
      - Пониженное водопоглощение
      - Зеленый цвет картона для идентификации
    `,
    
    manufacturer_id: 'company-1001-knauf',
    manufacturer_name: 'KNAUF',
    brand: 'KNAUF',
    
    category_id: 'cat-1',
    category_name: 'Гипсокартон и комплектующие',
    
    price: 580,
    price_currency: 'RUB',
    price_unit: 'за лист',
    
    in_stock: true,
    stock_quantity: 8500,
    min_order_quantity: 50,
    
    images: [
      { url: '/images/products/knauf-gklv-main.jpg', alt: 'KNAUF GKLV 12.5мм', is_primary: true },
    ],
    
    specifications: {
      'Размер, мм': '1250 x 2500 x 12.5',
      'Вес листа, кг': '27.5',
      'Площадь листа, м²': '3.125',
      'Водопоглощение, %': 'не более 10',
      'Цвет картона': 'зеленый',
    },
    
    tags: ['гипсокартон', 'knauf', 'влагостойкий', 'ванная', 'санузел'],
    
    rating: 4.9,
    reviews_count: 876,
    orders_count: 28934,
    
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2026-01-08T11:20:00Z'
  },
  
  // === СУХИЕ СМЕСИ ===
  {
    id: 'prod-2001',
    sku: 'KNAUF-ROTBAND-30',
    name: 'Штукатурка гипсовая KNAUF Rotband 30кг',
    short_description: 'Универсальная гипсовая штукатурка для ручного нанесения',
    description: `
      KNAUF Rotband — универсальная сухая штукатурная смесь на основе гипса с полимерными добавками.
      
      **Применение:**
      - Высококачественное оштукатуривание стен и потолков
      - Бетон, кирпич, ЦСП
      - Для внутренних работ
      
      **Преимущества:**
      - Не требует шпаклевания при качественном нанесении
      - Высокая пластичность
      - Экономичный расход
      - Время работы с раствором 25-50 минут
    `,
    
    manufacturer_id: 'company-1001-knauf',
    manufacturer_name: 'KNAUF',
    brand: 'KNAUF',
    
    category_id: 'cat-2',
    category_name: 'Сухие смеси',
    
    price: 650,
    price_currency: 'RUB',
    price_unit: 'за мешок',
    old_price: 720,
    discount_percent: 10,
    
    in_stock: true,
    stock_quantity: 25000,
    min_order_quantity: 10,
    
    images: [
      { url: '/images/products/knauf-rotband.jpg', alt: 'KNAUF Rotband 30кг', is_primary: true },
    ],
    
    specifications: {
      'Вес мешка': '30 кг',
      'Расход': '8.5 кг/м² при толщине 10мм',
      'Толщина слоя': '5-50 мм',
      'Время высыхания': '7 суток',
      'Жизнеспособность раствора': '25-50 минут',
      'Прочность на сжатие': 'не менее 2.5 МПа',
      'Температура применения': '+5...+30°C'
    },
    
    tags: ['штукатурка', 'knauf', 'rotband', 'гипсовая', 'стены'],
    
    rating: 4.9,
    reviews_count: 2345,
    orders_count: 89456,
    
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2026-01-12T09:00:00Z'
  },
  
  // === ЭЛЕКТРИКА SCHNEIDER ===
  {
    id: 'prod-3001',
    sku: 'SE-ACTI9-IC60N-C16',
    name: 'Автоматический выключатель Schneider Electric Acti9 iC60N 1P C16А',
    short_description: 'Модульный автоматический выключатель на 16А',
    description: `
      Автоматический выключатель Schneider Electric серии Acti9 iC60N — надежное решение для защиты электрических цепей.
      
      **Особенности:**
      - Номинальный ток 16А
      - Характеристика срабатывания C
      - Отключающая способность 6кА
      - Механический и электрический ресурс
      
      **Применение:**
      - Жилые помещения
      - Офисы
      - Коммерческие здания
    `,
    
    manufacturer_id: 'company-1002-schneider',
    manufacturer_name: 'Schneider Electric',
    brand: 'Acti9',
    
    category_id: 'cat-3',
    category_name: 'Электрика',
    
    price: 890,
    price_currency: 'RUB',
    price_unit: 'за шт',
    
    in_stock: true,
    stock_quantity: 5000,
    min_order_quantity: 1,
    
    images: [
      { url: '/images/products/se-acti9.jpg', alt: 'Schneider Acti9 C16', is_primary: true },
    ],
    
    specifications: {
      'Номинальный ток': '16 А',
      'Число полюсов': '1P',
      'Характеристика': 'C',
      'Отключающая способность': '6 кА',
      'Напряжение': '230/400 В',
      'Ширина': '1 модуль (18 мм)',
      'Класс защиты': 'IP20'
    },
    
    tags: ['автомат', 'schneider', 'acti9', 'электрика', '16а'],
    
    rating: 4.9,
    reviews_count: 567,
    orders_count: 23456,
    
    certification: 'ГОСТ Р МЭК 60898-1-2020',
    
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2026-01-05T16:00:00Z'
  },
  
  // === САНТЕХНИКА GROHE ===
  {
    id: 'prod-4001',
    sku: 'GROHE-GROHTHERM-1000',
    name: 'Термостат GROHE Grohtherm 1000 для душа',
    short_description: 'Настенный термостат с точным контролем температуры',
    description: `
      GROHE Grohtherm 1000 — термостатический смеситель для душа с технологией GROHE TurboStat.
      
      **Технологии:**
      - TurboStat — мгновенная подача воды нужной температуры
      - SafeStop — ограничитель температуры 38°C
      - EcoJoy — экономия воды до 50%
      
      **Особенности:**
      - Хромированное покрытие StarLight
      - Долговечный керамический картридж
      - Система быстрого монтажа
    `,
    
    manufacturer_id: 'company-1003-grohe',
    manufacturer_name: 'GROHE',
    brand: 'Grohtherm',
    
    category_id: 'cat-4',
    category_name: 'Сантехника',
    
    price: 45000,
    price_currency: 'RUB',
    price_unit: 'за шт',
    old_price: 52000,
    discount_percent: 13,
    
    in_stock: true,
    stock_quantity: 250,
    min_order_quantity: 1,
    
    images: [
      { url: '/images/products/grohe-grohtherm.jpg', alt: 'GROHE Grohtherm 1000', is_primary: true },
      { url: '/images/products/grohe-grohtherm-detail.jpg', alt: 'Детали термостата', is_primary: false },
    ],
    
    specifications: {
      'Тип': 'Настенный термостат',
      'Подключение': 'G 1/2"',
      'Расстояние между подводками': '150 мм ± 15 мм',
      'Рабочее давление': '1-10 бар',
      'Расход воды': '18 л/мин',
      'Покрытие': 'Хром StarLight',
      'Страна производства': 'Германия'
    },
    
    tags: ['термостат', 'grohe', 'душ', 'сантехника', 'премиум'],
    
    rating: 4.8,
    reviews_count: 234,
    orders_count: 1567,
    
    warranty_info: 'Гарантия производителя 5 лет',
    
    created_at: '2024-04-01T10:00:00Z',
    updated_at: '2026-01-07T10:30:00Z'
  },
  
  // === ТЕПЛОИЗОЛЯЦИЯ ROCKWOOL ===
  {
    id: 'prod-5001',
    sku: 'RW-LIGHT-BATTS-1000-50',
    name: 'Утеплитель ROCKWOOL Лайт Баттс 1000x600x50мм',
    short_description: 'Легкие гидрофобизированные плиты из каменной ваты',
    description: `
      ROCKWOOL Лайт Баттс — легкие теплоизоляционные плиты из каменной ваты для ненагружаемых конструкций.
      
      **Применение:**
      - Скатные кровли
      - Мансарды
      - Каркасные стены
      - Перегородки
      - Перекрытия
      
      **Преимущества:**
      - Технология Флекси — пружинящий край
      - Негорючий материал
      - Паропроницаемый
      - Экологически безопасный
    `,
    
    manufacturer_id: 'company-1005-rockwool',
    manufacturer_name: 'ROCKWOOL',
    brand: 'ROCKWOOL',
    
    category_id: 'cat-5',
    category_name: 'Теплоизоляция',
    
    price: 1200,
    price_currency: 'RUB',
    price_unit: 'за упак',
    
    in_stock: true,
    stock_quantity: 8000,
    min_order_quantity: 5,
    
    images: [
      { url: '/images/products/rockwool-light.jpg', alt: 'ROCKWOOL Лайт Баттс', is_primary: true },
    ],
    
    specifications: {
      'Размер плиты': '1000 x 600 x 50 мм',
      'Плит в упаковке': '10 шт',
      'Площадь в упаковке': '6 м²',
      'Объем в упаковке': '0.3 м³',
      'Плотность': '37 кг/м³',
      'Теплопроводность λ': '0.036 Вт/м·К',
      'Группа горючести': 'НГ (негорючий)',
      'Водопоглощение': 'не более 1%'
    },
    
    tags: ['утеплитель', 'rockwool', 'минвата', 'теплоизоляция', 'кровля'],
    
    rating: 4.7,
    reviews_count: 892,
    orders_count: 34567,
    
    created_at: '2024-05-01T10:00:00Z',
    updated_at: '2026-01-11T08:45:00Z'
  },
  
  // === ИНСТРУМЕНТЫ BOSCH ===
  {
    id: 'prod-6001',
    sku: 'BOSCH-GSR-12V-30',
    name: 'Шуруповёрт аккумуляторный BOSCH GSR 12V-30 Professional',
    short_description: 'Компактный профессиональный шуруповёрт 12В',
    description: `
      BOSCH GSR 12V-30 Professional — компактный и мощный аккумуляторный шуруповёрт для профессионалов.
      
      **Особенности:**
      - Бесщёточный двигатель EC
      - 2 скорости
      - Светодиодная подсветка
      - Быстрозажимной патрон
      
      **В комплекте:**
      - Шуруповёрт GSR 12V-30
      - 2 аккумулятора GBA 12V 2.0Ah
      - Зарядное устройство GAL 12V-40
      - Кейс L-BOXX 102
    `,
    
    manufacturer_id: 'company-1004-bosch',
    manufacturer_name: 'Bosch',
    brand: 'Bosch Professional',
    
    category_id: 'cat-7',
    category_name: 'Инструменты',
    
    price: 15900,
    price_currency: 'RUB',
    price_unit: 'за комплект',
    old_price: 18500,
    discount_percent: 14,
    
    in_stock: true,
    stock_quantity: 450,
    min_order_quantity: 1,
    
    images: [
      { url: '/images/products/bosch-gsr-12v.jpg', alt: 'BOSCH GSR 12V-30', is_primary: true },
      { url: '/images/products/bosch-gsr-12v-kit.jpg', alt: 'Комплектация', is_primary: false },
    ],
    
    specifications: {
      'Напряжение': '12 В',
      'Тип двигателя': 'Бесщёточный',
      'Макс. крутящий момент': '30 Нм',
      'Скорость 1': '0-400 об/мин',
      'Скорость 2': '0-1300 об/мин',
      'Патрон': '10 мм быстрозажимной',
      'Вес без АКБ': '0.76 кг',
      'Ёмкость АКБ': '2.0 Ач'
    },
    
    tags: ['шуруповёрт', 'bosch', 'professional', 'аккумуляторный', '12в'],
    
    rating: 4.9,
    reviews_count: 1456,
    orders_count: 12345,
    
    warranty_info: 'Гарантия производителя 3 года',
    
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2026-01-09T15:20:00Z'
  },
  
  // === КРАСКИ ===
  {
    id: 'prod-7001',
    sku: 'DULUX-DIAMOND-MAT-10',
    name: 'Краска DULUX Diamond Matt 10л',
    short_description: 'Износостойкая глубокоматовая краска для стен',
    description: `
      DULUX Diamond Matt — профессиональная износостойкая краска с технологией Diamond Protection.
      
      **Особенности:**
      - Глубокоматовое покрытие
      - Выдерживает до 10000 циклов истирания
      - Устойчива к пятнам
      - Легко моется
      
      **Применение:**
      - Стены и потолки
      - Жилые и общественные помещения
      - Офисы, гостиницы, школы
    `,
    
    manufacturer_id: 'company-1007-dulux',
    manufacturer_name: 'Dulux',
    brand: 'Dulux',
    
    category_id: 'cat-8',
    category_name: 'Краски и лаки',
    
    price: 5500,
    price_currency: 'RUB',
    price_unit: 'за ведро',
    
    in_stock: true,
    stock_quantity: 1200,
    min_order_quantity: 1,
    
    images: [
      { url: '/images/products/dulux-diamond.jpg', alt: 'DULUX Diamond Matt', is_primary: true },
    ],
    
    specifications: {
      'Объём': '10 л',
      'Расход': '12 м²/л',
      'Степень блеска': 'Глубокоматовая',
      'Время высыхания': '2-4 часа',
      'Количество слоёв': '2',
      'Разбавитель': 'Вода',
      'Колеровка': 'По системе Color Mixing',
      'Класс истираемости': '1 по EN 13300'
    },
    
    tags: ['краска', 'dulux', 'diamond', 'интерьерная', 'стены'],
    
    rating: 4.8,
    reviews_count: 678,
    orders_count: 8901,
    
    created_at: '2024-07-01T10:00:00Z',
    updated_at: '2026-01-13T11:00:00Z'
  }
];

// === HELPER FUNCTIONS ===

export function getProductById(id: string): ProductCard | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductBySku(sku: string): ProductCard | undefined {
  return PRODUCTS.find(p => p.sku === sku);
}

export function getProductsByCategory(categoryId: string): ProductCard[] {
  return PRODUCTS.filter(p => p.category_id === categoryId);
}

export function getProductsByManufacturer(manufacturerId: string): ProductCard[] {
  return PRODUCTS.filter(p => p.manufacturer_id === manufacturerId);
}

export function searchProducts(query: string): ProductCard[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.short_description.toLowerCase().includes(q) ||
    p.tags?.some(t => t.toLowerCase().includes(q)) ||
    p.brand?.toLowerCase().includes(q)
  );
}

export function getPopularProducts(limit: number = 10): ProductCard[] {
  return [...PRODUCTS].sort((a, b) => (b.orders_count || 0) - (a.orders_count || 0)).slice(0, limit);
}

export function getProductsOnSale(): ProductCard[] {
  return PRODUCTS.filter(p => p.discount_percent && p.discount_percent > 0);
}

export function getProductsStatistics() {
  return {
    total_products: PRODUCTS.length,
    total_categories: CATEGORIES.length,
    products_in_stock: PRODUCTS.filter(p => p.in_stock).length,
    products_on_sale: PRODUCTS.filter(p => p.discount_percent).length,
    avg_rating: Math.round(PRODUCTS.reduce((sum, p) => sum + (p.rating || 0), 0) / PRODUCTS.length * 10) / 10,
    total_reviews: PRODUCTS.reduce((sum, p) => sum + (p.reviews_count || 0), 0),
    by_category: CATEGORIES.map(c => ({
      category: c.name,
      count: PRODUCTS.filter(p => p.category_id === c.id).length
    }))
  };
}
