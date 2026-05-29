import { Order, OrderProduct } from "@/types/order";
import { atom } from "jotai";
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

export const ordersState = atomWithStorage<Order[]>("orders", [], {
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
});

/**
 * Add order
 */
export const addOrderState = atom(null, (get, set, order: Order) => {
  const orders = get(ordersState);

  set(ordersState, [order, ...orders]);
});

/**
 * Remove order
 */
export const removeOrderState = atom(null, (get, set, orderId: string) => {
  const orders = get(ordersState);

  set(
    ordersState,
    orders.filter((order) => order.id !== orderId),
  );
});

/**
 * Clear all orders
 */
export const clearOrdersState = atom(null, (_, set) => {
  set(ordersState, []);
});
