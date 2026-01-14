import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole, roleDescriptions, roleHomePages } from '@/types/roles';

/**
 * RoleSwitcher - компонент для быстрого переключения ролей (только dev-режим)
 */
export function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  // Показываем только в dev-режиме
  if (import.meta.env.PROD) {
    return null;
  }

  const roles: UserRole[] = ['private', 'pro', 'foreman', 'buyer', 'executive'];

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    navigate(roleHomePages[role]);
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-[100] p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Dev: Переключить роль"
      >
        <Bug className="h-5 w-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Content */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Dev: Переключение роли
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Current Role */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                Текущая роль:
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {user?.role ? roleDescriptions[user.role].icon : '❓'}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user?.role ? roleDescriptions[user.role].title : 'Не выбрана'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Role List */}
            <div className="p-2 max-h-80 overflow-y-auto">
              {roles.map((role) => {
                const info = roleDescriptions[role];
                const isActive = user?.role === role;
                
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    disabled={isActive}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-purple-100 dark:bg-purple-900/40 cursor-default'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-2xl">{info.icon}</span>
                    <div className="flex-1 text-left">
                      <p className={`font-medium ${
                        isActive 
                          ? 'text-purple-700 dark:text-purple-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {info.title}
                      </p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                    {!isActive && (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    {isActive && (
                      <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full">
                        Активна
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                ⚠️ Этот компонент виден только в режиме разработки
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
