import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Package, ShoppingCart, Heart, Star, ExternalLink,
    ChevronDown, ChevronUp, FileText, Award, Truck,
    Clock, Shield, Info, Box, Layers, CheckCircle2,
    Globe, Barcode, Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
    product: Product
    onAddToCart?: (product: Product) => void
    onViewDetails?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false)
    const [showAllSpecs, setShowAllSpecs] = useState(false)

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(product)
        } else {
            navigate(`/catalog/${product.id}`)
        }
    }

    // Подсчёт заполненности карточки
    const filledFields = Object.entries(product).filter(([_, v]) =>
        v !== undefined && v !== null && v !== '' &&
        !(Array.isArray(v) && v.length === 0) &&
        !(typeof v === 'object' && Object.keys(v).length === 0)
    ).length
    const completeness = Math.min(100, Math.round((filledFields / 30) * 100))

    // Все характеристики
    const allSpecs = {
        ...product.specifications,
        ...product.technicalData,
    }
    const specEntries = Object.entries(allSpecs || {})
    const visibleSpecs = showAllSpecs ? specEntries : specEntries.slice(0, 4)

    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
            {/* Шапка с брендом и источником данных */}
            <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {product.brand?.logo ? (
                        <img
                            src={product.brand.logo}
                            alt={product.brand.name}
                            className="h-5 object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                    ) : product.brand?.name && product.brand.name !== 'Стандарт' ? (
                        <span className="text-xs font-bold text-gray-700">{product.brand.name}</span>
                    ) : null}
                    {product.brand?.country && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                            <Globe className="h-3 w-3" />
                            {product.brand.country}
                        </span>
                    )}
                </div>
                {/* Индикатор заполненности */}
                <div className="flex items-center gap-1" title={`Заполнено ${completeness}%`}>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${completeness > 70 ? 'bg-green-500' : completeness > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${completeness}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-gray-400">{completeness}%</span>
                </div>
            </div>

            {/* Изображение */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-300" />
                    </div>
                )}

                {/* Бейджи */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.brand && product.brand.name !== 'Стандарт' && (
                        <Badge className="bg-blue-600 text-white text-[10px] shadow">
                            {product.brand.name}
                        </Badge>
                    )}
                    {product.oldPrice && product.oldPrice > product.price && (
                        <Badge className="bg-red-500 text-white text-[10px]">
                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                        </Badge>
                    )}
                    {product.eac && (
                        <Badge variant="outline" className="bg-white text-[9px]">ЕАС</Badge>
                    )}
                    {product.gost && (
                        <Badge variant="outline" className="bg-white text-[9px]">ГОСТ</Badge>
                    )}
                </div>

                {/* Галерея миниатюр */}
                {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-center">
                        {product.images.slice(0, 4).map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-gray-400/50" />
                        ))}
                        {product.images.length > 4 && (
                            <span className="text-[10px] text-gray-500">+{product.images.length - 4}</span>
                        )}
                    </div>
                )}

                {/* Кнопки */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full shadow">
                        <Heart className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <CardContent className="p-3 flex-1 flex flex-col">
                {/* Категория и рейтинг */}
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex gap-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5">
                            {product.category}
                        </Badge>
                        {product.subcategory && (
                            <Badge variant="outline" className="text-[10px] px-1.5">
                                {product.subcategory}
                            </Badge>
                        )}
                    </div>
                    {product.rating && (
                        <div className="flex items-center gap-0.5 text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-[11px] text-gray-600 font-medium">
                                {product.rating}
                                {product.reviewsCount && (
                                    <span className="text-gray-400 font-normal"> ({product.reviewsCount})</span>
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* Название */}
                <h3
                    className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight cursor-pointer"
                    onClick={handleViewDetails}
                >
                    {product.name}
                </h3>

                {/* Артикулы */}
                <div className="flex flex-wrap gap-x-2 text-[10px] text-gray-500 mb-2">
                    <span className="flex items-center gap-0.5">
                        <Barcode className="h-3 w-3" />
                        {product.sku}
                    </span>
                    {product.vendorCode && (
                        <span>Произв: {product.vendorCode}</span>
                    )}
                    {product.barcode && (
                        <span>EAN: {product.barcode}</span>
                    )}
                </div>

                {/* Описание */}
                <p className="text-[11px] text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                    {product.description}
                </p>

                {/* Характеристики */}
                {specEntries.length > 0 && (
                    <div className="mb-2 space-y-0.5">
                        {visibleSpecs.map(([key, value]) => (
                            <div key={key} className="flex justify-between text-[10px] py-0.5 border-b border-gray-100 last:border-0">
                                <span className="text-gray-500 truncate mr-2">{key}</span>
                                <span className="font-medium text-gray-700 text-right">{String(value)}</span>
                            </div>
                        ))}
                        {specEntries.length > 4 && (
                            <button
                                onClick={() => setShowAllSpecs(!showAllSpecs)}
                                className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 mt-1"
                            >
                                {showAllSpecs ? (
                                    <>Скрыть <ChevronUp className="h-3 w-3" /></>
                                ) : (
                                    <>Ещё {specEntries.length - 4} характеристик <ChevronDown className="h-3 w-3" /></>
                                )}
                            </button>
                        )}
                    </div>
                )}

                {/* Области применения */}
                {product.applications && product.applications.length > 0 && (
                    <div className="mb-2">
                        <p className="text-[10px] text-gray-500 mb-1">Применение:</p>
                        <div className="flex flex-wrap gap-1">
                            {product.applications.slice(0, 3).map((app, i) => (
                                <span key={i} className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                                    {app}
                                </span>
                            ))}
                            {product.applications.length > 3 && (
                                <span className="text-[9px] text-gray-400">+{product.applications.length - 3}</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Преимущества */}
                {product.features && product.features.length > 0 && (
                    <div className="mb-2">
                        {product.features.slice(0, 2).map((feat, i) => (
                            <div key={i} className="flex items-start gap-1 text-[10px] text-gray-600">
                                <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{feat}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Физические параметры */}
                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 mb-2">
                    {product.weight && (
                        <span className="flex items-center gap-0.5">
                            <Box className="h-3 w-3" /> {product.weight}
                        </span>
                    )}
                    {product.dimensions && (
                        <span className="flex items-center gap-0.5">
                            <Layers className="h-3 w-3" /> {product.dimensions}
                        </span>
                    )}
                    {product.unit && (
                        <span>Ед: {product.unit}</span>
                    )}
                    {product.unitsPerPackage && (
                        <span>В уп: {product.unitsPerPackage} шт</span>
                    )}
                </div>

                {/* Нормативы */}
                {(product.gost || product.tu || product.certificates?.length) && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {product.gost && (
                            <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <FileText className="h-2.5 w-2.5" /> {product.gost}
                            </span>
                        )}
                        {product.tu && (
                            <span className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                                {product.tu}
                            </span>
                        )}
                        {product.certificates?.map((cert, i) => (
                            <span key={i} className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Award className="h-2.5 w-2.5" /> {cert.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Доставка и гарантия */}
                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 mb-2">
                    {product.deliveryDays && (
                        <span className="flex items-center gap-0.5">
                            <Truck className="h-3 w-3" /> {product.deliveryDays} дн.
                        </span>
                    )}
                    {product.warranty && (
                        <span className="flex items-center gap-0.5">
                            <Shield className="h-3 w-3" /> {product.warranty}
                        </span>
                    )}
                    {product.shelfLife && (
                        <span className="flex items-center gap-0.5">
                            <Clock className="h-3 w-3" /> {product.shelfLife}
                        </span>
                    )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Цена */}
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-blue-600">
                                {formatPrice(product.price, product.currency)}
                            </span>
                            {product.oldPrice && product.oldPrice > product.price && (
                                <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(product.oldPrice, product.currency)}
                                </span>
                            )}
                        </div>
                        {product.unit && (
                            <p className="text-[10px] text-gray-400">за {product.unit}</p>
                        )}
                        {product.minOrder && product.minOrder > 1 && (
                            <p className="text-[10px] text-orange-600">Мин. заказ: {product.minOrder} {product.unit || 'шт'}</p>
                        )}
                    </div>
                    <div className="text-right">
                        {product.stock > 0 ? (
                            <span className="text-[11px] text-green-600 font-medium">
                                ✓ {product.stock} {product.unit || 'шт'}
                            </span>
                        ) : (
                            <span className="text-[11px] text-red-500">Под заказ</span>
                        )}
                    </div>
                </div>

                {/* Источник данных */}
                {(product.manufacturerUrl || product.dataSource) && (
                    <div className="flex items-center gap-2 text-[9px] text-gray-400 mb-2">
                        <Globe className="h-3 w-3" />
                        <span>Данные: {product.dataSource || product.brand?.name}</span>
                        {product.lastUpdated && (
                            <span className="flex items-center gap-0.5">
                                <Calendar className="h-2.5 w-2.5" />
                                {new Date(product.lastUpdated).toLocaleDateString('ru')}
                            </span>
                        )}
                    </div>
                )}

                {/* Ссылка на производителя */}
                {product.manufacturerUrl && (
                    <a
                        href={product.manufacturerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-blue-500 hover:underline mb-2"
                    >
                        <ExternalLink className="h-3 w-3" />
                        Страница на сайте {product.brand?.name || 'производителя'}
                    </a>
                )}

                {/* Кнопки */}
                <div className="flex gap-1.5">
                    <Button
                        className="flex-1 h-8 text-xs"
                        size="sm"
                        disabled={product.stock === 0}
                        onClick={() => onAddToCart?.(product)}
                    >
                        <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                        В корзину
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={handleViewDetails}
                        title="Открыть полную карточку товара"
                    >
                        <Info className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* Кнопка открытия полной карточки */}
                <button
                    onClick={handleViewDetails}
                    className="mt-2 text-[11px] text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1 font-medium"
                >
                    Открыть полную карточку →
                </button>

                {/* Развернуть превью */}
                {(product.fullDescription || product.includedItems?.length || product.compatibility?.length) && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-[10px] text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                    >
                        {expanded ? 'Скрыть превью' : 'Показать превью'}
                        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                )}

                {/* Развёрнутый контент */}
                {expanded && (
                    <div className="mt-2 pt-2 border-t space-y-2 text-[11px]">
                        {product.fullDescription && (
                            <div>
                                <p className="font-medium text-gray-700 mb-1">Полное описание:</p>
                                <p className="text-gray-600 leading-relaxed">{product.fullDescription}</p>
                            </div>
                        )}
                        {product.includedItems && product.includedItems.length > 0 && (
                            <div>
                                <p className="font-medium text-gray-700 mb-1">Комплектация:</p>
                                <ul className="list-disc list-inside text-gray-600">
                                    {product.includedItems.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {product.compatibility && product.compatibility.length > 0 && (
                            <div>
                                <p className="font-medium text-gray-700 mb-1">Совместимость:</p>
                                <div className="flex flex-wrap gap-1">
                                    {product.compatibility.map((item, i) => (
                                        <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{item}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {product.storageConditions && (
                            <div>
                                <p className="font-medium text-gray-700 mb-1">Хранение:</p>
                                <p className="text-gray-600">{product.storageConditions}</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
