export interface ApiCategoryShort {
  id: number
  name: string
  path: string[]
}

export interface ApiPriceDTO {
  value: string | number
  currency?: string
  unit?: string
  old_value?: string | number | null
}

export interface ApiAttributeDTO {
  name: string
  value: string
  unit?: string | null
}

export interface ApiImageDTO {
  url: string
  alt?: string
  is_main?: boolean
}

export interface ApiDocumentDTO {
  type: string
  title: string
  url: string
}

export interface ApiSourceDTO {
  name?: string
  url?: string
  external_id?: string
}

export interface ApiAvailabilityDTO {
  in_stock: boolean
  quantity?: number | null
  delivery_days?: number | null
}

export interface ApiProductListItem {
  uuid: string
  name_technical: string
  brand?: string | null
  sku?: string | null
  category: ApiCategoryShort
  price?: ApiPriceDTO | null
  image_url?: string | null
  source_name?: string | null
  enrichment_status: string
  quality_score?: number | null
  created_at: string
  similarity?: number | null
}

export interface ApiProductDetail {
  uuid: string
  name_technical: string
  brand?: string | null
  manufacturer?: string | null
  sku?: string | null
  description?: string | null
  category: ApiCategoryShort
  attributes: ApiAttributeDTO[]
  price?: ApiPriceDTO | null
  availability?: ApiAvailabilityDTO | null
  images: ApiImageDTO[]
  documents: ApiDocumentDTO[]
  source: ApiSourceDTO
  enrichment_status: string
  quality_score?: number | null
  created_at: string
  updated_at: string
}

export interface ApiPaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total_items: number
    total_pages: number
  }
}
