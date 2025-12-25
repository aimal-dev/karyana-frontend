import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

export interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  qty: number;
  image?: string;
  sellerId?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  
  setOpen: (open: boolean) => void;
  toggleCart: () => void;
  
  // Sync with backend
  fetchCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQty: (cartItemId: number, qty: number) => Promise<void>;
  clearCart: () => void;
  
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      setOpen: (open) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Fetch cart from backend
      fetchCart: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return; // Don't fetch if not logged in

          set({ isLoading: true });
          const response = await api.get("/cart");
          const cartItems = response.data.cart?.items || [];
          
          // Transform backend cart items to frontend format
          const items: CartItem[] = cartItems.map((item: { 
            id: number; 
            productId: number; 
            qty: number; 
            product: { 
              title: string; 
              price: number; 
              image?: string; 
              sellerId: number 
            } 
          }) => ({
            id: item.id,
            productId: item.productId,
            title: item.product.title,
            price: item.product.price,
            qty: item.qty,
            image: item.product.image,
            sellerId: item.product.sellerId,
          }));
          
          set({ items, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          set({ isLoading: false });
        }
      },

      // Sync local cart to backend
      syncCart: async () => {
         const { items } = get();
         const token = localStorage.getItem("token");
         if (!token || items.length === 0) return;

         // Only sync items that are local (created with Date.now() which is > 1000000000000)
         const localItems = items.filter(item => item.id > 10000000000); // Safety threshold

         if (localItems.length === 0) return;

         try {
           set({ isLoading: true });
           // Promise.all to add all items
           await Promise.all(localItems.map(item => 
              api.post("/cart", { productId: item.productId, qty: item.qty })
           ));
           
           // Re-fetch to get correct IDs
           await get().fetchCart();
         } catch (error) {
           console.error("Sync cart failed:", error);
           set({ isLoading: false });
         }
      },

      // Add to cart (local storage + sync if logged in)
      addToCart: async (newItem) => {
        const currentItems = get().items;
        
        // Optimistic Update
        const existingItemIndex = currentItems.findIndex(
          (item) => item.productId === newItem.productId
        );

        let updatedItems = [...currentItems];
        if (existingItemIndex > -1) {
          updatedItems[existingItemIndex].qty += newItem.qty;
        } else {
          updatedItems.push({ ...newItem, id: Date.now() });
        }
        set({ items: updatedItems, isOpen: true });

        // Backend Sync if logged in
        const token = localStorage.getItem("token");
        if (token) {
           try {
             await api.post("/cart", { productId: newItem.productId, qty: newItem.qty });
             // We don't necessarily need to re-fetch immediately to avoid flicker, 
             // but getting real ID is good practice eventually. 
             // For now, let's leave it optimistic.
             // But to ensure Remove works later, we DO need real IDs.
             // So silencing fetchCart... OR only fetchCart if it was a NEW item.
             await get().fetchCart();
           } catch (err) {
             console.error("Backend add failed", err);
           }
        }
      },
      // Remove from cart (sync with backend)
      removeFromCart: async (cartItemId) => {
        try {
          await api.delete(`/cart/${cartItemId}`);
          
          // Update local state
          set({ items: get().items.filter((i) => i.id !== cartItemId) });
        } catch (error) {
          console.error("Failed to remove from cart:", error);
          throw error;
        }
      },

      // Update quantity (sync with backend)
      updateQty: async (cartItemId, qty) => {
        if (qty <= 0) {
          await get().removeFromCart(cartItemId);
          return;
        }
        
        try {
          await api.put(`/cart/${cartItemId}`, { qty });
          
          // Update local state
          set({
            items: get().items.map((i) => (i.id === cartItemId ? { ...i, qty } : i)),
          });
        } catch (error) {
          console.error("Failed to update cart:", error);
          throw error;
        }
      },

      // Clear cart (local only, backend clears on checkout)
      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0);
      },
    }),
    {
      name: "karyana-cart",
    }
  )
);
