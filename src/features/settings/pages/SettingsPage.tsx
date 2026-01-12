import { useState } from 'react'
import { Save, User, Bell, Database, Shield } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function SettingsPage() {
    const [apiUrl, setApiUrl] = useState('http://localhost:8080')
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [autoMatch, setAutoMatch] = useState(true)
    const [matchThreshold, setMatchThreshold] = useState('0.7')

    const handleSave = () => {
        // TODO: Сохранение настроек через API
        localStorage.setItem('settings', JSON.stringify({
            apiUrl,
            notificationsEnabled,
            autoMatch,
            matchThreshold: parseFloat(matchThreshold),
        }))
        alert('Настройки сохранены')
    }

    return (
        <div className="flex flex-col h-full">
            <Header title="Настройки" />

            <div className="flex-1 p-6 space-y-6 max-w-3xl">
                {/* Профиль */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-500" />
                            <CardTitle>Профиль</CardTitle>
                        </div>
                        <CardDescription>Информация о вашей учётной записи</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Имя</label>
                                <Input defaultValue="Администратор" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input defaultValue="admin@company.ru" className="mt-1" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Уведомления */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-gray-500" />
                            <CardTitle>Уведомления</CardTitle>
                        </div>
                        <CardDescription>Настройка оповещений</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm">Получать уведомления о завершении обработки</span>
                        </label>
                    </CardContent>
                </Card>

                {/* AI Matching */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-gray-500" />
                            <CardTitle>AI-подбор товаров</CardTitle>
                        </div>
                        <CardDescription>Настройка интеллектуального подбора</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoMatch}
                                onChange={(e) => setAutoMatch(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm">Автоматически запускать подбор после загрузки</span>
                        </label>

                        <div>
                            <label className="text-sm font-medium">
                                Порог совпадения (0.1 - 1.0)
                            </label>
                            <Input
                                type="number"
                                min="0.1"
                                max="1.0"
                                step="0.1"
                                value={matchThreshold}
                                onChange={(e) => setMatchThreshold(e.target.value)}
                                className="mt-1 w-32"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Товары с совпадением ниже порога будут отмечены для ручной проверки
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* API */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-gray-500" />
                            <CardTitle>Подключение к API</CardTitle>
                        </div>
                        <CardDescription>Настройка бэкенд-сервисов</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <label className="text-sm font-medium">URL API сервера</label>
                            <Input
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                placeholder="http://localhost:8080"
                                className="mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Кнопка сохранения */}
                <div className="flex justify-end">
                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить настройки
                    </Button>
                </div>
            </div>
        </div>
    )
}
