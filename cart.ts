import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'crypto';
import type { CartItem, CartState } from '@/types';

// On utilise crypto.randomUUID si disponible, sinon fallback
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get();
        // Cherche si même produit + même taille existe déjà
        const existing = items.find(
          (i) => i.product_id === newItem.product_id && i.size === newItem.size
        );

        if (existing) {
          const newQty = Math.min(existing.quantity + newItem.quantity, existing.stock);
          set({
            items: items.map((i) =>
              i.id === existing.id ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { ...newItem, id: generateId() },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        });
      },

      updateSize: (id, size) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, size } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
      },
    }),
    {
      name: 'lbs-cart',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : ({} as Storage)
      ),
    }
  )
);
