/**
 * Центральный экспорт всех моков цифрового города
 * 
 * Этот модуль объединяет все вымышленные данные для создания
 * полноценно работающего сервиса закупок.
 */

// Старые моки
export * from './data'
export * from './handlers'

// === USERS ===
export {
  VICTOR_LAVRENTIEV,
  TEAM_LEADERS,
  PROCUREMENT_MANAGERS,
  CLIENTS,
  ALL_USERS,
  getUserById,
  getUserByEmail,
  getUsersByRole,
  getUsersListItems,
  getTopBuyers,
  getUsersStatistics
} from './users';

// === COMPANIES ===
export {
  MANUFACTURERS,
  SUPPLIERS,
  CLIENT_COMPANIES,
  ALL_COMPANIES,
  getCompanyById,
  getCompaniesByType,
  getCompaniesListItems,
  getTopRatedCompanies
} from './companies';

// === PRODUCTS ===
export {
  CATEGORIES,
  PRODUCTS,
  getProductById,
  getProductBySku,
  getProductsByCategory,
  getProductsByManufacturer,
  searchProducts,
  getPopularProducts,
  getProductsOnSale,
  getProductsStatistics
} from './products';

// === ORDERS ===
export {
  FEATURED_ORDERS,
  ALL_ORDERS,
  getOrderById,
  getOrderByNumber,
  getRecentOrders,
  getOrdersByStatus,
  getOrdersStatistics
} from './orders';

// === DASHBOARD DATA ===

import { ALL_COMPANIES, MANUFACTURERS, SUPPLIERS, CLIENT_COMPANIES, getTopRatedCompanies } from './companies';
import { getUsersStatistics } from './users';
import { getOrdersStatistics } from './orders';
import { getProductsStatistics } from './products';

/**
 * Агрегированные данные для главного дашборда
 */
export function getDashboardData() {
  const usersStats = getUsersStatistics();
  const ordersStats = getOrdersStatistics();
  const productsStats = getProductsStatistics();
  
  return {
    summary: {
      total_users: usersStats.total_users,
      total_companies: ALL_COMPANIES.length,
      total_orders: ordersStats.total_orders,
      total_products: productsStats.total_products,
      total_revenue: ordersStats.total_revenue,
      completion_rate: ordersStats.completion_rate
    },
    
    kpi: {
      avg_order_value: ordersStats.avg_order_value,
      avg_rating: productsStats.avg_rating,
      verified_companies: ALL_COMPANIES.filter((c: any) => c.is_verified).length,
      active_users: usersStats.active_users
    },
    
    recent_activity: [
      { type: 'order', title: 'Новый заказ ORD-2026-000045', time: '5 минут назад' },
      { type: 'user', title: 'Регистрация нового клиента', time: '12 минут назад' },
      { type: 'payment', title: 'Оплата заказа ORD-2026-000012', time: '25 минут назад' },
      { type: 'delivery', title: 'Доставка ORD-2026-000001 завершена', time: '1 час назад' },
      { type: 'review', title: 'Новый отзыв на KNAUF Rotband', time: '2 часа назад' }
    ],
    
    charts: {
      orders_by_status: ordersStats.orders_by_status,
      companies_by_type: {
        manufacturers: MANUFACTURERS.length,
        suppliers: SUPPLIERS.length,
        clients: CLIENT_COMPANIES.length
      },
      users_by_role: usersStats.users_by_role,
      monthly_revenue: ordersStats.monthly_stats
    },
    
    top_performers: {
      top_buyers: usersStats.top_buyers?.slice(0, 5),
      top_companies: getTopRatedCompanies(5),
      popular_products: productsStats.by_category?.slice(0, 5)
    }
  };
}

/**
 * Данные для страницы "О компании"
 */
export const COMPANY_INFO = {
  name: 'Цифровой Город Закупок',
  legal_name: 'ООО "Защита"',
  slogan: 'Интеллектуальные закупки строительных материалов',
  
  description: `
    Мы - команда профессионалов, которые создали инновационную платформу 
    для оптимизации процессов закупок в строительной отрасли.
    
    Наша система использует передовые технологии искусственного интеллекта
    для анализа рынка, прогнозирования цен и автоматизации рутинных операций.
  `,
  
  founded: 2024,
  headquarters: 'Москва, Россия',
  
  stats: {
    clients: '500+',
    suppliers: '150+',
    orders_processed: '25,000+',
    savings: '15-30%'
  },
  
  team: {
    founder: 'Виктор Лаврентьев',
    cfo: 'Анна Соколова',
    cto: 'Дмитрий Петров',
    cco: 'Мария Иванова'
  },
  
  contacts: {
    email: 'info@97v.ru',
    phone: '+7 (495) 123-45-67',
    address: 'г. Москва, ул. Тверская, 1',
    support: 'support@97v.ru'
  },
  
  social: {
    telegram: '@zashita_procurement',
    youtube: 'youtube.com/zashita',
    vk: 'vk.com/zashita_procurement'
  }
};
