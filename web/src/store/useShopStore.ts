import { create } from 'zustand';

export interface ShopData {
  show: boolean;
  labelShopName: string;
  subShop: string;
}

export interface CategoryData {
  itemName: string;
  label: string;
  sub: string;
  price: number;
  imgUrl: string;
}

export interface CartData {
  itemName: string;
  label: string;
  sub: string;
  price: number;
  imgUrl: string;
  count: number;
}

export interface ShopCategoryData {
  category: { [key: string]: CategoryData };
}

export interface CartShopData {
  cart: CartData[];
}

interface ShopStore {
  shopData: ShopData;
  setShopData: (data: ShopData) => void;

  shopCategoryData: ShopCategoryData;
  setShopCategoryData: (data: ShopCategoryData) => void;

  cartData: CartShopData;

  addToCart: (item: CategoryData) => void;
  removeFromCart: (itemName: string) => void;

  increaseCount: (itemName: string) => void;
  decreaseCount: (itemName: string) => void;

  clearCart: () => void;
  getTotalPrice: () => number;

  closeShop: () => void;
}

const useShopStore = create<ShopStore>((set, get) => ({
  shopData: { show: false, labelShopName: '', subShop: '' },
  setShopData: (data) => set({ shopData: data }),

  shopCategoryData: { category: {} },
  setShopCategoryData: (data) => set({ shopCategoryData: data }),

  cartData: { cart: [] },

  closeShop: () => set({ shopData: { show: false, labelShopName: '', subShop: '' }, cartData: { cart: [] } }),

  // -------------------------------------------
  // ADD ITEM TO CART (array version)
  // -------------------------------------------
  addToCart: (item) =>
    set((state) => {
      const cart = [...state.cartData.cart];
      const index = cart.findIndex((c) => c.itemName === item.itemName);

      if (index !== -1) {
        cart[index].count += 1;
      } else {
        cart.push({ ...item, count: 1 });
      }

      return { cartData: { cart } };
    }),

  // -------------------------------------------
  // REMOVE ITEM COMPLETELY
  // -------------------------------------------
  removeFromCart: (itemName) =>
    set((state) => ({
      cartData: {
        cart: state.cartData.cart.filter((item) => item.itemName !== itemName),
      },
    })),

  // -------------------------------------------
  // INCREASE COUNT
  // -------------------------------------------
  increaseCount: (itemName) =>
    set((state) => {
      const cart = state.cartData.cart.map((item) =>
        item.itemName === itemName ? { ...item, count: item.count + 1 } : item
      );
      return { cartData: { cart } };
    }),

  // -------------------------------------------
  // DECREASE COUNT
  // -------------------------------------------
  decreaseCount: (itemName) =>
    set((state) => {
      const cart = state.cartData.cart
        .map((item) =>
          item.itemName === itemName
            ? { ...item, count: item.count - 1 }
            : item
        )
        .filter((item) => item.count > 0);

      return { cartData: { cart } };
    }),

  // -------------------------------------------
  // CLEAR CART
  // -------------------------------------------
  clearCart: () => set({ cartData: { cart: [] } }),

  // -------------------------------------------
  // GET TOTAL PRICE
  // -------------------------------------------
  getTotalPrice: () => {
    const cart = get().cartData.cart;
    return cart.reduce((sum, item) => sum + item.price * item.count, 0);
  },
}));

export default useShopStore;
