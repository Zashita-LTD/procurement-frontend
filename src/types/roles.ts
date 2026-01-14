// Типы ролей в системе
export type UserRole = 
  | 'private'    // Частник (B2C)
  | 'pro'        // Ремонтник (SMB)
  | 'foreman'    // Прораб (B2B)
  | 'buyer'      // Закупщик (B2B)
  | 'executive'; // Директор (B2B)

// Категории пользователей
export type UserCategory = 'b2c' | 'smb' | 'b2b';

// Маппинг ролей к категориям
export const roleCategoryMap: Record<UserRole, UserCategory> = {
  private: 'b2c',
  pro: 'smb',
  foreman: 'b2b',
  buyer: 'b2b',
  executive: 'b2b',
};

// Базовый интерфейс пользователя
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  company?: Company;
}

// Компания (для B2B ролей)
export interface Company {
  id: string;
  name: string;
  inn?: string;
  logo?: string;
}

// Конфигурация темы для роли
export interface RoleThemeConfig {
  theme: 'light' | 'dark' | 'corporate';
  className: string;
  borderRadius: 'rounded-lg' | 'rounded-md' | 'rounded-sm';
  density: 'comfortable' | 'compact' | 'dense';
}

// Темы для каждой роли
export const roleThemeConfig: Record<UserRole, RoleThemeConfig> = {
  private: {
    theme: 'light',
    className: 'theme-light',
    borderRadius: 'rounded-lg',
    density: 'comfortable',
  },
  pro: {
    theme: 'dark',
    className: 'theme-dark',
    borderRadius: 'rounded-md',
    density: 'compact',
  },
  foreman: {
    theme: 'dark',
    className: 'theme-dark',
    borderRadius: 'rounded-md',
    density: 'compact',
  },
  buyer: {
    theme: 'corporate',
    className: 'theme-corporate',
    borderRadius: 'rounded-sm',
    density: 'dense',
  },
  executive: {
    theme: 'corporate',
    className: 'theme-corporate',
    borderRadius: 'rounded-sm',
    density: 'dense',
  },
};

// Описания ролей
export const roleDescriptions: Record<UserRole, { title: string; description: string; icon: string }> = {
  private: {
    title: 'Частник',
    description: 'Ремонт квартиры или дома для себя',
    icon: '🏠',
  },
  pro: {
    title: 'Ремонтник',
    description: 'Профессиональный исполнитель работ',
    icon: '🛠',
  },
  foreman: {
    title: 'Прораб',
    description: 'Управление объектами и бригадами',
    icon: '👷',
  },
  buyer: {
    title: 'Закупщик',
    description: 'Закупки для компании',
    icon: '📦',
  },
  executive: {
    title: 'Директор',
    description: 'Контроль и аналитика бизнеса',
    icon: '📊',
  },
};

// Базовые пути для каждой роли
export const roleBasePaths: Record<UserRole, string> = {
  private: '/private',
  pro: '/pro',
  foreman: '/company/foreman',
  buyer: '/company/buyer',
  executive: '/company/executive',
};

// Главные страницы для каждой роли
export const roleHomePages: Record<UserRole, string> = {
  private: '/private/dashboard',
  pro: '/pro/projects',
  foreman: '/company/foreman/feed',
  buyer: '/company/buyer/orders',
  executive: '/company/executive/analytics',
};
