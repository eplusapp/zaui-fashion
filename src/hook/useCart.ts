import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

import { Product } from "@/types/products";
import { CartItem, CartSummary } from "@/types/cart";
import toast from "react-hot-toast";
import { buyNowState, cartState } from "@/request/cart";
import { promotionDataState, promotionState } from "@/request/order";

export function useCart() {
  const [cart, setCart] = useAtom(cartState);
  const [buyNowItem, setBuyNowItem] = useAtom(buyNowState);
  const promotion = useAtomValue(promotionDataState);
  
  
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
      toast.success("Đã thêm vào giỏ hàng");
    },
    [setCart, calculateCart],
  );

  const buyNow = useCallback(
    (product: Product, quantity: number = 1) => {
      setBuyNowItem({
        id: `buy-now-${Date.now()}`,
        product,
        quantity,
      });
    },
    [setBuyNowItem],
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      if (cartItemId?.includes('buy-now')) {
        clearBuyNow()
      } else {
        setCart((prev) => {
          const items = prev.items.filter((item) => item.id !== cartItemId);
          return calculateCart(items);
        });
      }
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

  const clearBuyNow = useCallback(() => {
    setBuyNowItem(null);
  }, [setBuyNowItem]);

  const checkoutItems = useMemo(() => {
    if (buyNowItem) {
      return [buyNowItem];
    }

    return cart.items;
  }, [buyNowItem, cart.items]);

  const checkoutTotalPrice = useMemo(() => {
    return checkoutItems.reduce((sum, item) => {
      const price = item.product.discount_price || item.product.original_price;

      return sum + Number(price) * item.quantity;
    }, 0);
  }, [checkoutItems]);

  const checkoutTotalQuantity = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [checkoutItems]);

  const summary = useMemo(() => {
    const totalDiscount =
      (promotion?.totalDiscountPromotion ?? 0) +
      (promotion?.totalDiscountVoucher ?? 0);
    
    const discounted = checkoutItems.reduce((sum, item) => {
      const original = Number(item.product.original_price || 0);
      const discount = Number(
        item.product.discount_price ?? item.product.original_price ?? 0,
      );
      return sum + (original - discount) * item.quantity;
    }, 0);
    const discountPriceSum = checkoutItems.reduce((sum, item) => {
      const discount = Number(
        item.product.discount_price ?? item.product.original_price ?? 0,
      );
      return sum +  discount * item.quantity;
    }, 0);
    return {
      subtotal: promotion?.totalOriginalPrice ?? 0,
      discountPriceSum,
      discounted: discounted,
      voucher: promotion?.totalDiscountVoucher,
      totalDiscount: totalDiscount,
      shippingFee: promotion?.shippingFee ?? 0,
      payment: promotion?.collectibleAmount ?? 0,
      totalQuantity: 1,
    };
  }, [checkoutItems, promotion]);

  const getDiscount = (product: Product) => {
    const before = Number(product.original_price);
    const after = Number(product.discount_price);
    if (before === after || !before) return null;
    const discount = ((before - after) / before) * 100;
    return discount.toFixed(0);
  };
  return {
    cart,

    items: checkoutItems,
    totalPrice: checkoutTotalPrice,
    totalQuantity: checkoutTotalQuantity,
    summary,
    clearBuyNow,
    buyNow,
    addToCart,
    removeFromCart,

    updateQuantity,
    increaseQuantity,
    decreaseQuantity,

    getCartItem,
    getProductQuantity,
    isInCart,

    clearCart,
    getDiscount,
  };
}


const CROSS_SALE_DISCOUNT_RATES = {
  RI1: 0.1,
  RI3: 0.15,
  RI6: 0.1,
  WT1: 0.1,
  WT3: 0.1,
  WT6: 0.1,
  FA3: 0.1,
  HE3: 0.1,
  QW1: 0.1,
  QW3: 0.1,
  QM1: 0.1,
  QM3: 0.1,
};
export const listPromotionProduct = [
  "RI1",
  "RI3",
  "RI6",
  "WT1",
  "WT3",
  "WT6",
  "FA3",
  "HE3",
  "QW1",
  "QW3",
  "QM1",
  "QM3",
];

const PROGRAMS = [
  {
    name: "motherDay",
    endAt: new Date(2026, 4, 11, 0, 0, 0, 0),
    getDiscount: (price) => price * 0.1,
  },
  {
    name: "worldCup",
    endAt: new Date(2026, 4, 21, 0, 0, 0, 0),
    tiers: [
      { minPrice: 899000, discount: 79000 },
      { minPrice: 699000, discount: 59000 },
      { minPrice: 499000, discount: 39000 },
    ],
    getDiscount(price) {
      const tier = this.tiers.find((t) => price >= t.minPrice);
      return tier?.discount ?? 0;
    },
  },
  {
    name: "crossSale",
    startAt: new Date(2026, 4, 23, 0, 0, 0, 0),
    endAt: new Date(2026, 4, 30, 0, 0, 0, 0),
    getDiscount: (items: CartItem[], allListItems?: any) => {
      const nonComboItems = allListItems.filter(
        (item) => item.item?.product_type !== "combo",
      );
      const totalNonComboQty = nonComboItems.reduce(
        (sum, cur) => sum + Number(cur?.quantity),
        0,
      );
      if (totalNonComboQty < 2) return 0;

      return items.reduce((total, cur) => {
        if (cur.product.product_code === "combo") return total;

        const productCode = cur.product.product_code?.toUpperCase() || "";
        const matchedCode = Object.keys(CROSS_SALE_DISCOUNT_RATES).find(
          (code) => productCode.includes(code),
        );
        if (!matchedCode) return total;

        const rate = CROSS_SALE_DISCOUNT_RATES[matchedCode];
        const originalPrice = Number(cur?.product?.original_price) || 0;
        const quantity = Number(cur?.quantity) || 0;

        return total + originalPrice * rate * quantity;
      }, 0);
    },
  },
];
const FLASH_SALE_SLOTS = [
  {
    startAt: new Date(2026, 4, 14, 0, 0, 0, 0),
    endAt: new Date(2026, 4, 16, 0, 0, 0, 0),
    products: ["RI1", "RI3", "RI6"],
    bannerUrl: "/img/banner-flash-sale.png",
  },
  {
    startAt: new Date(2026, 4, 16, 0, 0, 0, 0),
    endAt: new Date(2026, 4, 17, 0, 0, 0, 0),
    products: ["QW1", "QW3", "QM1", "QM3"],
    bannerUrl: "/img/banner-flash-sale-1605.gif",
  },
  {
    startAt: new Date(2026, 4, 21, 0, 0, 0, 0),
    endAt: new Date(2026, 4, 22, 0, 0, 0, 0),
    products: ["RI1", "RI3", "RI6"],
    bannerUrl: "/img/banner-flash-sale.png",
  },
  {
    startAt: new Date(2026, 4, 22, 0, 0, 0, 0),
    endAt: new Date(2026, 4, 23, 0, 0, 0, 0),
    products: ["QW1", "QW3", "QM1", "QM3"],
    bannerUrl: "/img/banner-flash-sale-1605.gif",
  },
  {
    startAt: new Date(2026, 4, 30, 0, 0, 0, 0),
    endAt: new Date(2026, 5, 1, 0, 0, 0, 0),
    products: ["WT1", "WT3", "WT6", "FA3", "HE3"],
  },
];