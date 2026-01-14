import type { Product, ProductDocument, Brand } from '@/types'
import type {
  ApiAttributeDTO,
  ApiProductDetail,
  ApiProductListItem,
  ApiPriceDTO,
} from '@/types/api/product'

const parsePriceValue = (price?: ApiPriceDTO | null): number => {
  if (!price?.value) {
    return 0
  }
  return typeof price.value === 'number' ? price.value : Number(price.value)
}

const resolveCurrency = (price?: ApiPriceDTO | null): string => {
  return price?.currency || 'RUB'
}

const buildBrand = (value?: string | null): Brand | undefined => {
  if (!value) {
    return undefined
  }

  return {
    id: value,
    name: value,
  }
}

const mapAttributes = (attributes: ApiAttributeDTO[]): Record<string, string> => {
  if (!attributes?.length) {
    return {}
  }

  return attributes.reduce<Record<string, string>>((acc, attr) => {
    if (!attr.name || !attr.value) {
      return acc
    }

    const value = attr.unit ? `${attr.value} ${attr.unit}` : attr.value
    acc[attr.name] = value
    return acc
  }, {})
}

export const mapListItemToProduct = (item: ApiProductListItem): Product => {
  const priceValue = parsePriceValue(item.price)

  return {
    id: item.uuid,
    sku: item.sku || item.uuid,
    name: item.name_technical,
    description: 'Описание появится после обогащения',
    price: priceValue,
    currency: resolveCurrency(item.price),
    category: item.category?.name || 'Категория не указана',
    supplier: item.source_name || 'Неизвестный поставщик',
    stock: 0,
    brand: buildBrand(item.brand),
    lastUpdated: item.created_at,
    dataSource: item.source_name || undefined,
    imageUrl: item.image_url || undefined,
    images: item.image_url ? [item.image_url] : [],
    features: [],
    specifications: {},
    technicalData: {},
    applications: [],
    relatedProducts: [],
    certificates: [],
  }
}

export const mapDetailToProduct = (detail: ApiProductDetail): Product => {
  const priceValue = parsePriceValue(detail.price)

  const images = detail.images?.map((img) => img.url).filter(Boolean) || []
  const certificates: ProductDocument[] = detail.documents?.map((doc) => ({
    name: doc.title,
    type: doc.type as ProductDocument['type'],
    url: doc.url,
  })) || []

  return {
    id: detail.uuid,
    sku: detail.sku || detail.uuid,
    name: detail.name_technical,
    description: detail.description || 'Описание появится после обогащения',
    price: priceValue,
    currency: resolveCurrency(detail.price),
    category: detail.category?.name || 'Категория не указана',
    supplier: detail.source?.name || 'Неизвестный поставщик',
    stock: detail.availability?.quantity || (detail.availability?.in_stock ? 1 : 0) || 0,
    images,
    imageUrl: images[0],
    certificates,
    brand: buildBrand(detail.brand),
    specifications: mapAttributes(detail.attributes),
    technicalData: {},
    applications: [],
    relatedProducts: [],
    unit: detail.price?.unit,
    dataSource: detail.source?.url,
    lastUpdated: detail.updated_at,
    rating: undefined,
    reviewsCount: undefined,
  }
}
