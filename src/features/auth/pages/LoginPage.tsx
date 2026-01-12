import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, LogIn, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            // TODO: Заменить на реальный API вызов
            // const response = await authApi.post('/auth/login', { email, password })
            // localStorage.setItem('auth_token', response.data.token)

            // Временная заглушка для разработки
            if (email && password) {
                localStorage.setItem('auth_token', 'demo-token-12345')
                navigate('/')
            } else {
                setError('Введите email и пароль')
            }
        } catch (err) {
            setError('Неверный email или пароль')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <Package className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Procurement System</CardTitle>
                    <CardDescription>
                        Войдите в систему управления закупками
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@company.ru"
                                className="mt-1"
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Пароль</label>
                            <div className="relative mt-1">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pr-10"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Вход...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Войти
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>Демо-доступ: любой email и пароль</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
