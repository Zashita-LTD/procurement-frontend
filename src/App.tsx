import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProjectsPage } from '@/features/projects/pages/ProjectsPage'
import { ProjectDetailsPage } from '@/features/procurement/pages/ProjectDetailsPage'
import { CatalogPage } from '@/features/catalog/pages/CatalogPage'
import { ProductDetailPage } from '@/features/catalog/pages/ProductDetailPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { HotkeysHelp } from '@/hooks/useHotkeys'

// Простая проверка авторизации
function PrivateRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}

// Глобальные горячие клавиши
function GlobalHotkeys({ onShowHelp }: { onShowHelp: () => void }) {
    const navigate = useNavigate()

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

            // ? — показать помощь (всегда)
            if (event.key === '?' && event.shiftKey) {
                event.preventDefault()
                onShowHelp()
                return
            }

            // / — фокус на поиск
            if (event.key === '/' && !isTyping) {
                event.preventDefault()
                const searchInput = document.querySelector('input[placeholder*="Поиск"]') as HTMLInputElement
                if (searchInput) {
                    searchInput.focus()
                    searchInput.select()
                }
                return
            }

            // Игнорируем остальные если печатаем
            if (isTyping) return

            // Alt + клавиши навигации
            if (event.altKey) {
                switch (event.key.toLowerCase()) {
                    case 'h':
                        event.preventDefault()
                        navigate('/')
                        break
                    case 'p':
                        event.preventDefault()
                        navigate('/projects')
                        break
                    case 'c':
                        event.preventDefault()
                        navigate('/catalog')
                        break
                    case 's':
                        event.preventDefault()
                        navigate('/settings')
                        break
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [navigate, onShowHelp])

    return null
}

function App() {
    const [showHotkeysHelp, setShowHotkeysHelp] = useState(false)

    return (
        <>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/login" element={<LoginPage />} />

                {/* Защищённые маршруты */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <GlobalHotkeys onShowHelp={() => setShowHotkeysHelp(true)} />
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
                    <Route path="catalog" element={<CatalogPage />} />
                    <Route path="catalog/:id" element={<ProductDetailPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Модалка с горячими клавишами */}
            {showHotkeysHelp && <HotkeysHelp onClose={() => setShowHotkeysHelp(false)} />}
        </>
    )
}

export default App
