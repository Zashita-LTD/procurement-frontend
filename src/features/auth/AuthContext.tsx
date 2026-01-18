import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, roleThemeConfig, roleHomePages } from '@/types/roles';

// Тестовые пользователи для демо-режима
export const testUsers: Record<string, User> = {
  // === СУПЕР-АДМИНИСТРАТОР - Первый житель цифрового города ===
  'info@97v.ru': {
    id: '100',
    email: 'info@97v.ru',
    full_name: 'Лаврентьев Виктор Петрович',
    role: 'executive', // Максимальная роль в системе
    phone: '+7 999 123-45-67',
    company: {
      id: 'c97v',
      name: '97v.ru - Главный администратор системы',
      inn: '7725123456',
    },
  },
  'private@test.com': {
    id: '1',
    email: 'private@test.com',
    full_name: 'Иван Частников',
    role: 'private',
    phone: '+7 999 123-45-67',
  },
  'pro@test.com': {
    id: '2',
    email: 'pro@test.com',
    full_name: 'Сергей Мастеров',
    role: 'pro',
    phone: '+7 999 234-56-78',
  },
  'foreman@test.com': {
    id: '3',
    email: 'foreman@test.com',
    full_name: 'Петр Прорабов',
    role: 'foreman',
    phone: '+7 999 345-67-89',
    company: {
      id: 'c1',
      name: 'СтройПро',
      inn: '7701234567',
    },
  },
  'buyer@test.com': {
    id: '4',
    email: 'buyer@test.com',
    full_name: 'Анна Закупщикова',
    role: 'buyer',
    phone: '+7 999 456-78-90',
    company: {
      id: 'c1',
      name: 'СтройПро',
      inn: '7701234567',
    },
  },
  'executive@test.com': {
    id: '5',
    email: 'executive@test.com',
    full_name: 'Михаил Директоров',
    role: 'executive',
    phone: '+7 999 567-89-01',
    company: {
      id: 'c1',
      name: 'СтройПро',
      inn: '7701234567',
    },
  },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // Для dev-режима
  getHomePage: () => string;
  getTheme: () => typeof roleThemeConfig[UserRole];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка пользователя из localStorage при инициализации
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  // Применение темы при изменении пользователя
  useEffect(() => {
    if (user) {
      const config = roleThemeConfig[user.role];
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-corporate');
      document.documentElement.classList.add(config.className);
      document.documentElement.setAttribute('data-density', config.density);
    }
  }, [user]);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Проверка тестовых пользователей
      const testUser = testUsers[email.toLowerCase()];
      if (testUser) {
        localStorage.setItem('auth_token', `demo-token-${testUser.role}`);
        localStorage.setItem('user', JSON.stringify(testUser));
        setUser(testUser);
        setIsLoading(false);
        return true;
      }

      // Попытка реальной авторизации через API
      // const response = await brainApi.post('/auth/login', { email, password });
      // if (response.data.access_token) { ... }

      // Фоллбэк: создаём пользователя как частника
      const fallbackUser: User = {
        id: 'fallback-1',
        email,
        full_name: email.split('@')[0],
        role: 'private',
      };
      localStorage.setItem('auth_token', 'demo-token-private');
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-corporate');
  }, []);

  // Переключение роли для тестирования (dev mode)
  const switchRole = useCallback((role: UserRole) => {
    if (!user) return;
    
    const updatedUser: User = { ...user, role };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  const getHomePage = useCallback(() => {
    if (!user) return '/login';
    return roleHomePages[user.role];
  }, [user]);

  const getTheme = useCallback(() => {
    if (!user) return roleThemeConfig.private;
    return roleThemeConfig[user.role];
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        getHomePage,
        getTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Хук для проверки роли
export function useHasRole(allowedRoles: UserRole[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
