/**
 * ProfilePage - Страница профиля пользователя с JWT авторизацией
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield,
  Key,
  LogOut,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Building2,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { brainApi } from '@/lib/axios';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  phone?: string;
  role: 'admin' | 'manager' | 'user';
  is_active: boolean;
  created_at: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Редактируемые поля
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  
  // Смена пароля
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Загрузка профиля
  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await brainApi.get('/auth/me');
      setProfile(response.data);
      setFullName(response.data.full_name || '');
      setCompany(response.data.company || '');
      setPhone(response.data.phone || '');
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Токен истёк - выйти
        localStorage.removeItem('auth_token');
        navigate('/login');
        return;
      }
      setError('Ошибка загрузки профиля');
      // Демо данные
      const demoProfile: UserProfile = {
        id: 'demo-user-1',
        email: 'admin@procurement.kz',
        full_name: 'Администратор',
        company: 'ТОО "Снабжение+"',
        phone: '+7 701 123 4567',
        role: 'admin',
        is_active: true,
        created_at: '2025-01-15T10:00:00Z'
      };
      setProfile(demoProfile);
      setFullName(demoProfile.full_name);
      setCompany(demoProfile.company || '');
      setPhone(demoProfile.phone || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Сохранение профиля
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      await brainApi.put('/auth/profile', {
        full_name: fullName,
        company,
        phone,
      });
      setSuccess('Профиль сохранён');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  // Смена пароля
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      await brainApi.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccess('Пароль изменён');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка смены пароля');
    } finally {
      setSaving(false);
    }
  };

  // Выход
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Refresh токена
  const handleRefreshToken = async () => {
    try {
      const response = await brainApi.post('/auth/refresh');
      localStorage.setItem('auth_token', response.data.access_token);
      setSuccess('Токен обновлён');
    } catch (err) {
      setError('Не удалось обновить токен');
    }
  };

  const roleLabels: Record<string, string> = {
    admin: 'Администратор',
    manager: 'Менеджер',
    user: 'Пользователь',
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    manager: 'bg-blue-100 text-blue-700',
    user: 'bg-gray-100 text-gray-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Профиль</h1>
            <p className="text-sm text-gray-500">Управление аккаунтом</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      {success && (
        <div className="mx-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Avatar & Role */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold">{profile?.full_name || 'Пользователь'}</p>
              <p className="text-gray-500">{profile?.email}</p>
              <span className={cn(
                "inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium",
                roleColors[profile?.role || 'user']
              )}>
                <Shield className="w-3.5 h-3.5 inline mr-1" />
                {roleLabels[profile?.role || 'user']}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Личные данные
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Иванов Иван Иванович"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building2 className="w-4 h-4 inline mr-1" />
                Компания
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ТОО 'Моя компания'"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+7 700 123 4567"
              />
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              {saving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Сохранить
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-500" />
            Безопасность
          </h3>
          
          {!showChangePassword ? (
            <div className="space-y-3">
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Изменить пароль
              </button>
              
              <button
                onClick={handleRefreshToken}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Обновить токен доступа
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Текущий пароль"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Новый пароль"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Подтвердите новый пароль"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Отмена
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium"
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Выйти из аккаунта
        </button>

        {/* Info */}
        <div className="text-center text-sm text-gray-400">
          <p>Аккаунт создан: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ru-RU') : '—'}</p>
        </div>
      </div>
    </div>
  );
}
