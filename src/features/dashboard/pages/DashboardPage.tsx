import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, FolderOpen, Clock, CheckCircle, AlertTriangle, TrendingUp, Camera, History, BarChart3 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { brainApi } from '@/lib/axios'
import { formatPrice } from '@/lib/utils'
import type { Project } from '@/types'

interface DashboardStats {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalItems: number
    matchedItems: number
    pendingItems: number
    totalSavings: number
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
    const { data: stats } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
    })

    const { data: recentProjects } = useQuery({
        queryKey: ['recentProjects'],
        queryFn: fetchRecentProjects,
    })

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
