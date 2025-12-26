import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: number;
  title: string;
  price: number;
  image?: string;
  description?: string;
  category?: {
    id: number;
    name: string;
  };
}

interface WishlistStore {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) => {
        const { items } = get();
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },
      removeFromWishlist: (productId) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== productId) });
      },
      isInWishlist: (productId) => {
        return !!get().items.find((item) => item.id === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
