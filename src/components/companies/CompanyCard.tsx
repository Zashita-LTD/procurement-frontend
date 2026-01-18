/**
 * CompanyCard - Карточка компании с выделением системных данных
 * 
 * Если компания - системные seed-данные, карточка отображается
 * с красной рамкой и бейджем "SEED DATA" (видно только супер-админу)
 */
import { 
    Building2, 
    Mail, 
    Phone, 
    Globe, 
    MapPin, 
    Star, 
    ShoppingCart,
    Shield,
    Eye,
    Lock,
    AlertTriangle,
    Users,
    CheckCircle,
    Factory,
    Truck,
    Briefcase
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

// Типы компании
export interface CompanyCardData {
    id: string
    name: string
    short_name?: string
    legal_name?: string
    company_type: string
    description?: string
    logo_url?: string
    website?: string
    email?: string
    phone?: string
    city?: string
    address?: string
    inn?: string
    rating?: number
    reviews_count?: number
    total_orders?: number
    total_sales?: number
    employee_count?: number
    is_verified?: boolean
    // Маркеры системных данных
    is_system_data?: boolean
    is_public?: boolean
    data_source?: string
    visibility?: string
}

interface CompanyCardProps {
    company: CompanyCardData
    isSuperAdmin?: boolean
    onClick?: () => void
    compact?: boolean
}

// Иконка типа компании
function CompanyTypeIcon({ type }: { type: string }) {
    const iconClass = "h-5 w-5"
    switch (type) {
        case 'manufacturer':
            return <Factory className={`${iconClass} text-blue-600`} />
        case 'supplier':
            return <Truck className={`${iconClass} text-green-600`} />
        case 'distributor':
            return <Truck className={`${iconClass} text-purple-600`} />
        case 'contractor':
            return <Briefcase className={`${iconClass} text-orange-600`} />
        case 'client':
            return <Users className={`${iconClass} text-indigo-600`} />
        default:
            return <Building2 className={`${iconClass} text-gray-600`} />
    }
}

// Перевод типа компании
function translateCompanyType(type: string): string {
    const types: Record<string, string> = {
        'manufacturer': 'Производитель',
        'supplier': 'Поставщик',
        'distributor': 'Дистрибьютор',
        'contractor': 'Подрядчик',
        'client': 'Клиент',
        'partner': 'Партнёр'
    }
    return types[type] || type
}

// Цвет типа компании
function getTypeBadgeColor(type: string): string {
    switch (type) {
        case 'manufacturer':
            return 'bg-blue-100 text-blue-700'
        case 'supplier':
            return 'bg-green-100 text-green-700'
        case 'distributor':
            return 'bg-purple-100 text-purple-700'
        case 'contractor':
            return 'bg-orange-100 text-orange-700'
        case 'client':
            return 'bg-indigo-100 text-indigo-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

export function CompanyCard({ company, isSuperAdmin = false, onClick, compact = false }: CompanyCardProps) {
    const isSystemData = company.is_system_data === true
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
                    {/* Логотип */}
                    <div className="relative">
                        {company.logo_url ? (
                            <img 
                                src={company.logo_url} 
                                alt={company.name}
                                className="w-10 h-10 rounded object-contain bg-white"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                <CompanyTypeIcon type={company.company_type} />
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
                            <span className="font-medium text-sm truncate">{company.name}</span>
                            {company.is_verified && (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                            {showSystemWarning && (
                                <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-bold rounded">
                                    SEED
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getTypeBadgeColor(company.company_type)}`}>
                                {translateCompanyType(company.company_type)}
                            </span>
                            {company.city && <span>• {company.city}</span>}
                        </div>
                    </div>
                    
                    {/* Рейтинг */}
                    {company.rating && (
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{company.rating.toFixed(1)}</span>
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
                    {/* Логотип */}
                    <div className="relative">
                        {company.logo_url ? (
                            <img 
                                src={company.logo_url} 
                                alt={company.name}
                                className={`w-16 h-16 rounded object-contain bg-white border ${showSystemWarning ? 'border-red-300' : 'border-gray-200'}`}
                            />
                        ) : (
                            <div className={`w-16 h-16 rounded bg-gray-100 flex items-center justify-center ${showSystemWarning ? 'ring-2 ring-red-500' : ''}`}>
                                <CompanyTypeIcon type={company.company_type} />
                            </div>
                        )}
                        {company.is_verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                        )}
                    </div>
                    
                    {/* Основная информация */}
                    <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {company.name}
                            {showSystemWarning && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded flex items-center gap-1">
                                    <Lock className="h-2.5 w-2.5" />
                                    SEED DATA
                                </span>
                            )}
                        </CardTitle>
                        
                        {company.legal_name && company.legal_name !== company.name && (
                            <p className="text-xs text-gray-500 mt-0.5">{company.legal_name}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeBadgeColor(company.company_type)}`}>
                                {translateCompanyType(company.company_type)}
                            </span>
                            {company.employee_count && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {company.employee_count} сотр.
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Рейтинг и статистика */}
                    <div className="text-right">
                        {company.rating && (
                            <div className="flex items-center gap-1 text-amber-500 mb-1">
                                <Star className="h-5 w-5 fill-current" />
                                <span className="font-bold">{company.rating.toFixed(1)}</span>
                            </div>
                        )}
                        {company.reviews_count && (
                            <div className="text-xs text-gray-500">
                                {company.reviews_count} отзывов
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            
            <CardContent>
                {/* Описание */}
                {company.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{company.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* Email */}
                    {company.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{company.email}</span>
                        </div>
                    )}
                    
                    {/* Телефон */}
                    {company.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{company.phone}</span>
                        </div>
                    )}
                    
                    {/* Город */}
                    {company.city && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{company.city}</span>
                        </div>
                    )}
                    
                    {/* Сайт */}
                    {company.website && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                                onClick={e => e.stopPropagation()}
                            >
                                {company.website.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                </div>
                
                {/* Статистика для админов */}
                {typeof company.total_sales === 'number' && company.total_sales > 0 && (
                    <div className={`mt-4 p-3 rounded-lg ${showSystemWarning ? 'bg-red-100' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className={`h-4 w-4 ${showSystemWarning ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className="text-sm text-gray-600">Объём продаж:</span>
                            </div>
                            <span className={`font-bold ${showSystemWarning ? 'text-red-700' : 'text-green-600'}`}>
                                {formatPrice(company.total_sales)}
                            </span>
                        </div>
                        {company.total_orders && (
                            <div className="text-xs text-gray-500 mt-1 text-right">
                                {company.total_orders} заказов
                            </div>
                        )}
                    </div>
                )}
                
                {/* Предупреждение о системных данных */}
                {showSystemWarning && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-red-700">
                                <p className="font-bold">Это тестовые данные (seed)</p>
                                <p>
                                    {company.is_public 
                                        ? 'Компания видна в публичном каталоге, но статистика скрыта от обычных пользователей.'
                                        : 'Обычные пользователи не видят эту компанию.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// Компактный список компаний
export function CompanyList({ 
    companies, 
    isSuperAdmin = false,
    onCompanyClick 
}: { 
    companies: CompanyCardData[]
    isSuperAdmin?: boolean
    onCompanyClick?: (company: CompanyCardData) => void 
}) {
    const systemCompanies = companies.filter(c => c.is_system_data)
    const realCompanies = companies.filter(c => !c.is_system_data)
    
    return (
        <div className="space-y-4">
            {/* Реальные компании */}
            {realCompanies.length > 0 && (
                <div className="space-y-2">
                    {realCompanies.map(company => (
                        <CompanyCard 
                            key={company.id} 
                            company={company} 
                            isSuperAdmin={isSuperAdmin}
                            onClick={() => onCompanyClick?.(company)}
                            compact
                        />
                    ))}
                </div>
            )}
            
            {/* Системные компании (только для супер-админа) */}
            {isSuperAdmin && systemCompanies.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 py-2">
                        <div className="h-px flex-1 bg-red-300" />
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            SEED DATA ({systemCompanies.length})
                        </span>
                        <div className="h-px flex-1 bg-red-300" />
                    </div>
                    {systemCompanies.map(company => (
                        <CompanyCard 
                            key={company.id} 
                            company={company} 
                            isSuperAdmin={isSuperAdmin}
                            onClick={() => onCompanyClick?.(company)}
                            compact
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default CompanyCard
