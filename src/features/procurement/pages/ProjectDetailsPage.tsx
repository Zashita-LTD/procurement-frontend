import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { RefreshCw, FileText, Download, BarChart3, List } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UploadZone } from '../components/UploadZone'
import { SmartEstimateTable } from '../components/SmartEstimateTable'
import { ConstructionSchedule } from '@/components/schedule'
import { useEstimateItems } from '../api/useEstimateItems'
import { useMatchProducts } from '../api/useMatchProducts'
import type { Product } from '@/types'

export function ProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [showUpload, setShowUpload] = useState(false)
  const [activeTab, setActiveTab] = useState('materials')
  
  const { data: items, isLoading, refetch } = useEstimateItems(projectId!)
  const matchMutation = useMatchProducts()

  const handleRunMatching = () => {
    matchMutation.mutate({ projectId:  projectId! })
  }

  const handleItemUpdate = (itemId: string, product: Product) => {
    // TODO: API call to update item with selected product
    console.log('Update item', itemId, 'with product', product. id)
    refetch()
  }

  const stats = items ?  {
    total: items.length,
    matched: items.filter(i => i.matchScore >= 0.8).length,
    review: items.filter(i => i.matchScore >= 0.5 && i.matchScore < 0.8).length,
    manual: items.filter(i => i.matchScore < 0.5).length,
  } : null

  // Prepare items for schedule
  const scheduleItems = items?.map(item => ({
    name: item.name || item.originalName,
    quantity: item.quantity || 1,
    unit: item.unit || 'шт',
  })) || []

  return (
    <div className="flex flex-col h-full">
      <Header title="Детали проекта" />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Всего позиций
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats. total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600">
                  Подобраны
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.matched}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-600">
                  На проверку
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">{stats. review}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-600">
                  Не найдены
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">{stats. manual}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={() => setShowUpload(!showUpload)}>
              <FileText className="h-4 w-4 mr-2" />
              {showUpload ? 'Скрыть загрузку' : 'Загрузить документ'}
            </Button>
            <Button
              variant="outline"
              onClick={handleRunMatching}
              disabled={matchMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${matchMutation.isPending ? 'animate-spin' : ''}`} />
              Запустить AI-подбор
            </Button>
          </div>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>

        {/* Upload Zone */}
        {showUpload && (
          <Card>
            <CardHeader>
              <CardTitle>Загрузка документов</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadZone
                projectId={projectId! }
                onUploadComplete={() => {
                  setShowUpload(false)
                  refetch()
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Tabs: Materials / Schedule */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Материалы
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              График строительства
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="mt-4">
            {/* Table */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : items && items.length > 0 ? (
              <SmartEstimateTable items={items} onItemUpdate={handleItemUpdate} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Нет загруженных документов</p>
                  <Button
                    variant="link"
                    onClick={() => setShowUpload(true)}
                    className="mt-2"
                  >
                    Загрузить первый документ
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            {scheduleItems.length > 0 ? (
              <ConstructionSchedule
                projectId={projectId}
                projectName={`Проект ${projectId}`}
                items={scheduleItems}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Загрузите документы для создания графика</p>
                  <Button
                    variant="link"
                    onClick={() => setShowUpload(true)}
                    className="mt-2"
                  >
                    Загрузить документ
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}