import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Package, LogIn, Eye, EyeOff, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth, testUsers } from '@/features/auth/AuthContext'
import { roleDescriptions, roleHomePages } from '@/types/roles'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTestAccounts, setShowTestAccounts] = useState(true)

  const from = (location.state as any)?.from?.pathname || '/'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (success) {
        // Получаем пользователя из testUsers для определения редиректа
        const testUser = testUsers[email.toLowerCase()]
        if (testUser) {
          navigate(roleHomePages[testUser.role], { replace: true })
        } else {
          navigate(from, { replace: true })
        }
      } else {
        setError('Неверный email или пароль')
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка входа')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (testEmail: string) => {
    setEmail(testEmail)
    setPassword('demo123')
    setIsLoading(true)
    
    const success = await login(testEmail, 'demo123')
    if (success) {
      const testUser = testUsers[testEmail.toLowerCase()]
      if (testUser) {
        navigate(roleHomePages[testUser.role], { replace: true })
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">СтройПро</CardTitle>
            <CardDescription>
              Система управления закупками для строительства
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
                  placeholder="email@example.com"
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
          </CardContent>
        </Card>

        {/* Test Accounts */}
        <Card>
          <CardHeader className="py-3">
            <button
              onClick={() => setShowTestAccounts(!showTestAccounts)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Тестовые аккаунты</span>
              </div>
              <span className="text-xs text-gray-400">
                {showTestAccounts ? '▲' : '▼'}
              </span>
            </button>
          </CardHeader>

          {showTestAccounts && (
            <CardContent className="pt-0 space-y-2">
              {Object.entries(testUsers).map(([testEmail, user]) => {
                const roleInfo = roleDescriptions[user.role]
                return (
                  <button
                    key={testEmail}
                    onClick={() => handleQuickLogin(testEmail)}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  >
                    <span className="text-2xl">{roleInfo.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{roleInfo.title}</p>
                      <p className="text-xs text-gray-500 truncate">{testEmail}</p>
                    </div>
                    <span className="text-xs text-gray-400">→</span>
                  </button>
                )
              })}
              
              <p className="text-xs text-center text-gray-400 pt-2">
                Нажмите для быстрого входа
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
