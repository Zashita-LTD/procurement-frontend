// Расширенные типы для пользователей цифрового города

export interface FamilyMember {
  name: string;
  relation: 'spouse' | 'child' | 'parent' | 'sibling';
  birthYear?: number;
  occupation?: string;
}

export interface FamilyInfo {
  spouse?: string;
  children?: Array<{
    name: string;
    birth_year: number;
    occupation?: string;
  }>;
}

export interface Education {
  university: string;
  faculty?: string;
  degree?: string;
  graduation_year?: number;
}

export interface WorkExperience {
  company: string;
  position: string;
  from: string;
  to: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  full_name: string;
  
  avatar_url?: string;
  photos?: string[];
  videos?: string[];
  
  phone?: string;
  phone_secondary?: string;
  telegram?: string;
  whatsapp?: string;
  
  country?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  
  birth_date?: string;
  
  role: UserRole;
  permissions?: string[];
  is_active: boolean;
  is_verified: boolean;
  
  family_status?: 'single' | 'married' | 'divorced' | 'widowed';
  children_count?: number;
  family_info?: FamilyInfo;
  
  current_company_id?: string;
  job_title?: string;
  department?: string;
  work_experience?: WorkExperience[];
  
  education?: Education;
  
  hobbies?: string[];
  interests?: string[];
  
  bio?: string;
  achievements?: string[];
  
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  rating: number;
  
  notes?: string;
  tags?: string[];
  
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export type UserRole = 
  | 'primary_admin'
  | 'admin'
  | 'director'
  | 'manager'
  | 'procurement_specialist'
  | 'accountant'
  | 'warehouse_manager'
  | 'worker'
  | 'viewer'
  | 'client';

export interface UserListItem {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  job_title?: string;
  city?: string;
  rating: number;
  total_orders: number;
}

// Расширенные типы для компаний

export type CompanyType = 
  | 'manufacturer'
  | 'supplier'
  | 'distributor'
  | 'contractor'
  | 'client'
  | 'partner';

export interface Branch {
  city: string;
  count: number;
  address?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DeliveryTerms {
  same_day: boolean;
  free_delivery_from?: number;
  delivery_cost?: number;
  express_available?: boolean;
}

export interface PaymentTerms {
  cash: boolean;
  card: boolean;
  invoice: boolean;
  credit: boolean;
  deferred_days?: number;
}

export interface SocialLinks {
  youtube?: string;
  vk?: string;
  telegram?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  short_name?: string;
  legal_name?: string;
  company_type: CompanyType;
  
  description?: string;
  history?: string;
  mission?: string;
  
  logo_url?: string;
  cover_image_url?: string;
  photos?: string[];
  videos?: string[];
  
  website?: string;
  email?: string;
  phone?: string;
  fax?: string;
  
  country?: string;
  region?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  coordinates?: Coordinates;
  
  branches?: Branch[];
  warehouses?: Branch[];
  
  inn?: string;
  kpp?: string;
  ogrn?: string;
  okpo?: string;
  
  bank_details?: Record<string, string>;
  
  founded_year?: number;
  registration_date?: string;
  
  ceo_id?: string;
  management_team?: Array<{
    name: string;
    position: string;
    photo?: string;
  }>;
  
  authorized_capital?: number;
  annual_revenue?: number;
  employee_count?: number;
  
  product_categories?: string[];
  specializations?: string[];
  
  rating: number;
  reviews_count: number;
  total_orders: number;
  total_sales: number;
  
  min_order_amount?: number;
  delivery_terms?: DeliveryTerms;
  payment_terms?: PaymentTerms;
  discount_policy?: Record<string, number>;
  
  licenses?: Array<{
    name: string;
    number: string;
    valid_until?: string;
  }>;
  
  social_links?: SocialLinks;
  
  is_active: boolean;
  is_verified: boolean;
  verification_date?: string;
  
  tags?: string[];
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

export interface CompanyListItem {
  id: string;
  name: string;
  short_name?: string;
  company_type: CompanyType;
  logo_url?: string;
  city?: string;
  rating: number;
  reviews_count: number;
  specializations?: string[];
  is_verified: boolean;
}

// Расширенные типы для заказов

export type OrderStatus = 
  | 'draft'
  | 'pending'
  | 'approved'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id?: string;
  product_id?: string;
  product_sku: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount?: number;
  total: number;
  notes?: string;
}

export interface OrderHistoryEntry {
  id?: string;
  old_status?: string;
  status: string;
  comment?: string;
  changed_by?: string;
  created_at: string;
}

export interface OrderDetail {
  id: string;
  order_number: string;
  user_id: string;
  user_name?: string;
  supplier_id?: string;
  supplier_name?: string;
  
  subtotal: number;
  discount: number;
  delivery_cost: number;
  total: number;
  currency: string;
  
  status: OrderStatus;
  
  delivery_address?: string;
  delivery_date?: string;
  actual_delivery_date?: string;
  tracking_number?: string;
  
  payment_method?: string;
  payment_status?: 'pending' | 'paid' | 'refunded' | 'failed';
  paid_at?: string;
  
  customer_notes?: string;
  internal_notes?: string;
  
  metadata?: Record<string, unknown>;
  
  items?: OrderItem[];
  history?: OrderHistoryEntry[];
  
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface OrderListItem {
  id: string;
  order_number: string;
  status: OrderStatus;
  total: number;
  currency: string;
  items_count: number;
  created_at: string;
  delivery_date?: string;
}

// Статистика

export interface UserStatistics {
  total_users: number;
  active_users: number;
  users_by_role: Record<UserRole, number>;
  users_by_city: Record<string, number>;
  top_buyers: Array<{
    id: string;
    name: string;
    total_orders: number;
    total_spent: number;
  }>;
}

export interface CompanyStatistics {
  total_companies: number;
  manufacturers: number;
  suppliers: number;
  clients: number;
  verified_companies: number;
  total_revenue: number;
  top_rated: Array<{
    id: string;
    name: string;
    company_type: CompanyType;
    rating: number;
    reviews_count: number;
  }>;
}

export interface OrderStatistics {
  total_orders: number;
  completed_orders: number;
  completion_rate: number;
  total_revenue: number;
  avg_order_value: number;
  orders_by_status: Record<OrderStatus, number>;
  monthly_stats: Record<string, {
    count: number;
    revenue: number;
  }>;
}

// Уведомления

export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  read_at?: string;
  link?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Активность

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'login' | 'order' | 'view' | 'edit' | 'comment' | 'upload';
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Категории товаров

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id: string | null;
  products_count: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Карточка товара

export interface ProductImage {
  url: string;
  alt: string;
  is_primary: boolean;
}

export interface ProductCard {
  id: string;
  sku: string;
  name: string;
  short_description: string;
  description?: string;
  
  manufacturer_id: string;
  manufacturer_name: string;
  brand?: string;
  
  category_id: string;
  category_name: string;
  subcategory_id?: string;
  subcategory_name?: string;
  
  price: number;
  price_currency: string;
  price_unit: string;
  old_price?: number;
  discount_percent?: number;
  
  in_stock: boolean;
  stock_quantity?: number;
  min_order_quantity?: number;
  
  images?: ProductImage[];
  
  specifications?: Record<string, string>;
  
  tags?: string[];
  
  rating?: number;
  reviews_count?: number;
  orders_count?: number;
  
  delivery_info?: string;
  warranty_info?: string;
  certification?: string;
  
  related_products?: string[];
  
  seo_title?: string;
  seo_description?: string;
  
  created_at?: string;
  updated_at?: string;
}

export interface ProductListItem {
  id: string;
  sku: string;
  name: string;
  short_description: string;
  manufacturer_name: string;
  category_name: string;
  price: number;
  price_currency: string;
  old_price?: number;
  discount_percent?: number;
  in_stock: boolean;
  image_url?: string;
  rating?: number;
  reviews_count?: number;
}

export interface ProductStatistics {
  total_products: number;
  total_categories: number;
  products_in_stock: number;
  products_on_sale: number;
  avg_rating: number;
  total_reviews: number;
  by_category: Array<{
    category: string;
    count: number;
  }>;
}
