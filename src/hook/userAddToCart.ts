import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { Product } from "@/types/products";
import { CartItem } from "@/types/cart";

import { cartState } from "@/request/cart";

export function useCart() {
  const [cart, setCart] = useAtom(cartState);

  const calculateCart = useCallback((items: CartItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      const price = item.product.discount_price || item.product.original_price;
      return sum + Number(price) * item.quantity;
    }, 0);
    return {
      items,
      totalQuantity,
      totalPrice,
    };
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1, editingCartItemId?: string) => {
      setCart((prev) => {
        const items = [...prev.items];
        const existedIndex = items.findIndex((item) => {
          if (editingCartItemId) {
            return item.id === editingCartItemId;
          }
          return item.product.id === product.id;
        });
        if (existedIndex >= 0) {
          items[existedIndex] = {
            ...items[existedIndex],
            quantity: items[existedIndex].quantity + quantity,
          };
        } else {
          items.push({
            id: String(Date.now()),
            product,
            quantity,
          });
        }

        return calculateCart(items);
      });
    },
    [setCart, calculateCart],
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      setCart((prev) => {
        const items = prev.items.filter((item) => item.id !== cartItemId);
        return calculateCart(items);
      });
    },
    [setCart, calculateCart],
  );

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      setCart((prev) => {
        const items = prev.items
          .map((item) => {
            if (item.id !== cartItemId) {
              return item;
            }
            return {
              ...item,
              quantity,
            };
          })
          .filter((item) => item.quantity > 0);
        return calculateCart(items);
      });
    },
    [setCart, calculateCart],
  );

  const increaseQuantity = useCallback(
    (cartItemId: string) => {
      const item = cart.items.find((item) => item.id === cartItemId);
      if (!item) return;
      updateQuantity(cartItemId, item.quantity + 1);
    },
    [cart.items, updateQuantity],
  );

  const decreaseQuantity = useCallback(
    (cartItemId: string) => {
      const item = cart.items.find((item) => item.id === cartItemId);
      if (!item) return;
      updateQuantity(cartItemId, item.quantity - 1);
    },
    [cart.items, updateQuantity],
  );

  const getCartItem = useCallback(
    (productId: string) => {
      return cart.items.find((item) => item.product.id === productId);
    },
    [cart.items],
  );

  const getProductQuantity = useCallback(
    (productId: string) => {
      return (
        cart.items.find((item) => item.product.id === productId)?.quantity || 0
      );
    },
    [cart.items],
  );

  const isInCart = useCallback(
    (productId: string) => {
      return cart.items.some((item) => item.product.id === productId);
    },
    [cart.items],
  );

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      totalPrice: 0,
      totalQuantity: 0,
    });
  }, [setCart]);

  return {
    cart,

    items: cart.items,
    totalPrice: cart.totalPrice,
    totalQuantity: cart.totalQuantity,

    addToCart,
    removeFromCart,

    updateQuantity,
    increaseQuantity,
    decreaseQuantity,

    getCartItem,
    getProductQuantity,
    isInCart,

    clearCart,
  };
}