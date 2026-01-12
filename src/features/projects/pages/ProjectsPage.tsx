import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FolderOpen, Search, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { brainApi } from '@/lib/axios'
import type { Project } from '@/types'

async function fetchProjects(): Promise<Project[]> {
    const response = await brainApi.get<Project[]>('/projects')
    return response.data
}

async function createProject(data: { name: string; description?: string }): Promise<Project> {
    const response = await brainApi.post<Project>('/projects', data)
    return response.data
}

async function deleteProject(projectId: string): Promise<void> {
    await brainApi.delete(`/projects/${projectId}`)
}

export function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newProjectName, setNewProjectName] = useState('')
    const [newProjectDescription, setNewProjectDescription] = useState('')

    const queryClient = useQueryClient()

    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    })

    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            setIsCreateDialogOpen(false)
            setNewProjectName('')
            setNewProjectDescription('')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        },
    })

    const filteredProjects = projects?.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusBadge = (status: Project['status']) => {
        switch (status) {
            case 'completed':
                return <Badge variant="success">Завершён</Badge>
            case 'processing':
                return <Badge variant="warning">В работе</Badge>
            default:
                return <Badge variant="secondary">Черновик</Badge>
        }
    }

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            createMutation.mutate({
                name: newProjectName,
                description: newProjectDescription || undefined,
            })
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Header title="Проекты" />

            <div className="flex-1 p-6 space-y-6">
                {/* Панель действий */}
                <div className="flex justify-between items-center">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск проектов..."
                            className="pl-10"
                        />
                    </div>

                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Новый проект
                    </Button>
                </div>

                {/* Список проектов */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                ) : filteredProjects && filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Link to={`/projects/${project.id}`}>
                                            <CardTitle className="text-lg hover:text-blue-600 transition-colors cursor-pointer">
                                                {project.name}
                                            </CardTitle>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteMutation.mutate(project.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {project.description && (
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}
                                    <div className="flex justify-between items-center">
                                        {getStatusBadge(project.status)}
                                        <span className="text-sm text-gray-500">
                                            {project.itemsCount} позиций
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Обновлён: {new Date(project.updatedAt).toLocaleDateString('ru-RU')}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64">
                            <FolderOpen className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">Нет проектов</p>
                            <Button
                                variant="link"
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="mt-2"
                            >
                                Создать первый проект
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Диалог создания проекта */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Новый проект</DialogTitle>
                        <DialogDescription>
                            Создайте новый проект для загрузки смет и подбора товаров
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Название проекта *</label>
                            <Input
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="Например: Офисное здание на ул. Ленина"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Описание</label>
                            <Input
                                value={newProjectDescription}
                                onChange={(e) => setNewProjectDescription(e.target.value)}
                                placeholder="Краткое описание проекта"
                                className="mt-1"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Отмена
                            </Button>
                            <Button
                                onClick={handleCreateProject}
                                disabled={!newProjectName.trim() || createMutation.isPending}
                            >
                                {createMutation.isPending ? 'Создание...' : 'Создать'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
