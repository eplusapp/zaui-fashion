import { Product } from "./products";

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
}

export type Cart = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
};

export type CartSummary = {
  subtotal: number;
  discounted: number;
  totalDiscount: number;
  shippingFee: number;
  payment: number;
  totalQuantity: number;
};