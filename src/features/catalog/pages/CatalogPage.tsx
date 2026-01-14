import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Package, ChevronDown, LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ProductCard } from '@/components/ProductCard'
import { productApi } from '@/lib/axios'
import { mapListItemToProduct } from '@/lib/productMapper'
import type { Product } from '@/types'
import type { ApiPaginatedResponse, ApiProductListItem } from '@/types/api/product'

interface CatalogResponse {
    products: Product[]
    total: number
    page: number
    pageSize: number
}

async function fetchCatalog(params: {
    search?: string
    category?: string
    page?: number
}): Promise<CatalogResponse> {
    const perPage = 20

    if (params.search && params.search.length >= 2) {
        const { data } = await productApi.post<ApiPaginatedResponse<ApiProductListItem>>(
            '/products/search/semantic',
            {
                query: params.search,
                page: params.page || 1,
                per_page: perPage,
            },
        )

        return {
            products: data.data.map(mapListItemToProduct),
            total: data.pagination.total_items,
            page: data.pagination.page,
            pageSize: data.pagination.per_page,
        }
    }

    const { data } = await productApi.get<ApiPaginatedResponse<ApiProductListItem>>('/products', {
        params: {
            page: params.page || 1,
            per_page: perPage,
        },
    })

    return {
        products: data.data.map(mapListItemToProduct),
        total: data.pagination.total_items,
        page: data.pagination.page,
        pageSize: data.pagination.per_page,
    }
}

const categories = [
    'Все категории',
    'Электрика',
    'Сантехника',
    'Стройматериалы',
    'Инструменты',
    'Крепёж',
]

export function CatalogPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Все категории')
    const [page, setPage] = useState(1)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const { data, isLoading } = useQuery({
        queryKey: ['catalog', searchQuery, selectedCategory, page],
        queryFn: () =>
            fetchCatalog({
                search: searchQuery || undefined,
                category: selectedCategory !== 'Все категории' ? selectedCategory : undefined,
                page,
            }),
    })

    return (
        <div className="flex flex-col h-full">
            <Header title="Каталог товаров" />

            <div className="flex-1 p-6 space-y-6">
                {/* Фильтры */}
                <div className="flex gap-4 flex-wrap items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск товаров..."
                            className="pl-10"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="h-10 px-3 pr-8 rounded-md border border-input bg-background text-sm appearance-none cursor-pointer"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Переключатель вида */}
                    <div className="flex gap-1 border rounded-md p-1">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button variant="outline" size="sm">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Фильтры
                    </Button>
                </div>

                {/* Статистика */}
                {data && (
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Найдено: <strong>{data.total}</strong> товаров</span>
                        <span className="text-gray-300">|</span>
                        <span>Средняя заполненность карточек: <strong className="text-green-600">78%</strong></span>
                    </div>
                )}

                {/* Карточки товаров */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                ) : data?.products && data.products.length > 0 ? (
                    <>
                        <div className={
                            viewMode === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                : "flex flex-col gap-4"
                        }>
                            {data.products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={(p) => console.log('Add to cart:', p.id)}
                                    onViewDetails={(p) => console.log('View details:', p.id)}
                                />
                            ))}
                        </div>

                        {/* Пагинация */}
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Показано {data.products.length} из {data.total} товаров
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Назад
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={data.products.length < (data.pageSize || 20)}
                                >
                                    Далее
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64">
                            <Package className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">Товары не найдены</p>
                            {searchQuery && (
                                <Button variant="link" onClick={() => setSearchQuery('')}>
                                    Сбросить поиск
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
