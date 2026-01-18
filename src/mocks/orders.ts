/**
 * Вымышленные заказы - история операций цифрового города.
 * Реалистичные заказы с различными статусами и историями.
 */

import type { OrderDetail, OrderListItem, OrderStatus } from '../types/extended';

// === ИЗБРАННЫЕ ЗАКАЗЫ С ПОЛНОЙ ИСТОРИЕЙ ===
export const FEATURED_ORDERS: OrderDetail[] = [
  {
    id: 'order-50001',
    order_number: 'ORD-2026-000001',
    user_id: 'user-501-pavel-belov',
    user_name: 'Белов Павел Анатольевич',
    supplier_id: 'company-2001-petrovich',
    supplier_name: 'СТД Петрович',
    
    subtotal: 4567890.50,
    discount: 456789.05,
    delivery_cost: 0,
    total: 4111101.45,
    currency: 'RUB',
    
    status: 'completed',
    
    delivery_address: 'г. Москва, ул. Правды, 24, склад №3',
    delivery_date: '2026-01-10',
    actual_delivery_date: '2026-01-09',
    tracking_number: 'PTR-2026-00001',
    
    payment_method: 'invoice',
    payment_status: 'paid',
    paid_at: '2026-01-05T14:30:00Z',
    
    customer_notes: 'Крупный заказ для ЖК "Солнечный". Разгрузка краном.',
    internal_notes: 'VIP-клиент, приоритетная доставка',
    
    metadata: {
      project: 'ЖК Солнечный, корпус 5',
      contract: '2026/001',
      manager: 'Сергей Козлов'
    },
    
    items: [
      { product_sku: 'PTR-GKL-001', product_name: 'Гипсокартон Knauf 12.5мм', quantity: 2000, unit: 'лист', unit_price: 450, total: 900000 },
      { product_sku: 'PTR-PROF-001', product_name: 'Профиль направляющий ПН 27x28', quantity: 1500, unit: 'шт', unit_price: 180, total: 270000 },
      { product_sku: 'PTR-PROF-002', product_name: 'Профиль потолочный ПП 60x27', quantity: 3000, unit: 'шт', unit_price: 220, total: 660000 },
      { product_sku: 'PTR-MIX-001', product_name: 'Штукатурка Knauf Rotband 30кг', quantity: 500, unit: 'мешок', unit_price: 650, total: 325000 },
      { product_sku: 'PTR-INS-001', product_name: 'Утеплитель ROCKWOOL 50мм', quantity: 300, unit: 'упак', unit_price: 1200, total: 360000 },
    ],
    
    history: [
      { status: 'draft', comment: 'Заказ создан', changed_by: 's.kozlov@zashita.ru', created_at: '2026-01-03T09:15:00Z' },
      { status: 'pending', comment: 'Отправлен на согласование', changed_by: 's.kozlov@zashita.ru', created_at: '2026-01-03T09:30:00Z' },
      { status: 'approved', comment: 'Согласован финансовым директором', changed_by: 'a.sokolova@zashita.ru', created_at: '2026-01-03T14:00:00Z' },
      { status: 'in_production', comment: 'Комплектация на складе', changed_by: 'i.fedorov@zashita.ru', created_at: '2026-01-04T08:30:00Z' },
      { status: 'shipped', comment: 'Отгружено, машина ГАЗ А65 р123мо', changed_by: 'i.fedorov@zashita.ru', created_at: '2026-01-09T07:00:00Z' },
      { status: 'delivered', comment: 'Доставлено, ТТН подписана', changed_by: 'system', created_at: '2026-01-09T14:30:00Z' },
      { status: 'completed', comment: 'Заказ закрыт, оплата получена', changed_by: 't.orlova@zashita.ru', created_at: '2026-01-09T16:45:00Z' },
    ],
    
    created_at: '2026-01-03T09:15:00Z',
    updated_at: '2026-01-09T16:45:00Z',
    completed_at: '2026-01-09T16:45:00Z'
  },
  {
    id: 'order-50002',
    order_number: 'ORD-2026-000015',
    user_id: 'user-503-vladimir-karpov',
    user_name: 'Карпов Владимир Николаевич',
    supplier_id: 'company-2003-etm',
    supplier_name: 'ЭТМ',
    
    subtotal: 12500000,
    discount: 1250000,
    delivery_cost: 0,
    total: 11250000,
    currency: 'RUB',
    
    status: 'shipped',
    
    delivery_address: 'г. Казань, ул. Петербургская, 50',
    delivery_date: '2026-01-20',
    tracking_number: 'ETM-2026-00015',
    
    payment_method: 'bank_transfer',
    payment_status: 'paid',
    
    customer_notes: 'Электрооборудование для нового цеха. Спецтранспорт.',
    
    metadata: {
      project: 'Завод КАМАЗ, цех сборки',
      contract: '2026/КМЗ-015'
    },
    
    items: [
      { product_sku: 'SE-ACTI9-001', product_name: 'Автомат Schneider Acti9 C63', quantity: 200, unit: 'шт', unit_price: 2500, total: 500000 },
      { product_sku: 'SE-ACTI9-002', product_name: 'УЗО Schneider Acti9 40A', quantity: 150, unit: 'шт', unit_price: 4500, total: 675000 },
      { product_sku: 'ABB-CONT-001', product_name: 'Контактор ABB AF09-30', quantity: 100, unit: 'шт', unit_price: 8500, total: 850000 },
      { product_sku: 'CABLE-VVG-001', product_name: 'Кабель ВВГнг 3x2.5', quantity: 10000, unit: 'м', unit_price: 85, total: 850000 },
    ],
    
    history: [
      { status: 'draft', comment: 'Заказ создан', changed_by: 'e.nikolaeva@zashita.ru', created_at: '2026-01-10T11:00:00Z' },
      { status: 'approved', comment: 'Срочное согласование', changed_by: 'd.petrov@zashita.ru', created_at: '2026-01-10T14:00:00Z' },
      { status: 'in_production', comment: 'Сборка заказа', changed_by: 'etm_system', created_at: '2026-01-12T09:00:00Z' },
      { status: 'shipped', comment: 'Отправлено из Москвы', changed_by: 'etm_system', created_at: '2026-01-17T10:30:00Z' },
    ],
    
    created_at: '2026-01-10T11:00:00Z',
    updated_at: '2026-01-17T10:30:00Z'
  },
  {
    id: 'order-50003',
    order_number: 'ORD-2026-000023',
    user_id: 'user-504-natalya-zaitseva',
    user_name: 'Зайцева Наталья Олеговна',
    supplier_id: 'company-2001-petrovich',
    supplier_name: 'СТД Петрович',
    
    subtotal: 890000,
    discount: 0,
    delivery_cost: 2500,
    total: 892500,
    currency: 'RUB',
    
    status: 'in_production',
    
    delivery_address: 'г. Москва, Патриарший пер., 5',
    delivery_date: '2026-01-22',
    
    payment_method: 'card',
    payment_status: 'pending',
    
    customer_notes: 'Премиум-материалы для интерьера. Только оригинал!',
    
    metadata: {
      project: 'Квартира Иванова А.С.',
      designer: 'Наталья Зайцева'
    },
    
    items: [
      { product_sku: 'GROHE-THM-001', product_name: 'Смеситель GROHE Grohtherm 1000', quantity: 3, unit: 'шт', unit_price: 45000, total: 135000 },
      { product_sku: 'GROHE-SHW-001', product_name: 'Душевая система GROHE Rainshower', quantity: 2, unit: 'шт', unit_price: 89000, total: 178000 },
      { product_sku: 'GEBERIT-INS-001', product_name: 'Инсталляция Geberit Duofix', quantity: 2, unit: 'шт', unit_price: 35000, total: 70000 },
    ],
    
    history: [
      { status: 'draft', comment: 'Заказ создан', changed_by: 'o.smirnova@zashita.ru', created_at: '2026-01-15T16:30:00Z' },
      { status: 'pending', comment: 'Ожидание подтверждения клиента', changed_by: 'o.smirnova@zashita.ru', created_at: '2026-01-15T16:45:00Z' },
      { status: 'approved', comment: 'Клиент подтвердил', changed_by: 'o.smirnova@zashita.ru', created_at: '2026-01-16T10:00:00Z' },
      { status: 'in_production', comment: 'Комплектация заказа', changed_by: 'n.kuznetsov@zashita.ru', created_at: '2026-01-17T09:00:00Z' },
    ],
    
    created_at: '2026-01-15T16:30:00Z',
    updated_at: '2026-01-17T09:00:00Z'
  },
  {
    id: 'order-50004',
    order_number: 'ORD-2026-000045',
    user_id: 'user-505-rustam-abdullaev',
    user_name: 'Абдуллаев Рустам Фаридович',
    supplier_id: 'company-2002-leroymerlin',
    supplier_name: 'Леруа Мерлен',
    
    subtotal: 8750000,
    discount: 875000,
    delivery_cost: 15000,
    total: 7890000,
    currency: 'RUB',
    
    status: 'approved',
    
    delivery_address: 'г. Краснодар, ул. Красная, 150, склад',
    delivery_date: '2026-01-25',
    
    payment_method: 'invoice',
    payment_status: 'pending',
    
    customer_notes: 'Материалы для ЖК "Южный". Этап 2.',
    internal_notes: 'Крупный региональный клиент. Скидка 10%.',
    
    metadata: {
      project: 'ЖК Южный, этап 2',
      contract: '2026/ЮЖН-045'
    },
    
    items: [
      { product_sku: 'LM-CEMENT-001', product_name: 'Цемент М500 50кг', quantity: 1000, unit: 'мешок', unit_price: 450, total: 450000 },
      { product_sku: 'LM-BRICK-001', product_name: 'Кирпич облицовочный', quantity: 50000, unit: 'шт', unit_price: 25, total: 1250000 },
      { product_sku: 'LM-INS-001', product_name: 'Утеплитель минвата 100мм', quantity: 500, unit: 'упак', unit_price: 1800, total: 900000 },
      { product_sku: 'LM-ROOF-001', product_name: 'Черепица SHINGLAS', quantity: 2000, unit: 'м²', unit_price: 850, total: 1700000 },
    ],
    
    history: [
      { status: 'draft', comment: 'Заказ создан', changed_by: 'a.volkov@zashita.ru', created_at: '2026-01-18T08:00:00Z' },
      { status: 'pending', comment: 'На согласовании', changed_by: 'a.volkov@zashita.ru', created_at: '2026-01-18T08:15:00Z' },
      { status: 'approved', comment: 'Согласовано руководством', changed_by: 'm.ivanova@zashita.ru', created_at: '2026-01-18T10:30:00Z' },
    ],
    
    created_at: '2026-01-18T08:00:00Z',
    updated_at: '2026-01-18T10:30:00Z'
  },
  {
    id: 'order-50005',
    order_number: 'ORD-2026-000012',
    user_id: 'user-502-andrey-gromov',
    user_name: 'Громов Андрей Петрович',
    supplier_id: 'company-2001-petrovich',
    supplier_name: 'СТД Петрович',
    
    subtotal: 15600000,
    discount: 2340000,
    delivery_cost: 0,
    total: 13260000,
    currency: 'RUB',
    
    status: 'delivered',
    
    delivery_address: 'г. Санкт-Петербург, Невский пр-т, 100, склад',
    delivery_date: '2026-01-12',
    actual_delivery_date: '2026-01-12',
    tracking_number: 'PTR-2026-00012',
    
    payment_method: 'invoice',
    payment_status: 'paid',
    paid_at: '2026-01-14T10:00:00Z',
    
    customer_notes: 'ЖК "Невские высоты", корпус 3. Материалы для внутренней отделки.',
    
    metadata: {
      project: 'ЖК Невские высоты, корпус 3',
      contract: '2025/НВ-012',
      manager: 'Екатерина Николаева'
    },
    
    items: [
      { product_sku: 'PTR-GKL-001', product_name: 'Гипсокартон Knauf 12.5мм', quantity: 5000, unit: 'лист', unit_price: 450, total: 2250000 },
      { product_sku: 'PTR-PROF-001', product_name: 'Профиль направляющий ПН 27x28', quantity: 4000, unit: 'шт', unit_price: 180, total: 720000 },
      { product_sku: 'PTR-MIX-001', product_name: 'Штукатурка Knauf Rotband 30кг', quantity: 2000, unit: 'мешок', unit_price: 650, total: 1300000 },
      { product_sku: 'PTR-MIX-002', product_name: 'Шпаклёвка Knauf HP Finish 25кг', quantity: 1500, unit: 'мешок', unit_price: 480, total: 720000 },
      { product_sku: 'PTR-PAINT-001', product_name: 'Краска Dulux интерьерная 10л', quantity: 300, unit: 'ведро', unit_price: 5500, total: 1650000 },
    ],
    
    history: [
      { status: 'draft', comment: 'Заказ создан', changed_by: 'e.nikolaeva@zashita.ru', created_at: '2026-01-05T10:00:00Z' },
      { status: 'approved', comment: 'Экспресс-согласование', changed_by: 'a.sokolova@zashita.ru', created_at: '2026-01-05T11:30:00Z' },
      { status: 'in_production', comment: 'Сборка на складе СПб', changed_by: 'petrovich_system', created_at: '2026-01-06T08:00:00Z' },
      { status: 'shipped', comment: 'Доставка 3 машинами', changed_by: 'petrovich_system', created_at: '2026-01-12T07:00:00Z' },
      { status: 'delivered', comment: 'Доставлено полностью, без повреждений', changed_by: 'system', created_at: '2026-01-12T15:00:00Z' },
    ],
    
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-14T10:00:00Z'
  }
];

// === ГЕНЕРАЦИЯ СПИСКА ЗАКАЗОВ ===

function generateOrdersList(): OrderListItem[] {
  const orders: OrderListItem[] = [];
  const statuses: OrderStatus[] = ['completed', 'completed', 'completed', 'delivered', 'shipped', 'in_production', 'approved', 'pending', 'draft'];
  
  let orderNum = 100;
  
  // Генерируем заказы за последние 12 месяцев
  for (let month = 12; month >= 0; month--) {
    const ordersPerMonth = 30 + (12 - month) * 5; // Рост количества заказов
    
    for (let i = 0; i < ordersPerMonth; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - month);
      date.setDate(Math.floor(Math.random() * 28) + 1);
      
      const status = month > 2 ? 'completed' : statuses[Math.floor(Math.random() * statuses.length)];
      const total = Math.floor(Math.random() * 10000000) + 50000;
      
      orders.push({
        id: `order-gen-${orderNum}`,
        order_number: `ORD-${date.getFullYear()}-${String(orderNum).padStart(6, '0')}`,
        status,
        total,
        currency: 'RUB',
        items_count: Math.floor(Math.random() * 10) + 1,
        created_at: date.toISOString(),
        delivery_date: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      orderNum++;
    }
  }
  
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const ALL_ORDERS: OrderListItem[] = [
  // Добавляем featured заказы в начало
  ...FEATURED_ORDERS.map(o => ({
    id: o.id,
    order_number: o.order_number,
    status: o.status,
    total: o.total,
    currency: o.currency,
    items_count: o.items?.length || 0,
    created_at: o.created_at,
    delivery_date: o.delivery_date
  })),
  // Добавляем сгенерированные
  ...generateOrdersList()
];

// === СТАТИСТИКА ===

export function getOrdersStatistics() {
  const total = ALL_ORDERS.length;
  const completed = ALL_ORDERS.filter(o => o.status === 'completed').length;
  const totalRevenue = ALL_ORDERS.reduce((sum, o) => sum + o.total, 0);
  
  const byStatus: Record<string, number> = {};
  ALL_ORDERS.forEach(o => {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
  });
  
  const monthlyStats: Record<string, { count: number; revenue: number }> = {};
  ALL_ORDERS.forEach(o => {
    const month = o.created_at.substring(0, 7);
    if (!monthlyStats[month]) {
      monthlyStats[month] = { count: 0, revenue: 0 };
    }
    monthlyStats[month].count++;
    monthlyStats[month].revenue += o.total;
  });
  
  return {
    total_orders: total,
    completed_orders: completed,
    completion_rate: Math.round(completed / total * 100 * 10) / 10,
    total_revenue: totalRevenue,
    avg_order_value: Math.round(totalRevenue / total),
    orders_by_status: byStatus,
    monthly_stats: monthlyStats
  };
}

// === HELPER FUNCTIONS ===

export function getOrderById(id: string): OrderDetail | undefined {
  return FEATURED_ORDERS.find(o => o.id === id);
}

export function getOrderByNumber(orderNumber: string): OrderDetail | undefined {
  return FEATURED_ORDERS.find(o => o.order_number === orderNumber);
}

export function getRecentOrders(limit: number = 10): OrderListItem[] {
  return ALL_ORDERS.slice(0, limit);
}

export function getOrdersByStatus(status: OrderStatus): OrderListItem[] {
  return ALL_ORDERS.filter(o => o.status === status);
}
