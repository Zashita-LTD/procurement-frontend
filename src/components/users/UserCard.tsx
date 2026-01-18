/**
 * UserCard - Карточка пользователя с выделением системных данных
 * 
 * Если пользователь - системные seed-данные, карточка отображается
 * с красной рамкой и бейджем "SEED DATA" (видно только супер-админу)
 */
import { 
    User, 
    Mail, 
    Phone, 
    Building2, 
    MapPin, 
    Star, 
    ShoppingCart,
    Shield,
    Eye,
    Lock,
    AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

// Типы пользователя
export interface UserCardData {
    id: string
    email: string
    first_name: string
    last_name: string
    middle_name?: string
    full_name?: string
    avatar_url?: string
    phone?: string
    telegram?: string
    city?: string
    role: string
    job_title?: string
    department?: string
    rating?: number
    total_orders?: number
    total_spent?: number
    is_active?: boolean
    is_verified?: boolean
    // Маркеры системных данных
    is_system_data?: boolean
    data_source?: string
    visibility?: string
}

interface UserCardProps {
    user: UserCardData
    isSuperAdmin?: boolean
    onClick?: () => void
    compact?: boolean
}

// Получение полного имени
function getFullName(user: UserCardData): string {
    if (user.full_name) return user.full_name
    let name = `${user.last_name} ${user.first_name}`
    if (user.middle_name) name += ` ${user.middle_name}`
    return name.trim()
}

// Получение цвета роли
function getRoleBadgeColor(role: string): string {
    switch (role) {
        case 'primary_admin':
            return 'bg-red-600 text-white'
        case 'admin':
            return 'bg-purple-600 text-white'
        case 'director':
            return 'bg-blue-600 text-white'
        case 'manager':
            return 'bg-green-600 text-white'
        case 'procurement_specialist':
            return 'bg-teal-600 text-white'
        case 'accountant':
            return 'bg-yellow-600 text-white'
        case 'warehouse_manager':
            return 'bg-orange-600 text-white'
        case 'client':
            return 'bg-indigo-600 text-white'
        default:
            return 'bg-gray-500 text-white'
    }
}

// Перевод роли
function translateRole(role: string): string {
    const roles: Record<string, string> = {
        'primary_admin': 'Супер-админ',
        'admin': 'Администратор',
        'director': 'Директор',
        'manager': 'Менеджер',
        'procurement_specialist': 'Закупщик',
        'accountant': 'Бухгалтер',
        'warehouse_manager': 'Кладовщик',
        'client': 'Клиент',
        'viewer': 'Наблюдатель',
        'worker': 'Работник'
    }
    return roles[role] || role
}

export function UserCard({ user, isSuperAdmin = false, onClick, compact = false }: UserCardProps) {
    const isSystemData = user.is_system_data === true
    const showSystemWarning = isSuperAdmin && isSystemData
    
    // Определяем стили карточки
    const cardClasses = showSystemWarning 
        ? 'border-2 border-red-400 bg-red-50/50 hover:bg-red-50 cursor-pointer transition-all shadow-red-200 shadow-md'
        : 'border border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all'
    
    if (compact) {
        return (
            <div 
                className={`p-3 rounded-lg ${cardClasses}`}
                onClick={onClick}
            >
                <div className="flex items-center gap-3">
                    {/* Аватар */}
                    <div className="relative">
                        {user.avatar_url ? (
                            <img 
                                src={user.avatar_url} 
                                alt={getFullName(user)}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                        )}
                        {showSystemWarning && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                                <Eye className="h-2.5 w-2.5 text-white" />
                            </div>
                        )}
                    </div>
                    
                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{getFullName(user)}</span>
                            {showSystemWarning && (
                                <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-bold rounded">
                                    SEED
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getRoleBadgeColor(user.role)}`}>
                                {translateRole(user.role)}
                            </span>
                            {user.city && <span>• {user.city}</span>}
                        </div>
                    </div>
                    
                    {/* Рейтинг */}
                    {user.rating && (
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{user.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Card className={cardClasses} onClick={onClick}>
            {/* Бейдж системных данных */}
            {showSystemWarning && (
                <div className="bg-red-600 text-white px-4 py-2 text-xs font-bold flex items-center gap-2 rounded-t-lg">
                    <Eye className="h-4 w-4" />
                    <span>СИСТЕМНЫЕ ДАННЫЕ (SEED) — Видно только супер-админу</span>
                    <Shield className="h-4 w-4 ml-auto" />
                </div>
            )}
            
            <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                    {/* Аватар */}
                    <div className="relative">
                        {user.avatar_url ? (
                            <img 
                                src={user.avatar_url} 
                                alt={getFullName(user)}
                                className={`w-16 h-16 rounded-full object-cover ${showSystemWarning ? 'ring-2 ring-red-500' : ''}`}
                            />
                        ) : (
                            <div className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ${showSystemWarning ? 'ring-2 ring-red-500' : ''}`}>
                                <User className="h-8 w-8 text-gray-500" />
                            </div>
                        )}
                        {user.is_verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <Shield className="h-3 w-3 text-white" />
                            </div>
                        )}
                    </div>
                    
                    {/* Основная информация */}
                    <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {getFullName(user)}
                            {showSystemWarning && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded flex items-center gap-1">
                                    <Lock className="h-2.5 w-2.5" />
                                    SEED DATA
                                </span>
                            )}
                        </CardTitle>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                {translateRole(user.role)}
                            </span>
                            {user.job_title && (
                                <span className="text-xs text-gray-500">• {user.job_title}</span>
                            )}
                        </div>
                    </div>
                    
                    {/* Рейтинг и статистика */}
                    <div className="text-right">
                        {user.rating && (
                            <div className="flex items-center gap-1 text-amber-500 mb-1">
                                <Star className="h-5 w-5 fill-current" />
                                <span className="font-bold">{user.rating.toFixed(1)}</span>
                            </div>
                        )}
                        {typeof user.total_orders === 'number' && (
                            <div className="text-xs text-gray-500">
                                {user.total_orders} заказов
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            
            <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* Email */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    
                    {/* Телефон */}
                    {user.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{user.phone}</span>
                        </div>
                    )}
                    
                    {/* Город */}
                    {user.city && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{user.city}</span>
                        </div>
                    )}
                    
                    {/* Отдел */}
                    {user.department && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span>{user.department}</span>
                        </div>
                    )}
                </div>
                
                {/* Статистика для админов */}
                {typeof user.total_spent === 'number' && user.total_spent > 0 && (
                    <div className={`mt-4 p-3 rounded-lg ${showSystemWarning ? 'bg-red-100' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className={`h-4 w-4 ${showSystemWarning ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className="text-sm text-gray-600">Общая сумма закупок:</span>
                            </div>
                            <span className={`font-bold ${showSystemWarning ? 'text-red-700' : 'text-green-600'}`}>
                                {formatPrice(user.total_spent)}
                            </span>
                        </div>
                    </div>
                )}
                
                {/* Предупреждение о системных данных */}
                {showSystemWarning && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-red-700">
                                <p className="font-bold">Это тестовые данные (seed)</p>
                                <p>Обычные пользователи не видят этого пользователя. 
                                Данные используются для демонстрации работы системы.</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// Компактный список пользователей
export function UserList({ 
    users, 
    isSuperAdmin = false,
    onUserClick 
}: { 
    users: UserCardData[]
    isSuperAdmin?: boolean
    onUserClick?: (user: UserCardData) => void 
}) {
    const systemUsers = users.filter(u => u.is_system_data)
    const realUsers = users.filter(u => !u.is_system_data)
    
    return (
        <div className="space-y-4">
            {/* Реальные пользователи */}
            {realUsers.length > 0 && (
                <div className="space-y-2">
                    {realUsers.map(user => (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            isSuperAdmin={isSuperAdmin}
                            onClick={() => onUserClick?.(user)}
                            compact
                        />
                    ))}
                </div>
            )}
            
            {/* Системные пользователи (только для супер-админа) */}
            {isSuperAdmin && systemUsers.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 py-2">
                        <div className="h-px flex-1 bg-red-300" />
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            SEED DATA ({systemUsers.length})
                        </span>
                        <div className="h-px flex-1 bg-red-300" />
                    </div>
                    {systemUsers.map(user => (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            isSuperAdmin={isSuperAdmin}
                            onClick={() => onUserClick?.(user)}
                            compact
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserCard
