import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartState } from '@/types';

export const useCartStore = create<CartState>(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.product_id === item.product_id && i.size === item.size);
          if (existingItem) {
            return { items: state.items.map((i) => i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i) };
          }
          return { items: [...state.items, { ...item, id: Math.random().toString(36).slice(2) }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({ items: state.items.map((i) => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i) }));
      },
      updateSize: (id, size) => {
        set((state) => ({ items: state.items.map((i) => i.id === id ? { ...i, size } : i) }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
      },
    }),
    { name: 'lbs-cart-storage', version: 1 }
  )
);