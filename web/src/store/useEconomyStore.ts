import { create } from 'zustand';

export interface EconomyData {
  show: boolean;
}

export interface CategoryData {
  itemName: string;
  label: string;
  sub: string;
  price: number;
  imgUrl: string;
  status: boolean;
}

export interface CartEconomyData {
  itemName: string;
  label: string;
  sub: string;
  price: number;
  imgUrl: string;
  count: number;
}

export interface OpenPriceList {
  show: boolean;
}

export interface EconomyCategoryData {
  category: { [key: string]: CategoryData };
}

interface EconomyStore {
  economyData: EconomyData;
  setEconomyData: (data: EconomyData) => void;

  openPriceList: OpenPriceList;
  setOpenPriceList: (data: OpenPriceList) => void;

  economyCategoryData: EconomyCategoryData;
  setEconomyCategoryData: (data: EconomyCategoryData) => void;

  cartData: CartEconomyData;

  addToCart: (item: CategoryData) => void;
  // removeFromCart: () => void;

  increaseCount: () => void;
  decreaseCount: () => void;

  clearCart: () => void;
  getTotalPrice: () => number;

  closeEconomy: () => void;
  closePriceList: () => void;

  setCount: (count: number) => void;
}

const emptyCart: CartEconomyData = {
  itemName: "",
  label: "",
  sub: "",
  price: 0,
  imgUrl: "",
  count: 0,
};

const useEconomyStore = create<EconomyStore>((set, get) => ({
  economyData: { show: false },
  setEconomyData: (data) => set({ economyData: data }),
  
  openPriceList: { show: false },
  setOpenPriceList: (data) => set({ openPriceList: data }),

  economyCategoryData: { category: {} },
  setEconomyCategoryData: (data) => set({ economyCategoryData: data }),

  cartData: emptyCart,
  

  // -------------------------------------------
  // ADD ITEM (overwrite nếu đã có item)
  // -------------------------------------------
  addToCart: (item) =>
    set((state) => {
      const current = state.cartData;

      // Nếu item giống nhau → tăng count
      if (current.itemName === item.itemName) {
        return {
          cartData: { ...current, count: current.count + 1 },
        };
      }

      // Nếu item khác → overwrite cart
      return {
        cartData: {
          ...item,
          count: 1,
        },
      };
    }),

  // -------------------------------------------
  // REMOVE ITEM
  // -------------------------------------------
  // removeFromCart: () => set({ cartData: emptyCart }),

  // -------------------------------------------
  // INCREASE COUNT
  // -------------------------------------------
  // increaseCount: () =>
  //   set((state) => ({
  //     const newCount = state.cartData.count + 1;
  //     if (newCount <= 0) return { cartData: emptyCart };

  //     cartData: { ...state.cartData, count: state.cartData.count + 1 },
  //   })),

  increaseCount: () =>
    set((state) => {
      const newCount = state.cartData.count + 1;
      return {
        cartData: {
          ...state.cartData,
          count: newCount > 999 ? 999 : newCount
        }
      };
    }),


  // -------------------------------------------
  // DECREASE COUNT (về 0 thì clear luôn)
  // -------------------------------------------
  decreaseCount: () =>
    set((state) => {
      const newCount = state.cartData.count - 1;

      if (newCount <= 0) return { cartData: emptyCart };

      return { cartData: { ...state.cartData, count: newCount } };
    }),

  // -------------------------------------------
  // CLEAR CART
  // -------------------------------------------
  clearCart: () => set({ cartData: emptyCart }),

  // -------------------------------------------
  // GET TOTAL PRICE
  // -------------------------------------------
  getTotalPrice: () => {
    const cart = get().cartData;
    return cart.price * cart.count;
  },

  // -------------------------------------------
  // CLOSE ECONOMY
  // -------------------------------------------
  closeEconomy: () =>
    set({
      economyData: { show: false },
      cartData: emptyCart,
    }),

  closePriceList: () =>
    set({
      openPriceList: { show: false },
    }),

  setCount: (count) =>
    set((state) => {
      if (count <= 0) {
        return { cartData: emptyCart };
      }

      if (!state.cartData.itemName) {
        return { cartData: emptyCart };
      }

      return {
        cartData: {
          ...state.cartData,
          count: count,
        },
      };
    }),

}));

export default useEconomyStore;
