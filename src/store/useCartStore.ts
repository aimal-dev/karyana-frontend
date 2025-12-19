import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  qty: number;
  image?: string;
  sellerId?: number; // to track mixed orders
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  
  // Computed helpers (optional to store or calc on fly)
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setOpen: (open) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addToCart: (newItem) => {
        const currentItems = get().items;
        const existing = currentItems.find((i) => i.productId === newItem.productId);

        if (existing) {
          // If exists, just increment qty
          set({
            items: currentItems.map((i) =>
              i.productId === newItem.productId ? { ...i, qty: i.qty + newItem.qty } : i
            ),
            isOpen: true, // Open cart on add
          });
        } else {
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },

      removeFromCart: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          // If qty 0, remove it
          get().removeFromCart(productId);
          return;
        }
        set({
          items: get().items.map((i) => (i.productId === productId ? { ...i, qty } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0);
      },
    }),
    {
      name: "karyana-cart", // Key in localStorage
    }
  )
);
