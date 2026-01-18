import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
    Plus, FolderOpen, Clock, CheckCircle, AlertTriangle, TrendingUp, 
    Camera, History, BarChart3, Users, Building2, Package, ShoppingCart,
    ArrowUpRight, Activity
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { brainApi } from '@/lib/axios'
import { formatPrice } from '@/lib/utils'
import type { Project } from '@/types'

// Типы для дашборда цифрового города
interface DashboardSummary {
    total_users: number
    total_companies: number
    total_orders: number
    total_products: number
    total_revenue: number
    completion_rate: number
}

interface DashboardKPI {
    avg_order_value: number
    avg_rating: number
    verified_companies: number
    active_users: number
    orders_today: number
    orders_this_week: number
    orders_this_month: number
}

interface RecentActivity {
    type: string
    title: string
    description?: string
    time: string
    user_name?: string
    link?: string
}

interface TopPerformer {
    id: string
    name: string
    value: number
    secondary_value?: string
}

interface DashboardData {
    summary: DashboardSummary
    kpi: DashboardKPI
    recent_activity: RecentActivity[]
    orders_by_status: Record<string, number>
    companies_by_type: Record<string, number>
    top_buyers: TopPerformer[]
    top_companies: TopPerformer[]
    popular_products: TopPerformer[]
}

// Legacy типы для совместимости
interface DashboardStats {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalItems: number
    matchedItems: number
    pendingItems: number
    totalSavings: number
}

async function fetchDashboardData(): Promise<DashboardData> {
    const response = await brainApi.get<DashboardData>('/dashboard/')
    return response.data
}

async function fetchDashboardStats(): Promise<DashboardStats> {
    const response = await brainApi.get<DashboardStats>('/dashboard/stats')
    return response.data
}

async function fetchRecentProjects(): Promise<Project[]> {
    const response = await brainApi.get<Project[]>('/projects?limit=5&sort=updatedAt')
    return response.data
}

export function DashboardPage() {
    // Новый дашборд цифрового города
    const { data: dashboardData } = useQuery({
        queryKey: ['dashboardData'],
        queryFn: fetchDashboardData,
        retry: false,
    })

    // Legacy статистика (fallback)
    const { data: stats } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
        enabled: !dashboardData,
    })

    const { data: recentProjects } = useQuery({
        queryKey: ['recentProjects'],
        queryFn: fetchRecentProjects,
    })

    // Если есть данные цифрового города - показываем новый дашборд
    if (dashboardData) {
        return <DigitalCityDashboard data={dashboardData} />
    }

    return (
        <div className="flex flex-col h-full">
            <Header title="Дашборд" />

            <div className="flex-1 p-6 space-y-6">
                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                Всего проектов
                            </CardTitle>
                            <FolderOpen className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats?.totalProjects ?? '—'}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats?.activeProjects ?? 0} активных
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                Обработано позиций
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">
                                {stats?.matchedItems ?? '—'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                из {stats?.totalItems ?? 0} всего
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                Требуют проверки
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-yellow-600">
                                {stats?.pendingItems ?? '—'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">позиций</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                Экономия
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-blue-600">
                                {stats?.totalSavings ? formatPrice(stats.totalSavings) : '—'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">за всё время</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Быстрые действия */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Последние проекты */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Последние проекты</CardTitle>
                            <Link to="/projects">
                                <Button variant="ghost" size="sm">
                                    Все проекты
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentProjects && recentProjects.length > 0 ? (
                                <div className="space-y-3">
                                    {recentProjects.map((project) => (
                                        <Link
                                            key={project.id}
                                            to={`/projects/${project.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FolderOpen className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium">{project.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {project.itemsCount} позиций
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <StatusBadge status={project.status} />
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {new Date(project.updatedAt).toLocaleDateString('ru-RU')}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                    <FolderOpen className="h-12 w-12 text-gray-300 mb-2" />
                                    <p>Нет проектов</p>
                                    <Link to="/projects">
                                        <Button variant="link" className="mt-2">
                                            Создать первый проект
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Быстрые действия */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Быстрые действия</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link to="/snap-order" className="block">
                                <Button className="w-full justify-start bg-green-500 hover:bg-green-600 text-white">
                                    <Camera className="h-4 w-4 mr-2" />
                                    Заказ по фото
                                </Button>
                            </Link>
                            <Link to="/orders" className="block">
                                <Button className="w-full justify-start" variant="outline">
                                    <History className="h-4 w-4 mr-2" />
                                    История заказов
                                </Button>
                            </Link>
                            <Link to="/analytics" className="block">
                                <Button className="w-full justify-start" variant="outline">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Аналитика расходов
                                </Button>
                            </Link>
                            <Link to="/projects" className="block">
                                <Button className="w-full justify-start" variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Новый проект
                                </Button>
                            </Link>
                            <Link to="/catalog" className="block">
                                <Button className="w-full justify-start" variant="outline">
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    Каталог товаров
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: Project['status'] }) {
    switch (status) {
        case 'completed':
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    Завершён
                </span>
            )
        case 'processing':
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                    В работе
                </span>
            )
        default:
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    Черновик
                </span>
            )
    }
}

// === НОВЫЙ ДАШБОРД ЦИФРОВОГО ГОРОДА ===

function DigitalCityDashboard({ data }: { data: DashboardData }) {
    const { summary, kpi, recent_activity, orders_by_status, top_buyers, top_companies, popular_products } = data

    return (
        <div className="flex flex-col h-full">
            <Header title="🏙️ Цифровой Город Закупок" />

            <div className="flex-1 p-6 space-y-6 overflow-auto">
                {/* Главные метрики */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Пользователей"
                        value={summary.total_users}
                        subtitle={`${kpi.active_users} активных`}
                        icon={<Users className="h-4 w-4 text-blue-500" />}
                        color="blue"
                    />
                    <MetricCard
                        title="Компаний"
                        value={summary.total_companies}
                        subtitle={`${kpi.verified_companies} верифицированных`}
                        icon={<Building2 className="h-4 w-4 text-purple-500" />}
                        color="purple"
                    />
                    <MetricCard
                        title="Заказов"
                        value={summary.total_orders}
                        subtitle={`${kpi.orders_today} сегодня`}
                        icon={<ShoppingCart className="h-4 w-4 text-green-500" />}
                        color="green"
                    />
                    <MetricCard
                        title="Выручка"
                        value={formatPrice(summary.total_revenue)}
                        subtitle={`Средний чек: ${formatPrice(kpi.avg_order_value)}`}
                        icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                        color="emerald"
                        isPrice
                    />
                </div>

                {/* KPI карточки */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700">Completion Rate</p>
                                    <p className="text-2xl font-bold text-green-800">{summary.completion_rate}%</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700">Средний рейтинг</p>
                                    <p className="text-2xl font-bold text-blue-800">⭐ {kpi.avg_rating}</p>
                                </div>
                                <Activity className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-amber-700">За неделю</p>
                                    <p className="text-2xl font-bold text-amber-800">{kpi.orders_this_week} заказов</p>
                                </div>
                                <ArrowUpRight className="h-8 w-8 text-amber-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-violet-700">За месяц</p>
                                    <p className="text-2xl font-bold text-violet-800">{kpi.orders_this_month} заказов</p>
                                </div>
                                <BarChart3 className="h-8 w-8 text-violet-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Основной контент */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Последняя активность */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Последняя активность
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recent_activity.slice(0, 6).map((activity, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <ActivityIcon type={activity.type} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{activity.title}</p>
                                            {activity.description && (
                                                <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="h-3 w-3 text-gray-400" />
                                                <span className="text-xs text-gray-400">{activity.time}</span>
                                                {activity.user_name && (
                                                    <span className="text-xs text-blue-600">• {activity.user_name}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Статусы заказов */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Статусы заказов
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <StatusRow label="Завершено" value={orders_by_status.completed || 0} color="green" />
                                <StatusRow label="Доставлено" value={orders_by_status.delivered || 0} color="blue" />
                                <StatusRow label="В пути" value={orders_by_status.shipped || 0} color="indigo" />
                                <StatusRow label="В производстве" value={orders_by_status.in_production || 0} color="yellow" />
                                <StatusRow label="Согласовано" value={orders_by_status.approved || 0} color="purple" />
                                <StatusRow label="Ожидание" value={orders_by_status.pending || 0} color="orange" />
                                <StatusRow label="Черновики" value={orders_by_status.draft || 0} color="gray" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Топ-листы */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Топ покупатели */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                Топ покупатели
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {top_buyers.slice(0, 5).map((buyer, idx) => (
                                    <div key={buyer.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-medium truncate max-w-[140px]">{buyer.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-green-600">{formatPrice(buyer.value)}</p>
                                            {buyer.secondary_value && (
                                                <p className="text-xs text-gray-500">{buyer.secondary_value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Топ компании */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-purple-500" />
                                Топ компании
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {top_companies.slice(0, 5).map((company, idx) => (
                                    <div key={company.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-medium truncate max-w-[140px]">{company.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-amber-600">⭐ {company.value}</p>
                                            {company.secondary_value && (
                                                <p className="text-xs text-gray-500">{company.secondary_value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Популярные товары */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-green-500" />
                                Популярные товары
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {popular_products.slice(0, 5).map((product, idx) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-medium truncate max-w-[140px]">{product.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">{product.value.toLocaleString()}</p>
                                            {product.secondary_value && (
                                                <p className="text-xs text-gray-500">{product.secondary_value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Быстрые действия */}
                <Card>
                    <CardHeader>
                        <CardTitle>Быстрые действия</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/snap-order">
                                <Button className="bg-green-500 hover:bg-green-600">
                                    <Camera className="h-4 w-4 mr-2" />
                                    Заказ по фото
                                </Button>
                            </Link>
                            <Link to="/orders">
                                <Button variant="outline">
                                    <History className="h-4 w-4 mr-2" />
                                    История заказов
                                </Button>
                            </Link>
                            <Link to="/catalog">
                                <Button variant="outline">
                                    <Package className="h-4 w-4 mr-2" />
                                    Каталог товаров
                                </Button>
                            </Link>
                            <Link to="/analytics">
                                <Button variant="outline">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Аналитика
                                </Button>
                            </Link>
                            <Link to="/projects">
                                <Button variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Новый проект
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// === ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ===

function MetricCard({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color,
    isPrice 
}: { 
    title: string
    value: string | number
    subtitle: string
    icon: React.ReactNode
    color: string
    isPrice?: boolean
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <p className={`text-2xl font-bold ${isPrice ? '' : `text-${color}-600`}`}>
                    {value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            </CardContent>
        </Card>
    )
}

function ActivityIcon({ type }: { type: string }) {
    const iconClass = "h-8 w-8 p-2 rounded-full"
    switch (type) {
        case 'order':
            return <ShoppingCart className={`${iconClass} bg-green-100 text-green-600`} />
        case 'payment':
            return <TrendingUp className={`${iconClass} bg-emerald-100 text-emerald-600`} />
        case 'delivery':
            return <Package className={`${iconClass} bg-blue-100 text-blue-600`} />
        case 'user':
            return <Users className={`${iconClass} bg-purple-100 text-purple-600`} />
        case 'review':
            return <CheckCircle className={`${iconClass} bg-yellow-100 text-yellow-600`} />
        case 'shipment':
            return <ArrowUpRight className={`${iconClass} bg-indigo-100 text-indigo-600`} />
        case 'approval':
            return <CheckCircle className={`${iconClass} bg-green-100 text-green-600`} />
        default:
            return <Activity className={`${iconClass} bg-gray-100 text-gray-600`} />
    }
}

function StatusRow({ label, value, color }: { label: string; value: number; color: string }) {
    const total = 847 // Total orders from summary
    const percentage = Math.round((value / total) * 100)
    
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium">{value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full bg-${color}-500 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
