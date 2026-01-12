// Бренд/Производитель
export interface Brand {
  id: string;
  name: string;
  logo?: string;
  country?: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  headquarters?: string;
}

// Документ/сертификат товара
export interface ProductDocument {
  type?: 'certificate' | 'manual' | 'datasheet' | 'warranty' | 'passport';
  name: string;
  number?: string;
  url?: string;
  validUntil?: string;
}

// Продукт из каталога - расширенная версия с бесконечными полями
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  fullDescription?: string; // Полное описание с сайта производителя
  price: number;
  oldPrice?: number; // Старая цена (для скидок)
  currency: string;
  imageUrl?: string;
  images?: string[]; // Галерея изображений
  category: string;
  subcategory?: string;
  supplier: string;
  stock: number;
  brand?: Brand;

  // Основные характеристики
  specifications?: Record<string, string | number | boolean>;

  // Технические данные (с сайта производителя)
  technicalData?: Record<string, string | number>;

  // Область применения
  applications?: string[];

  // Преимущества товара
  features?: string[];

  // Комплектация
  includedItems?: string[];

  // Совместимость
  compatibility?: string[];

  // Аналоги и замены
  analogues?: string[];

  // Сопутствующие товары
  relatedProducts?: string[];

  // Физические параметры
  weight?: string;
  netWeight?: string;
  grossWeight?: string;
  dimensions?: string;
  packageDimensions?: string;
  unit?: string;
  unitsPerPackage?: number;
  packagesPerPallet?: number;

  // Условия хранения и транспортировки
  storageConditions?: string;
  shelfLife?: string;
  transportConditions?: string;

  // Нормативы и сертификаты
  gost?: string; // ГОСТ
  tu?: string; // ТУ
  certificates?: ProductDocument[];
  eac?: boolean; // Знак ЕАС

  // Экологические параметры
  ecologyClass?: string;
  recyclable?: boolean;
  hazardClass?: string;

  // Условия покупки
  minOrder?: number;
  multiplicity?: number; // Кратность заказа
  deliveryDays?: number;
  returnPolicy?: string;
  warranty?: string;

  // Рейтинг и отзывы
  rating?: number;
  reviewsCount?: number;

  // SEO и метаданные
  barcode?: string;
  vendorCode?: string; // Артикул производителя
  manufacturerUrl?: string; // Ссылка на страницу товара у производителя

  // Дата обновления информации
  lastUpdated?: string;
  dataSource?: string; // Источник данных (сайт производителя)
}

// Позиция из сметы/документа
export interface EstimateItem {
  id: string;
  originalText: string;
  quantity: number;
  unit: string;
  matchedProduct?: Product;
  matchScore: number;
  alternatives?: Product[];
  status: 'matched' | 'review' | 'manual' | 'pending';
}

// Проект закупки
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'processing' | 'completed';
  itemsCount: number;
  totalAmount?: number;
}

// Ответ от Brain Service (AI matching)
export interface MatchResponse {
  items: EstimateItem[];
  processingTime: number;
  modelVersion: string;
}

// Загрузка документа
export interface UploadResponse {
  documentId: string;
  filename: string;
  itemsExtracted: number;
  status: 'success' | 'error';
}

// Пользователь
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
}

// Auth
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
