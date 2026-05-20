import { Cart, CartItem } from "@/types/cart";
import { atomWithStorage } from "jotai/utils";
import { nativeStorage } from "zmp-sdk/apis";

const zaloStorage = {
  getItem: (key: string) => {
    try {
      const data = nativeStorage.getItem(key);

      if (!data) return null;

      return JSON.parse(data);
    } catch (error) {
      console.error("Zalo getItem error:", error);
      return null;
    }
  },

  setItem: (key: string, value: any) => {
    try {
      nativeStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Zalo setItem error:", error);
    }
  },

  removeItem: (key: string) => {
    try {
      nativeStorage.setItem(key, "");
    } catch (error) {
      console.error("Zalo removeItem error:", error);
    }
  },
};
export const cartState = atomWithStorage<Cart>(
  "cart",
  {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  },
  {
    getItem: (key, initialValue) => {
      const value = zaloStorage.getItem(key);
      return value !== null ? value : initialValue;
    },

    setItem: (key, value) => {
      zaloStorage.setItem(key, value);
    },

    removeItem: (key) => {
      zaloStorage.removeItem(key);
    },
  },
);

export const buyNowState = atomWithStorage<CartItem | null>("buy-now", null);