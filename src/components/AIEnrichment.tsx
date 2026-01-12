import { useState } from 'react'
import {
    Sparkles, Search, Loader2, Check,
    Globe, FileText, MessageSquare, Award,
    RefreshCw, Zap, Database, Brain, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface EnrichmentSource {
    name: string
    url: string
    status: 'pending' | 'loading' | 'success' | 'error'
    fieldsFound: number
}

interface EnrichmentResult {
    totalFields: number
    sources: EnrichmentSource[]
    newData: Record<string, string | number | string[]>
}

interface AIEnrichmentProps {
    productName: string
    productSku?: string
    brandName?: string
    onEnrich?: (result: EnrichmentResult) => void
}

export function AIEnrichment({ productName, productSku, brandName, onEnrich }: AIEnrichmentProps) {
    const [isEnriching, setIsEnriching] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentStep, setCurrentStep] = useState('')
    const [sources, setSources] = useState<EnrichmentSource[]>([])
    const [result, setResult] = useState<EnrichmentResult | null>(null)

    // Симуляция процесса AI-обогащения
    const startEnrichment = async () => {
        setIsEnriching(true)
        setProgress(0)
        setResult(null)

        const sourcesToCheck: EnrichmentSource[] = [
            { name: 'Сайт производителя', url: `https://${brandName?.toLowerCase() || 'manufacturer'}.ru`, status: 'pending', fieldsFound: 0 },
            { name: 'Петрович', url: 'https://petrovich.ru', status: 'pending', fieldsFound: 0 },
            { name: 'Леруа Мерлен', url: 'https://leroymerlin.ru', status: 'pending', fieldsFound: 0 },
            { name: 'ГОСТ каталог', url: 'https://gost.ru', status: 'pending', fieldsFound: 0 },
            { name: 'Отзывы Яндекс.Маркет', url: 'https://market.yandex.ru', status: 'pending', fieldsFound: 0 },
        ]

        setSources(sourcesToCheck)

        // Шаг 1: Поиск товара
        setCurrentStep('🔍 Поиск товара в базах данных...')
        setProgress(10)
        await delay(800)

        // Шаг 2: Парсинг сайта производителя
        setCurrentStep(`🌐 Парсинг сайта ${brandName || 'производителя'}...`)
        sourcesToCheck[0].status = 'loading'
        setSources([...sourcesToCheck])
        setProgress(25)
        await delay(1200)
        sourcesToCheck[0].status = 'success'
        sourcesToCheck[0].fieldsFound = 28
        setSources([...sourcesToCheck])

        // Шаг 3: Парсинг маркетплейсов
        setCurrentStep('🛒 Сбор данных с маркетплейсов...')
        sourcesToCheck[1].status = 'loading'
        sourcesToCheck[2].status = 'loading'
        setSources([...sourcesToCheck])
        setProgress(45)
        await delay(1000)
        sourcesToCheck[1].status = 'success'
        sourcesToCheck[1].fieldsFound = 15
        sourcesToCheck[2].status = 'success'
        sourcesToCheck[2].fieldsFound = 12
        setSources([...sourcesToCheck])

        // Шаг 4: Нормативные документы
        setCurrentStep('📋 Поиск сертификатов и ГОСТов...')
        sourcesToCheck[3].status = 'loading'
        setSources([...sourcesToCheck])
        setProgress(65)
        await delay(900)
        sourcesToCheck[3].status = 'success'
        sourcesToCheck[3].fieldsFound = 8
        setSources([...sourcesToCheck])

        // Шаг 5: Отзывы
        setCurrentStep('💬 Сбор отзывов покупателей...')
        sourcesToCheck[4].status = 'loading'
        setSources([...sourcesToCheck])
        setProgress(80)
        await delay(1100)
        sourcesToCheck[4].status = 'success'
        sourcesToCheck[4].fieldsFound = 156
        setSources([...sourcesToCheck])

        // Шаг 6: Анализ и структурирование
        setCurrentStep('🧠 AI анализирует и структурирует данные...')
        setProgress(90)
        await delay(1500)

        // Готово
        setCurrentStep('✅ Карточка обогащена!')
        setProgress(100)

        const enrichmentResult: EnrichmentResult = {
            totalFields: 52,
            sources: sourcesToCheck,
            newData: {
                fullDescription: 'Сгенерировано AI на основе данных производителя',
                technicalData: '12 параметров',
                applications: '6 областей применения',
                features: '8 преимуществ',
                certificates: '3 сертификата',
                reviews: '156 отзывов',
                rating: 4.8,
            }
        }

        setResult(enrichmentResult)
        setIsEnriching(false)
        onEnrich?.(enrichmentResult)
    }

    return (
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Brain className="h-6 w-6" />
                    AI-обогащение карточки товара
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Информация о товаре */}
                <div className="p-3 bg-white rounded-lg border">
                    <p className="text-sm text-gray-500 mb-1">Товар для обогащения:</p>
                    <p className="font-semibold">{productName}</p>
                    {productSku && <p className="text-sm text-gray-500">Артикул: {productSku}</p>}
                    {brandName && (
                        <Badge variant="secondary" className="mt-2">
                            <Globe className="h-3 w-3 mr-1" />
                            {brandName}
                        </Badge>
                    )}
                </div>

                {/* Процесс обогащения */}
                {isEnriching && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <span className="text-sm font-medium">{currentStep}</span>
                        </div>
                        <Progress value={progress} className="h-2" />

                        {/* Источники данных */}
                        <div className="space-y-2 mt-4">
                            <p className="text-xs font-medium text-gray-500 uppercase">Источники данных:</p>
                            {sources.map((source, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-white rounded border">
                                    <div className="flex items-center gap-2">
                                        {source.status === 'pending' && <div className="w-4 h-4 rounded-full bg-gray-200" />}
                                        {source.status === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                                        {source.status === 'success' && <Check className="w-4 h-4 text-green-500" />}
                                        {source.status === 'error' && <div className="w-4 h-4 rounded-full bg-red-500" />}
                                        <span className="text-sm">{source.name}</span>
                                    </div>
                                    {source.status === 'success' && (
                                        <Badge variant="secondary" className="text-xs">
                                            +{source.fieldsFound} {source.fieldsFound > 100 ? 'отзывов' : 'полей'}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Результат */}
                {result && (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                                <Sparkles className="h-5 w-5" />
                                Карточка успешно обогащена!
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Database className="h-4 w-4 text-gray-500" />
                                    <span><strong>{result.totalFields}</strong> полей заполнено</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-gray-500" />
                                    <span><strong>{result.sources.length}</strong> источников</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-gray-500" />
                                    <span><strong>156</strong> отзывов собрано</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-gray-500" />
                                    <span><strong>3</strong> сертификата найдено</span>
                                </div>
                            </div>
                        </div>

                        {/* Что было добавлено */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase">Добавлено AI:</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(result.newData).map(([key, value]) => (
                                    <Badge key={key} variant="outline" className="text-xs">
                                        {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Кнопки */}
                <div className="flex gap-2">
                    {!isEnriching && !result && (
                        <Button onClick={startEnrichment} className="flex-1">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Обогатить карточку с помощью AI
                        </Button>
                    )}
                    {result && (
                        <>
                            <Button onClick={startEnrichment} variant="outline" className="flex-1">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Обновить данные
                            </Button>
                            <Button className="flex-1">
                                <Check className="h-4 w-4 mr-2" />
                                Применить
                            </Button>
                        </>
                    )}
                </div>

                {/* Пояснение */}
                <p className="text-xs text-gray-500 text-center">
                    AI автоматически парсит сайты производителей, маркетплейсы и базы сертификатов
                    для максимально полного заполнения карточки товара
                </p>
            </CardContent>
        </Card>
    )
}

// Компонент для отображения процесса в списке
export function AIEnrichmentStatus({
    status,
    progress,
    fieldsCount
}: {
    status: 'idle' | 'enriching' | 'done'
    progress?: number
    fieldsCount?: number
}) {
    if (status === 'idle') {
        return (
            <Badge variant="outline" className="text-xs text-gray-500">
                <Zap className="h-3 w-3 mr-1" />
                Не обогащено
            </Badge>
        )
    }

    if (status === 'enriching') {
        return (
            <Badge variant="secondary" className="text-xs text-blue-600">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                AI обогащает... {progress}%
            </Badge>
        )
    }

    return (
        <Badge variant="secondary" className="text-xs text-green-600">
            <Sparkles className="h-3 w-3 mr-1" />
            {fieldsCount} полей от AI
        </Badge>
    )
}

// Хелпер
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Схема процесса для документации
export function AIEnrichmentFlow() {
    const steps = [
        { icon: Search, title: 'Поиск', desc: 'Находим товар по названию/артикулу' },
        { icon: Globe, title: 'Парсинг', desc: 'Собираем данные с сайтов производителей' },
        { icon: FileText, title: 'Нормативы', desc: 'Ищем ГОСТы и сертификаты' },
        { icon: MessageSquare, title: 'Отзывы', desc: 'Собираем реальные отзывы' },
        { icon: Brain, title: 'Анализ', desc: 'AI структурирует информацию' },
        { icon: Database, title: 'Сохранение', desc: 'Заполняем 50+ полей карточки' },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Как AI заполняет карточки товаров
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-center">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white mb-2">
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium">{step.title}</p>
                                <p className="text-xs text-gray-500 max-w-[100px]">{step.desc}</p>
                            </div>
                            {i < steps.length - 1 && (
                                <ArrowRight className="h-5 w-5 text-gray-300 mx-2" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
