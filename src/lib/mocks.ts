/**
 * Файл с мок-данными для демонстрации
 */

// Аудит сметы - тестовые данные для частников
export const quoteAuditMocks = {
  // Примеры результатов анализа
  results: [
    {
      status: 'warning' as const,
      warnings: [
        {
          item: 'Ротбанд 30кг',
          quantity: 50,
          expected: 15,
          message: 'Норма расхода превышена в 3 раза. На 10м² стен нужно ~15 мешков.',
          overcharge: 15750,
        },
        {
          item: 'Грунтовка глубокого проникновения',
          quantity: 10,
          expected: 3,
          message: 'Завышенное количество грунтовки.',
          overcharge: 2100,
        },
      ],
      totalOvercharge: 17850,
      savings: 17850,
      recommendation: 'Рекомендуем уточнить расчёт материалов у другого специалиста. Возможная экономия составит почти 18 000 ₽.',
    },
    {
      status: 'danger' as const,
      warnings: [
        {
          item: 'Кабель ВВГнг 3x2.5',
          quantity: 200,
          expected: 80,
          message: 'Кабеля заказано в 2.5 раза больше нормы.',
          overcharge: 10200,
        },
      ],
      totalOvercharge: 10200,
      savings: 10200,
      recommendation: 'Обнаружены серьёзные завышения. Настоятельно рекомендуем пересмотреть смету.',
    },
    {
      status: 'clean' as const,
      warnings: [],
      totalOvercharge: 0,
      savings: 0,
      recommendation: 'Смета выглядит корректно. Расход материалов соответствует нормам.',
    },
  ],

  // Нормы расхода материалов
  norms: {
    'rotband': { unit: 'кг/м²', value: 8.5, description: 'Штукатурка Ротбанд при слое 10мм' },
    'cable_vvg_2.5': { unit: 'м/точка', value: 15, description: 'Кабель ВВГнг 3x2.5 на одну точку' },
    'primer': { unit: 'л/м²', value: 0.1, description: 'Грунтовка глубокого проникновения' },
  },
};

export const productMocks = [
  { id: '1', name: 'Цемент М500', price: 1200, unit: 'мешок' },
  { id: '2', name: 'Арматура 12мм', price: 450, unit: 'м.п.' },
  { id: '3', name: 'Кирпич красный', price: 25, unit: 'шт' },
  { id: '4', name: 'Песок речной', price: 800, unit: 'тонна' },
  { id: '5', name: 'Щебень 20-40', price: 1100, unit: 'тонна' },
];

export const orderMocks = [
  { id: 'ORD-001', status: 'delivered', total: 125000 },
  { id: 'ORD-002', status: 'processing', total: 87000 },
  { id: 'ORD-003', status: 'pending', total: 45000 },
];

export const categoryMocks = [
  { id: 'cement', name: 'Цемент и смеси', count: 15 },
  { id: 'metal', name: 'Металлопрокат', count: 23 },
  { id: 'wood', name: 'Пиломатериалы', count: 18 },
  { id: 'paint', name: 'ЛКМ', count: 42 },
];
