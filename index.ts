// ============================================
// LBS SHOP — Types TypeScript complets
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ————————————————————————————————————————————
// DATABASE TYPES (miroir Supabase)
// ————————————————————————————————————————————

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: Admin;
        Insert: Omit<Admin, 'id' | 'created_at'>;
        Update: Partial<Omit<Admin, 'id' | 'created_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'views'>;
        Update: Partial<Omit<Product, 'id' | 'created_at'>>;
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, 'id' | 'created_at'>;
        Update: Partial<Omit<ProductImage, 'id' | 'created_at'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      product_sizes: {
        Row: ProductSize;
        Insert: Omit<ProductSize, 'id'>;
        Update: Partial<Omit<ProductSize, 'id'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id'>;
        Update: Partial<Omit<OrderItem, 'id'>>;
      };
      promotions: {
        Row: Promotion;
        Insert: Omit<Promotion, 'id' | 'created_at'>;
        Update: Partial<Omit<Promotion, 'id' | 'created_at'>>;
      };
      settings: {
        Row: Setting;
        Insert: Omit<Setting, 'id' | 'updated_at'>;
        Update: Partial<Omit<Setting, 'id'>>;
      };
      analytics: {
        Row: Analytics;
        Insert: Omit<Analytics, 'id'>;
        Update: Partial<Omit<Analytics, 'id'>>;
      };
    };
  };
}

// ————————————————————————————————————————————
// ENTITÉS
// ————————————————————————————————————————————

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  last_login: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  // computed
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category_id: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  views: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  // relations
  category?: Category;
  images?: ProductImage[];
  sizes?: ProductSize[];
  promotion?: Promotion | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductSize {
  id: string;
  product_id: string;
  size: string;
  stock: number;
}

export interface Promotion {
  id: string;
  name: string;
  description: string | null;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  current_uses: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  product_ids: string[] | null; // null = all products
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_neighborhood: string;
  customer_address: string | null;
  total_amount: number;
  status: OrderStatus;
  whatsapp_sent: boolean;
  notes: string | null;
  created_at: string;
  // relations
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  size: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  // relations
  product?: Product;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  event_type: 'page_view' | 'product_view' | 'add_to_cart' | 'order_created';
  product_id: string | null;
  session_id: string | null;
  created_at: string;
}

// ————————————————————————————————————————————
// CART (client-side, Zustand)
// ————————————————————————————————————————————

export interface CartItem {
  id: string; // unique ID pour ce cart item
  product_id: string;
  product_name: string;
  product_image: string | null;
  product_slug: string;
  size: string | null;
  quantity: number;
  unit_price: number;
  stock: number;
  available_sizes: string[];
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSize: (id: string, size: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// ————————————————————————————————————————————
// FORMS
// ————————————————————————————————————————————

export interface CheckoutForm {
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_neighborhood: string;
  customer_address?: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category_id: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  tags: string[];
  sizes: { size: string; stock: number }[];
}

export interface CategoryForm {
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

export interface PromotionForm {
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
  product_ids?: string[];
}

export interface LoginForm {
  email: string;
  password: string;
}

// ————————————————————————————————————————————
// API RESPONSES
// ————————————————————————————————————————————

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular';
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  has_promotion?: boolean;
}

export interface DashboardStats {
  total_products: number;
  active_products: number;
  out_of_stock: number;
  total_orders: number;
  total_revenue: number;
  total_views: number;
  popular_products: Product[];
  recent_orders: Order[];
  orders_by_status: Record<OrderStatus, number>;
}

// ————————————————————————————————————————————
// UI HELPERS
// ————————————————————————————————————————————

export type SortOption = {
  label: string;
  value: ProductsQuery['sort'];
};

export type FilterState = {
  category: string | null;
  min_price: number | null;
  max_price: number | null;
  in_stock: boolean;
  has_promotion: boolean;
  sort: ProductsQuery['sort'];
};

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  accent_color: string;
}

// ————————————————————————————————————————————
// APP SETTINGS
// ————————————————————————————————————————————

export interface AppSettings {
  whatsapp_number: string;
  shop_name: string;
  shop_tagline: string;
  shop_email: string;
  shop_address: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  delivery_info: string;
  return_policy: string;
  privacy_policy: string;
  banner_slides: BannerSlide[];
  featured_category_ids: string[];
}
