import { atomWithStorage } from "jotai/utils";
import { zaloStorage } from "./cart";

export interface CheckoutInfo {
  buyer: {
    name: string;
    phone: string;
    email: string;
  };
  receiver: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    address: string;
    province: any | null;
    ward: any | null;
  };
}

const initialCheckoutInfo: CheckoutInfo = {
  buyer: {
    name: "",
    phone: "",
    email: "",
  },
  receiver: {
    name: "",
    phone: "",
    email: "",
  },
  address: {
    address: "",
    province: null,
    ward: null,
  },
};

export const checkoutInfoState = atomWithStorage<CheckoutInfo>(
  "checkout-info",
  initialCheckoutInfo,
  {
    getItem: (key, initialValue) => {
      const value = zaloStorage.getItem(key);
      return value ?? initialValue;
    },

    setItem: (key, value) => {
      zaloStorage.setItem(key, value);
    },

    removeItem: (key) => {
      zaloStorage.removeItem(key);
    },
  },
);
