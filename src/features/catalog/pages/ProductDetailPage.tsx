import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Star, ShoppingCart, Heart, Share2, Download,
    ChevronDown, ChevronUp, ChevronRight, Check, X, ExternalLink,
    FileText, Award, Shield, Truck, Clock, Package, Box, Layers,
    ThumbsUp, ThumbsDown, MessageSquare, Camera, Play, Ruler,
    Zap, Thermometer, Wind, Info, AlertTriangle,
    Building2, Globe, Calendar, Barcode, Calculator, Users, Sparkles
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { productApi } from '@/lib/axios'
import { mapDetailToProduct } from '@/lib/productMapper'
import type { Product } from '@/types'
import type { ApiProductDetail } from '@/types/api/product'
import { AIEnrichment, AIEnrichmentFlow } from '@/components/AIEnrichment'

// Типы для отзывов
interface Review {
    id: string
    author: string
    avatar?: string
    rating: number
    date: string
    title: string
    text: string
    pros?: string[]
    cons?: string[]
    photos?: string[]
    helpful: number
    notHelpful: number
    verified: boolean
    purchaseDate?: string
}

// Типы для вопросов
interface Question {
    id: string
    author: string
    date: string
    text: string
    answers: {
        author: string
        date: string
        text: string
        official?: boolean
    }[]
}

// Моковые отзывы
const mockReviews: Review[] = [
    {
        id: 'r1',
        author: 'Александр М.',
        rating: 5,
        date: '2024-01-10',
        title: 'Отличное качество, рекомендую!',
        text: 'Использовал для ремонта квартиры. Ложится ровно, не трескается. Работал слоем 15-20 мм, никаких проблем. Время жизни раствора хватает с запасом.',
        pros: ['Легко наносится', 'Не трескается', 'Экономный расход'],
        cons: ['Цена выше аналогов'],
        helpful: 45,
        notHelpful: 2,
        verified: true,
        purchaseDate: '2023-12-15',
    },
    {
        id: 'r2',
        author: 'Сергей К.',
        rating: 4,
        date: '2024-01-05',
        title: 'Хороший материал для профессионалов',
        text: 'Работаю отделочником 10 лет, Ротбанд использую постоянно. Качество стабильное, главное соблюдать пропорции воды.',
        pros: ['Стабильное качество', 'Быстро схватывается'],
        cons: ['Нужен опыт работы'],
        photos: ['https://example.com/photo1.jpg'],
        helpful: 32,
        notHelpful: 1,
        verified: true,
    },
    {
        id: 'r3',
        author: 'Мария В.',
        rating: 5,
        date: '2023-12-28',
        title: 'Идеально для стен под покраску',
        text: 'После высыхания поверхность получается очень гладкая. Под обои можно даже не шпаклевать.',
        pros: ['Гладкая поверхность', 'Белый цвет'],
        helpful: 28,
        notHelpful: 3,
        verified: false,
    },
]

// Моковые вопросы
const mockQuestions: Question[] = [
    {
        id: 'q1',
        author: 'Иван П.',
        date: '2024-01-08',
        text: 'Можно ли использовать в ванной комнате?',
        answers: [
            {
                author: 'Техподдержка Knauf',
                date: '2024-01-09',
                text: 'Не рекомендуется использовать в помещениях с постоянной влажностью. Для ванных комнат рекомендуем Knauf Унтерпутц или цементные штукатурки.',
                official: true,
            },
        ],
    },
    {
        id: 'q2',
        author: 'Дмитрий С.',
        date: '2024-01-03',
        text: 'Какой расход на 10 м² при толщине 15 мм?',
        answers: [
            {
                author: 'Консультант',
                date: '2024-01-04',
                text: 'При толщине 15 мм расход составит примерно 12.75 кг/м², то есть на 10 м² потребуется около 127.5 кг (примерно 4-5 мешков по 30 кг).',
                official: true,
            },
        ],
    },
]

async function fetchProductDetail(id: string): Promise<Product> {
    const { data } = await productApi.get<ApiProductDetail>(`/${id}`)
    return mapDetailToProduct(data)
}

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'questions' | 'docs'>('description')
    const [activeImage, setActiveImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        features: true,
        applications: true,
        technical: false,
        storage: false,
    })

    const {
        data: product,
        isLoading,
        isError,
    } = useQuery<Product>({
        queryKey: ['product-detail', id],
        queryFn: () => fetchProductDetail(id as string),
        enabled: Boolean(id),
    })

    if (!id) {
        return (
            <div className="flex flex-col h-full">
                <Header title="Товар не найден" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Запрос без идентификатора товара</p>
                        <Button onClick={() => navigate('/catalog')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Вернуться в каталог
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-col h-full">
                <Header title="Загрузка товара" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-gray-500">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                        <p>Загружаем карточку...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (isError || !product) {
        return (
            <div className="flex flex-col h-full">
                <Header title="Товар не найден" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Товар не найден или больше не доступен</p>
                        <Button onClick={() => navigate('/catalog')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Вернуться в каталог
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const images = product.images || [product.imageUrl]
    const allSpecs = { ...product.specifications, ...product.technicalData }

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // Рейтинг по звёздам
    const ratingDistribution = [
        { stars: 5, count: 156, percent: 72 },
        { stars: 4, count: 45, percent: 21 },
        { stars: 3, count: 12, percent: 5 },
        { stars: 2, count: 3, percent: 1 },
        { stars: 1, count: 2, percent: 1 },
    ]

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <Header title={product.name} />

            <div className="flex-1 overflow-auto">
                {/* Хлебные крошки */}
                <div className="bg-white border-b px-6 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <button onClick={() => navigate('/')} className="hover:text-blue-600">Главная</button>
                        <ChevronRight className="h-4 w-4" />
                        <button onClick={() => navigate('/catalog')} className="hover:text-blue-600">Каталог</button>
                        <ChevronRight className="h-4 w-4" />
                        <span className="hover:text-blue-600">{product.category}</span>
                        {product.subcategory && (
                            <>
                                <ChevronRight className="h-4 w-4" />
                                <span className="hover:text-blue-600">{product.subcategory}</span>
                            </>
                        )}
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-gray-900 truncate max-w-[300px]">{product.name}</span>
                    </div>
                </div>

                {/* ====== HERO SECTION ====== */}
                <section className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Галерея изображений */}
                            <div className="space-y-4">
                                {/* Главное изображение */}
                                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                                    {images[activeImage] ? (
                                        <img
                                            src={images[activeImage]}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-8"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="h-32 w-32 text-gray-300" />
                                        </div>
                                    )}

                                    {/* Бейджи */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.oldPrice && product.oldPrice > product.price && (
                                            <Badge className="bg-red-500 text-white">
                                                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                            </Badge>
                                        )}
                                        {product.eac && (
                                            <Badge variant="outline" className="bg-white">ЕАС</Badge>
                                        )}
                                        {product.gost && (
                                            <Badge variant="outline" className="bg-white">ГОСТ</Badge>
                                        )}
                                    </div>

                                    {/* Кнопки */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                        <Button size="icon" variant="secondary" className="rounded-full">
                                            <Heart className="h-5 w-5" />
                                        </Button>
                                        <Button size="icon" variant="secondary" className="rounded-full">
                                            <Share2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Миниатюры */}
                                {images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveImage(i)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-contain bg-gray-50 p-1" />
                                            </button>
                                        ))}
                                        {/* Видео превью */}
                                        <button className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center bg-gray-100">
                                            <Play className="h-8 w-8 text-gray-400" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Информация о товаре */}
                            <div className="space-y-6">
                                {/* Бренд */}
                                {product.brand && product.brand.name !== 'Стандарт' && (
                                    <div className="flex items-center gap-3">
                                        {product.brand.logo && (
                                            <img src={product.brand.logo} alt={product.brand.name} className="h-8" />
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-500">Производитель</p>
                                            <p className="font-semibold">{product.brand.name}</p>
                                        </div>
                                        {product.brand.country && (
                                            <Badge variant="outline" className="ml-auto">
                                                <Globe className="h-3 w-3 mr-1" />
                                                {product.brand.country}
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                {/* Название */}
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                    {product.name}
                                </h1>

                                {/* Рейтинг и отзывы */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                className={`h-5 w-5 ${star <= (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                        <span className="ml-2 font-semibold">{product.rating || 0}</span>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        {product.reviewsCount || 0} отзывов
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('questions')}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        {mockQuestions.length} вопросов
                                    </button>
                                </div>

                                {/* Артикулы */}
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Barcode className="h-4 w-4" />
                                        Арт: {product.sku}
                                    </span>
                                    {product.vendorCode && (
                                        <span>Код произв: {product.vendorCode}</span>
                                    )}
                                    {product.barcode && (
                                        <span>EAN: {product.barcode}</span>
                                    )}
                                </div>

                                {/* Краткое описание */}
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Ключевые характеристики */}
                                {product.specifications && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-500">{key}:</span>
                                                <span className="font-medium">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Цена */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-end gap-4 mb-4">
                                        <div className="text-4xl font-bold text-blue-600">
                                            {formatPrice(product.price, product.currency)}
                                        </div>
                                        {product.oldPrice && product.oldPrice > product.price && (
                                            <div className="text-xl text-gray-400 line-through">
                                                {formatPrice(product.oldPrice, product.currency)}
                                            </div>
                                        )}
                                        {product.unit && (
                                            <div className="text-gray-500 mb-1">за {product.unit}</div>
                                        )}
                                    </div>

                                    {/* Калькулятор количества */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center border rounded-lg">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(product.minOrder || 1, q - (product.multiplicity || 1)))}
                                                className="px-4 py-2 hover:bg-gray-100 text-xl"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(product.minOrder || 1, parseInt(e.target.value) || 1))}
                                                className="w-20 text-center border-x py-2"
                                            />
                                            <button
                                                onClick={() => setQuantity(q => q + (product.multiplicity || 1))}
                                                className="px-4 py-2 hover:bg-gray-100 text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-lg font-semibold">
                                            = {formatPrice(product.price * quantity, product.currency)}
                                        </div>
                                    </div>

                                    {/* Мин заказ */}
                                    {(product.minOrder && product.minOrder > 1) && (
                                        <p className="text-sm text-orange-600 mb-4">
                                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                                            Минимальный заказ: {product.minOrder} {product.unit || 'шт'}
                                        </p>
                                    )}

                                    {/* Наличие */}
                                    <div className="flex items-center gap-2 mb-4">
                                        {product.stock > 0 ? (
                                            <>
                                                <Check className="h-5 w-5 text-green-500" />
                                                <span className="text-green-600 font-medium">
                                                    В наличии: {product.stock} {product.unit || 'шт'}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="h-5 w-5 text-orange-500" />
                                                <span className="text-orange-600 font-medium">Под заказ</span>
                                            </>
                                        )}
                                        {product.deliveryDays && (
                                            <span className="text-gray-500 ml-2">
                                                • Доставка от {product.deliveryDays} дн.
                                            </span>
                                        )}
                                    </div>

                                    {/* Кнопки */}
                                    <div className="flex gap-3">
                                        <Button size="lg" className="flex-1" disabled={product.stock === 0}>
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            В корзину
                                        </Button>
                                        <Button size="lg" variant="outline">
                                            <Calculator className="h-5 w-5 mr-2" />
                                            Калькулятор
                                        </Button>
                                    </div>
                                </div>

                                {/* Доставка и гарантия */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Truck className="h-6 w-6 text-blue-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-sm">Доставка</p>
                                            <p className="text-xs text-gray-500">
                                                {product.deliveryDays ? `от ${product.deliveryDays} дней` : 'Уточняйте'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Shield className="h-6 w-6 text-green-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-sm">Гарантия</p>
                                            <p className="text-xs text-gray-500">{product.warranty || 'По закону'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ====== TABS NAVIGATION ====== */}
                <section className="bg-white border-b sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <nav className="flex gap-1 overflow-x-auto">
                            {[
                                { id: 'description', label: 'Описание', icon: FileText },
                                { id: 'specs', label: 'Характеристики', icon: Ruler },
                                { id: 'reviews', label: `Отзывы (${product.reviewsCount || mockReviews.length})`, icon: MessageSquare },
                                { id: 'questions', label: `Вопросы (${mockQuestions.length})`, icon: Users },
                                { id: 'docs', label: 'Документы', icon: Download },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </section>

                {/* ====== TAB CONTENT ====== */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* ОПИСАНИЕ */}
                    {activeTab === 'description' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                {/* Полное описание */}
                                {product.fullDescription && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Info className="h-5 w-5" />
                                                Подробное описание
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                {product.fullDescription}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Преимущества */}
                                {product.features && product.features.length > 0 && (
                                    <Card>
                                        <CardHeader className="cursor-pointer" onClick={() => toggleSection('features')}>
                                            <CardTitle className="flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <Zap className="h-5 w-5 text-yellow-500" />
                                                    Преимущества
                                                </span>
                                                {expandedSections.features ? <ChevronUp /> : <ChevronDown />}
                                            </CardTitle>
                                        </CardHeader>
                                        {expandedSections.features && (
                                            <CardContent>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {product.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        )}
                                    </Card>
                                )}

                                {/* Области применения */}
                                {product.applications && product.applications.length > 0 && (
                                    <Card>
                                        <CardHeader className="cursor-pointer" onClick={() => toggleSection('applications')}>
                                            <CardTitle className="flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <Building2 className="h-5 w-5 text-blue-500" />
                                                    Области применения
                                                </span>
                                                {expandedSections.applications ? <ChevronUp /> : <ChevronDown />}
                                            </CardTitle>
                                        </CardHeader>
                                        {expandedSections.applications && (
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.applications.map((app, i) => (
                                                        <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                                                            {app}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                )}

                                {/* Технические иконки */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Layers className="h-5 w-5" />
                                            Ключевые параметры
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {product.weight && (
                                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                    <Box className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                                                    <p className="text-sm text-gray-500">Вес</p>
                                                    <p className="font-semibold">{product.weight}</p>
                                                </div>
                                            )}
                                            {product.dimensions && (
                                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                    <Ruler className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                                                    <p className="text-sm text-gray-500">Размеры</p>
                                                    <p className="font-semibold">{product.dimensions}</p>
                                                </div>
                                            )}
                                            {product.specifications?.['Теплопроводность'] && (
                                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                    <Thermometer className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                                                    <p className="text-sm text-gray-500">Теплопроводность</p>
                                                    <p className="font-semibold">{product.specifications['Теплопроводность']}</p>
                                                </div>
                                            )}
                                            {product.specifications?.['Морозостойкость'] && (
                                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                    <Wind className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                                                    <p className="text-sm text-gray-500">Морозостойкость</p>
                                                    <p className="font-semibold">{product.specifications['Морозостойкость']}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Видео */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Play className="h-5 w-5" />
                                            Видео о продукте
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <Play className="h-16 w-16 text-white/50 mx-auto mb-2" />
                                                <p className="text-white/50">Видеообзор от производителя</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Сайдбар */}
                            <div className="space-y-6">
                                {/* Сертификаты */}
                                {(product.certificates?.length || product.gost || product.tu) && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <Award className="h-5 w-5 text-amber-500" />
                                                Сертификаты и нормативы
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {product.gost && (
                                                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm font-medium">{product.gost}</span>
                                                </div>
                                            )}
                                            {product.tu && (
                                                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                                                    <FileText className="h-4 w-4 text-purple-600" />
                                                    <span className="text-sm">{product.tu}</span>
                                                </div>
                                            )}
                                            {product.certificates?.map((cert, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 bg-amber-50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <Award className="h-4 w-4 text-amber-600" />
                                                        <span className="text-sm">{cert.name}</span>
                                                    </div>
                                                    {cert.validUntil && (
                                                        <span className="text-xs text-gray-500">до {cert.validUntil}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Хранение */}
                                {product.storageConditions && (
                                    <Card>
                                        <CardHeader className="cursor-pointer" onClick={() => toggleSection('storage')}>
                                            <CardTitle className="flex items-center justify-between text-base">
                                                <span className="flex items-center gap-2">
                                                    <Box className="h-5 w-5" />
                                                    Хранение
                                                </span>
                                                {expandedSections.storage ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </CardTitle>
                                        </CardHeader>
                                        {expandedSections.storage && (
                                            <CardContent>
                                                <p className="text-sm text-gray-600">{product.storageConditions}</p>
                                                {product.shelfLife && (
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        <Clock className="h-4 w-4 inline mr-1" />
                                                        Срок хранения: {product.shelfLife}
                                                    </p>
                                                )}
                                            </CardContent>
                                        )}
                                    </Card>
                                )}

                                {/* Источник данных */}
                                {(product.manufacturerUrl || product.dataSource) && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <Globe className="h-5 w-5" />
                                                Источник данных
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <p className="text-sm text-gray-600">{product.dataSource}</p>
                                            {product.lastUpdated && (
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Обновлено: {new Date(product.lastUpdated).toLocaleDateString('ru')}
                                                </p>
                                            )}
                                            {product.manufacturerUrl && (
                                                <a
                                                    href={product.manufacturerUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    Страница на сайте производителя
                                                </a>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Совместимость */}
                                {product.compatibility && product.compatibility.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <Layers className="h-5 w-5" />
                                                Совместимые товары
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {product.compatibility.map((item, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm">
                                                        <Check className="h-4 w-4 text-green-500" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ХАРАКТЕРИСТИКИ */}
                    {activeTab === 'specs' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Все характеристики</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <table className="w-full">
                                            <tbody>
                                                {Object.entries(allSpecs).map(([key, value], i) => (
                                                    <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                                                        <td className="py-3 px-4 text-gray-600">{key}</td>
                                                        <td className="py-3 px-4 font-medium text-right">{String(value)}</td>
                                                    </tr>
                                                ))}
                                                {product.weight && (
                                                    <tr className={Object.keys(allSpecs).length % 2 === 0 ? 'bg-gray-50' : ''}>
                                                        <td className="py-3 px-4 text-gray-600">Вес</td>
                                                        <td className="py-3 px-4 font-medium text-right">{product.weight}</td>
                                                    </tr>
                                                )}
                                                {product.dimensions && (
                                                    <tr>
                                                        <td className="py-3 px-4 text-gray-600">Размеры</td>
                                                        <td className="py-3 px-4 font-medium text-right">{product.dimensions}</td>
                                                    </tr>
                                                )}
                                                {product.unit && (
                                                    <tr className="bg-gray-50">
                                                        <td className="py-3 px-4 text-gray-600">Единица измерения</td>
                                                        <td className="py-3 px-4 font-medium text-right">{product.unit}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Чертежи */}
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Ruler className="h-5 w-5" />
                                            Чертежи и схемы
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                            <div className="text-center text-gray-400">
                                                <Ruler className="h-12 w-12 mx-auto mb-2" />
                                                <p className="text-sm">Технический чертёж</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full">
                                            <Download className="h-4 w-4 mr-2" />
                                            Скачать PDF
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* ОТЗЫВЫ */}
                    {activeTab === 'reviews' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Список отзывов */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">Отзывы покупателей</h2>
                                    <Button>
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Написать отзыв
                                    </Button>
                                </div>

                                {mockReviews.map(review => (
                                    <Card key={review.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                                        {review.author[0]}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{review.author}</span>
                                                            {review.verified && (
                                                                <Badge variant="secondary" className="text-[10px]">
                                                                    <Check className="h-3 w-3 mr-1" />
                                                                    Покупка подтверждена
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">{review.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star
                                                            key={star}
                                                            className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <h3 className="font-semibold mb-2">{review.title}</h3>
                                            <p className="text-gray-600 mb-4">{review.text}</p>

                                            {(review.pros || review.cons) && (
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    {review.pros && (
                                                        <div>
                                                            <p className="text-sm font-medium text-green-600 mb-2">Достоинства</p>
                                                            <ul className="space-y-1">
                                                                {review.pros.map((pro, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm">
                                                                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                                        {pro}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {review.cons && (
                                                        <div>
                                                            <p className="text-sm font-medium text-red-600 mb-2">Недостатки</p>
                                                            <ul className="space-y-1">
                                                                {review.cons.map((con, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm">
                                                                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                                                                        {con}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {review.photos && review.photos.length > 0 && (
                                                <div className="flex gap-2 mb-4">
                                                    {review.photos.map((_, i) => (
                                                        <div key={i} className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <Camera className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 pt-4 border-t">
                                                <span className="text-sm text-gray-500">Был полезен?</span>
                                                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    {review.helpful}
                                                </button>
                                                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600">
                                                    <ThumbsDown className="h-4 w-4" />
                                                    {review.notHelpful}
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                <Button variant="outline" className="w-full">
                                    Показать все отзывы
                                </Button>
                            </div>

                            {/* Статистика отзывов */}
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Рейтинг товара</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center mb-6">
                                            <div className="text-5xl font-bold text-blue-600 mb-2">
                                                {product.rating || 4.8}
                                            </div>
                                            <div className="flex items-center justify-center gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        className={`h-6 w-6 ${star <= (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                на основе {product.reviewsCount || mockReviews.length} отзывов
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            {ratingDistribution.map(item => (
                                                <div key={item.stars} className="flex items-center gap-2">
                                                    <span className="w-4 text-sm">{item.stars}</span>
                                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-yellow-400 rounded-full"
                                                            style={{ width: `${item.percent}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-500 w-8">{item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* ВОПРОСЫ */}
                    {activeTab === 'questions' && (
                        <div className="max-w-3xl space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Вопросы о товаре</h2>
                                <Button>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Задать вопрос
                                </Button>
                            </div>

                            {mockQuestions.map(question => (
                                <Card key={question.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">
                                                {question.author[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium">{question.author}</span>
                                                    <span className="text-sm text-gray-500">{question.date}</span>
                                                </div>
                                                <p className="text-gray-900">{question.text}</p>
                                            </div>
                                        </div>

                                        {question.answers.map((answer, i) => (
                                            <div key={i} className="ml-11 p-4 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-medium">{answer.author}</span>
                                                    {answer.official && (
                                                        <Badge className="bg-blue-600 text-white text-[10px]">
                                                            Официальный ответ
                                                        </Badge>
                                                    )}
                                                    <span className="text-sm text-gray-500">{answer.date}</span>
                                                </div>
                                                <p className="text-gray-700">{answer.text}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* ДОКУМЕНТЫ */}
                    {activeTab === 'docs' && (
                        <div className="max-w-3xl">
                            <h2 className="text-xl font-bold mb-6">Документация</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Техническое описание</p>
                                            <p className="text-sm text-gray-500">PDF, 2.3 MB</p>
                                        </div>
                                        <Download className="h-5 w-5 text-gray-400" />
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Award className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Сертификат соответствия</p>
                                            <p className="text-sm text-gray-500">PDF, 1.1 MB</p>
                                        </div>
                                        <Download className="h-5 w-5 text-gray-400" />
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Ruler className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Технический чертёж</p>
                                            <p className="text-sm text-gray-500">DWG, 0.5 MB</p>
                                        </div>
                                        <Download className="h-5 w-5 text-gray-400" />
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Инструкция по применению</p>
                                            <p className="text-sm text-gray-500">PDF, 4.7 MB</p>
                                        </div>
                                        <Download className="h-5 w-5 text-gray-400" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>

                {/* ====== АНАЛОГИ ====== */}
                {product.analogues && product.analogues.length > 0 && (
                    <section className="bg-white border-t py-8">
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-xl font-bold mb-6">Аналоги и альтернативы</h2>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {product.analogues.map((analogue, i) => (
                                    <div key={i} className="flex-shrink-0 w-48 p-4 border rounded-lg">
                                        <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                                            <Package className="h-12 w-12 text-gray-300" />
                                        </div>
                                        <p className="font-medium text-sm line-clamp-2">{analogue}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ====== AI ENRICHMENT SECTION ====== */}
                <section className="bg-gradient-to-r from-purple-50 to-blue-50 border-t py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <Sparkles className="h-6 w-6 text-purple-600" />
                                    Данные заполнены AI
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Карточка этого товара была автоматически обогащена с помощью искусственного интеллекта.
                                    AI собрал данные с сайта производителя, маркетплейсов и базы сертификатов.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                        <Check className="h-3 w-3 mr-1" />
                                        {Object.keys({ ...product.specifications, ...product.technicalData }).length} характеристик
                                    </Badge>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        {product.reviewsCount || 0} отзывов
                                    </Badge>
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                        <Award className="h-3 w-3 mr-1" />
                                        {product.certificates?.length || 0} сертификатов
                                    </Badge>
                                </div>
                                {product.dataSource && (
                                    <p className="text-sm text-gray-500">
                                        <Globe className="h-4 w-4 inline mr-1" />
                                        Источник: {product.dataSource}
                                        {product.lastUpdated && (
                                            <span className="ml-2">
                                                • Обновлено: {new Date(product.lastUpdated).toLocaleDateString('ru')}
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                            <AIEnrichment
                                productName={product.name}
                                productSku={product.sku}
                                brandName={product.brand?.name}
                            />
                        </div>

                        {/* Схема работы AI */}
                        <div className="mt-8">
                            <AIEnrichmentFlow />
                        </div>
                    </div>
                </section>

                {/* ====== FOOTER CTA ====== */}
                <section className="bg-blue-600 text-white py-8">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-2xl font-bold mb-4">Нужна консультация?</h2>
                        <p className="text-blue-100 mb-6">
                            Наши специалисты помогут подобрать оптимальное решение для вашего проекта
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="secondary" size="lg">
                                Заказать звонок
                            </Button>
                            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                                Написать в чат
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
