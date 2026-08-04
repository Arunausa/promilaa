import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Typically variantId
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const MAX_ITEM_QUANTITY = 10;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      
      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === newItem.id);
          const availableStock = newItem.stock ?? 10;
          const maxAllowed = Math.min(MAX_ITEM_QUANTITY, availableStock);

          if (existing) {
            const newQty = Math.min(maxAllowed, existing.quantity + newItem.quantity);
            return {
              items: state.items.map((item) =>
                item.id === newItem.id ? { ...item, quantity: newQty } : item
              ),
            };
          }

          const initialQty = Math.min(maxAllowed, newItem.quantity);
          return { items: [...state.items, { ...newItem, quantity: initialQty }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          const maxAllowed = Math.min(MAX_ITEM_QUANTITY, item?.stock ?? MAX_ITEM_QUANTITY);
          const validQty = Math.min(maxAllowed, Math.max(1, quantity));

          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: validQty } : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'promilaa-cart',
    }
  )
);

// Multi-tab synchronization across open browser windows
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'promilaa-cart') {
      useCartStore.persist.rehydrate();
    }
  });
}
