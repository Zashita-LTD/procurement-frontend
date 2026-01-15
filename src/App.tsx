import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/features/auth/AuthContext'
import { roleHomePages } from '@/types/roles'

// Layouts
import { MainLayout } from '@/components/layout/MainLayout'
import { PrivateLayout } from '@/components/layout/PrivateLayout'
import { ProLayout } from '@/components/layout/ProLayout'
import { ForemanLayout } from '@/components/layout/ForemanLayout'
import { BuyerLayout } from '@/components/layout/BuyerLayout'
import { ExecutiveLayout } from '@/components/layout/ExecutiveLayout'

// Guards
import { 
  AuthGuard, 
  PrivateGuard, 
  ProGuard, 
  ForemanGuard, 
  BuyerGuard, 
  ExecutiveGuard 
} from '@/components/guards/RoleGuard'

// Auth Pages
import { LoginPage } from '@/features/auth/pages/LoginPage'

// Private User Pages (B2C)
import { PrivateDashboard, WizardPage, AuditPage, InspirationPage } from '@/features/private'

// Pro Worker Pages (SMB)
import { ProProjectsPage, BillsPage, LoyaltyPage } from '@/features/pro'

// Company Pages (B2B)
import { 
  ForemanFeedPage, 
  BuyerOrdersPage, 
  BuyerRequestsPage, 
  BuyerAnalyticsPage, 
  BuyerSuppliersPage, 
  BuyerCatalogPage,
  ExecutiveAnalyticsPage 
} from '@/features/company'

// Legacy Pages (old procurement system)
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProjectsPage } from '@/features/projects/pages/ProjectsPage'
import { ProjectDetailsPage } from '@/features/procurement/pages/ProjectDetailsPage'
import { SnapOrderPage } from '@/features/procurement/pages/SnapOrderPage'
import { OrderHistoryPage } from '@/features/procurement/pages/OrderHistoryPage'
import { ExpensesDashboardPage } from '@/features/analytics/pages/ExpensesDashboardPage'
import { ForecastPage } from '@/features/analytics/pages/ForecastPage'
import { CatalogPage } from '@/features/catalog/pages/CatalogPage'
import { ProductDetailPage } from '@/features/catalog/pages/ProductDetailPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { NotificationSettingsPage } from '@/features/settings/pages/NotificationSettingsPage'
import { ProfilePage } from '@/features/auth/pages/ProfilePage'

import { HotkeysHelp } from '@/hooks/useHotkeys'
import { AgentFAB } from '@/features/agent'

// Компонент для редиректа на правильный дашборд по роли
function RoleBasedRedirect() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(roleHomePages[user.role], { replace: true })
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

// Глобальные горячие клавиши
function GlobalHotkeys({ onShowHelp }: { onShowHelp: () => void }) {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (event.key === '?' && event.shiftKey) {
        event.preventDefault()
        onShowHelp()
        return
      }

      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Поиск"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
        return
      }

      if (isTyping) return

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

function AppRoutes() {
  const [showHotkeysHelp, setShowHotkeysHelp] = useState(false)

  return (
    <>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<LoginPage />} />

        {/* Редирект на дашборд по роли */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <RoleBasedRedirect />
            </AuthGuard>
          }
        />

        {/* ===================== */}
        {/* PRIVATE USER (B2C)    */}
        {/* ===================== */}
        <Route
          path="/private"
          element={
            <PrivateGuard>
              <PrivateLayout />
            </PrivateGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PrivateDashboard />} />
          <Route path="wizard" element={<WizardPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="inspiration" element={<InspirationPage />} />
          <Route path="cart" element={<div className="p-4">Корзина (в разработке)</div>} />
          <Route path="orders" element={<div className="p-4">Мои заказы (в разработке)</div>} />
          <Route path="profile" element={<div className="p-4">Профиль (в разработке)</div>} />
          <Route path="search" element={<div className="p-4">Поиск (в разработке)</div>} />
        </Route>

        {/* ===================== */}
        {/* PRO WORKER (SMB)      */}
        {/* ===================== */}
        <Route
          path="/pro"
          element={
            <ProGuard>
              <ProLayout />
            </ProGuard>
          }
        >
          <Route index element={<Navigate to="projects" replace />} />
          <Route path="projects" element={<ProProjectsPage />} />
          <Route path="projects/new" element={<div className="p-4 text-white">Новый объект (в разработке)</div>} />
          <Route path="projects/:id" element={<div className="p-4 text-white">Детали объекта (в разработке)</div>} />
          <Route path="bills" element={<BillsPage />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
          <Route path="catalog" element={<div className="p-4 text-white">Каталог (в разработке)</div>} />
          <Route path="profile" element={<div className="p-4 text-white">Профиль (в разработке)</div>} />
        </Route>

        {/* ===================== */}
        {/* FOREMAN (B2B)         */}
        {/* ===================== */}
        <Route
          path="/company/foreman"
          element={
            <ForemanGuard>
              <ForemanLayout />
            </ForemanGuard>
          }
        >
          <Route index element={<Navigate to="feed" replace />} />
          <Route path="feed" element={<ForemanFeedPage />} />
          <Route path="objects" element={<div className="p-4 text-white">Объекты (в разработке)</div>} />
          <Route path="team" element={<div className="p-4 text-white">Бригада (в разработке)</div>} />
          <Route path="materials" element={<div className="p-4 text-white">Материалы (в разработке)</div>} />
          <Route path="reports" element={<div className="p-4 text-white">Отчёты (в разработке)</div>} />
          <Route path="settings" element={<div className="p-4 text-white">Настройки (в разработке)</div>} />
        </Route>

        {/* ===================== */}
        {/* BUYER (B2B)           */}
        {/* ===================== */}
        <Route
          path="/company/buyer"
          element={
            <BuyerGuard>
              <BuyerLayout />
            </BuyerGuard>
          }
        >
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<BuyerOrdersPage />} />
          <Route path="requests" element={<BuyerRequestsPage />} />
          <Route path="analytics" element={<BuyerAnalyticsPage />} />
          <Route path="suppliers" element={<BuyerSuppliersPage />} />
          <Route path="catalog" element={<BuyerCatalogPage />} />
          <Route path="settings" element={<div className="p-4">Настройки (в разработке)</div>} />
        </Route>

        {/* ===================== */}
        {/* EXECUTIVE (B2B)       */}
        {/* ===================== */}
        <Route
          path="/company/executive"
          element={
            <ExecutiveGuard>
              <ExecutiveLayout />
            </ExecutiveGuard>
          }
        >
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<ExecutiveAnalyticsPage />} />
          <Route path="finances" element={<div className="p-4">Финансы (в разработке)</div>} />
          <Route path="projects" element={<div className="p-4">Проекты (в разработке)</div>} />
          <Route path="team" element={<div className="p-4">Команда (в разработке)</div>} />
          <Route path="reports" element={<div className="p-4">Отчёты (в разработке)</div>} />
          <Route path="settings" element={<div className="p-4">Настройки (в разработке)</div>} />
        </Route>

        {/* ===================== */}
        {/* LEGACY PROCUREMENT    */}
        {/* ===================== */}
        <Route
          path="/legacy"
          element={
            <AuthGuard>
              <GlobalHotkeys onShowHelp={() => setShowHotkeysHelp(true)} />
              <MainLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
          <Route path="snap-order" element={<SnapOrderPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="analytics" element={<ExpensesDashboardPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:id" element={<ProductDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Модалка с горячими клавишами */}
      {showHotkeysHelp && <HotkeysHelp isOpen={showHotkeysHelp} onClose={() => setShowHotkeysHelp(false)} />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      {/* AI Agent FAB - доступен на всех страницах */}
      <AgentFAB 
        position="bottom-right"
        onBuyProduct={(product) => {
          console.log('Buy product:', product)
          // TODO: Add to cart
        }}
        onPayInvoice={(invoiceId) => {
          console.log('Pay invoice:', invoiceId)
          // TODO: Navigate to payment
        }}
      />
    </AuthProvider>
  )
}

export default App
