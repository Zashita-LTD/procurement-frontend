import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole, roleHomePages } from '@/types/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * Guard компонент для защиты маршрутов по ролям
 */
export function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Перенаправляем на домашнюю страницу роли пользователя
    const redirect = redirectTo || roleHomePages[user.role];
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}

/**
 * Guard для частников (B2C)
 */
export function PrivateGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['private']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard для ремонтников (SMB)
 */
export function ProGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['pro']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard для прорабов (B2B)
 */
export function ForemanGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['foreman']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard для закупщиков (B2B)
 */
export function BuyerGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['buyer']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard для директоров (B2B)
 */
export function ExecutiveGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['executive']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard для всех B2B ролей (компания)
 */
export function CompanyGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['foreman', 'buyer', 'executive']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard только для авторизованных пользователей (любая роль)
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
