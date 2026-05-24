export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: { Tables: { products: { Row: Product; Insert: any; Update: any }; categories: { Row: Category; Insert: any; Update: any }; product_images: { Row: ProductImage; Insert: any; Update: any }; product_sizes: { Row: ProductSize; Insert: any; Update: any } } }
}

export interface Product {
  id: string; name: string; slug: string; description: string | null; price: number; original_price: number | null; category_id: string; stock: number; is_active: boolean; is_featured: boolean; is_new: boolean; views: number; tags: string[]; created_at: string; updated_at: string; category?: Category; images?: ProductImage[]; sizes?: ProductSize[]
}

export interface ProductImage {
  id: string; product_id: string; url: string; alt: string | null; sort_order: number; is_primary: boolean; created_at: string
}

export interface ProductSize {
  id: string; product_id: string; size: string; stock: number
}

export interface Category {
  id: string; name: string; slug: string; description: string | null; icon: string | null; image_url: string | null; sort_order: number; is_active: boolean; created_at: string; product_count?: number
}

export interface CartItem {
  id: string; product_id: string; product_name: string; product_image: string | null; product_slug: string; size: string | null; quantity: number; unit_price: number; stock: number; available_sizes: string[]
}

export interface CartState {
  items: CartItem[]; addItem: (item: Omit<CartItem, 'id'>) => void; removeItem: (id: string) => void; updateQuantity: (id: string, quantity: number) => void; updateSize: (id: string, size: string) => void; clearCart: () => void; getTotalItems: () => number; getTotalPrice: () => number
}