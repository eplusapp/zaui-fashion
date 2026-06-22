import Checkbox from "@/components/checkbox";
import QuantityInput from "@/components/quantity-input";
import { useAddToCart } from "@/hooks";
import { CartItem as CartItemProps } from "@/types/cart";
import { formatPrice } from "@/utils/format";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { RemoveIcon } from "@/components/vectors";
import { useAtom } from "jotai";
import { selectedCartItemIdsState } from "@/state";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hook/useCart";

const SWIPE_TO_DELTE_OFFSET = 80;

export default function CartItemCheckout(props: CartItemProps) {
  const { addToCart, updateQuantity, removeFromCart } = useCart();


  return (
    <div className="relative border-b-[1px] border-black/10">
      <div
        className="bg-white pl-4 flex items-center space-x-4 relative"
      >
        <div className="py-4 pr-4 flex-1 border-b-[0.5px] border-black/10">
          <div className="text-lg font-[700] mb-2">{props.product.name}</div>

          <div className="flex-1 flex flex-col flex-wrap gap-1">
            {props.product.original_price && (
              <div className="text-base   text-[##000C17]">
                Đơn giá: {formatPrice(Number(props.product.original_price))}
              </div>
            )}
            <div className="flex gap-4 align-center items-center">
              <div className="text-base text-[#000C17]">
                Số lượng: {props.quantity}
              </div>
            </div>
            <div className="text-base font-[700]">
              Tổng cộng: {formatPrice(props.product.discount_price * props.quantity)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
