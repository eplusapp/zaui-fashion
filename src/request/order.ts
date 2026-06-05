import { Order, OrderProduct, PromotionResponse } from "@/types/order";
import { atom } from "jotai";
import { atomWithStorage, unwrap } from "jotai/utils";
import { nativeStorage } from "zmp-sdk/apis";
import { requestWithFallback } from "@/utils/request";
import { buyNowState, cartState } from "./cart";

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

 

export const promotionState = atom(async (get) => {
  const cart = get(cartState);
  const buyNowItem = get(buyNowState);
  const items = buyNowItem ? [buyNowItem] : cart.items;


  if (!items.length) {
    return null;
  }

  return requestWithFallback<PromotionResponse | null>(
    "/api/order/get-cost-order",
    null,
    {
      method: "POST",
      body: JSON.stringify({
        source: "web",
        payment_status: "open",
        customer_fullname: "TESTING",
        customer_phone: "0905191395",
        address_type: "pickup",
        customer_address: "sousth",
        pickup_address: {
          address: "148 Hoàng Hoa Thám",
          province_id: "79",
          province_name: "Thành Phố Hồ Chí Minh",
          ward_id: "26983",
          ward_name: "Phường Bảy Hiền",
        },
        payment_type: "recieve",
        province_id: "79",
        province_name: "Thành Phố Hồ Chí Minh",
        ward_id: "26983",
        ward_name: "Phường Bảy Hiền",
        warehouse: "south",
        isTaxIssued: false,
        receiver_fullname: "TESTING",
        receiver_phone: "0905191395",
        shipping_type: "eco",
        vouchers: [],
        products: items.map((item) => ({
          id: item.product?.id,
          product_code: item.product?.product_code,
          product_type: item.product?.product_type ?? "sale",
          quantity: item.quantity,
          comboProducts: [],
          promotion_id: null,
          estimated_point: null,
          autoReplen: "",
        })),
      }),
    },
  );
});

export const promotionDataState = unwrap(
  promotionState,
  (prev) => prev ?? null,
);
