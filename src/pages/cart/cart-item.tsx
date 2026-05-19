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
import { useCart } from "@/hook/userAddToCart";

const SWIPE_TO_DELTE_OFFSET = 80;

export default function CartItem(props: CartItemProps) {
  const { addToCart, updateQuantity, removeFromCart } = useCart();


  // swipe left to delete animation
  // const [{ x }, api] = useSpring(() => ({ x: 0 }));
  // const bind = useDrag(
  //   ({ last, offset: [ox] }) => {
  //     if (last) {
  //       if (ox < -SWIPE_TO_DELTE_OFFSET) {
  //         api.start({ x: -SWIPE_TO_DELTE_OFFSET });
  //       } else {
  //         api.start({ x: 0 });
  //       }
  //     } else {
  //       api.start({ x: Math.min(ox, 0), immediate: true });
  //     }
  //   },
  //   {
  //     from: () => [x.get(), 0],
  //     axis: "x",
  //     bounds: { left: -100, right: 0, top: 0, bottom: 0 },
  //     rubberband: true,
  //     preventScroll: true,
  //   }
  // );

  return (
    <div className="relative">
      {/* <div className="absolute right-0 top-0 bottom-0 w-20 border-t-[0.5px] border-b-[0.5px] border-black/10">
        <div
          className="bg-danger text-white/95 w-full h-full flex flex-col space-y-1 justify-center items-center cursor-pointer"
          onClick={() => addToCart(props.product)}
        >
          <RemoveIcon />
          <div className="text-2xs font-medium">Xoá</div>
        </div>
      </div> */}

      <div
        // {...bind()}
        // style={{ x }}
        className="bg-white pl-4 flex items-center space-x-4 relative"
      >
        <img src={props.product?.images[0]?.slug} className="w-24 h-24 rounded-lg" />
        <div className="py-4 pr-4 flex-1 border-b-[0.5px] border-black/10">
          <div className="text-lg font-[700] mb-2">{props.product.name}</div>

          <div className="flex-1 flex flex-col flex-wrap gap-1">
            {props.product.original_price && (
              <div className="text-base   text-[##000C17]">
                {formatPrice(Number(props.product.original_price))}
              </div>
            )}
            <div className="flex gap-4 align-center items-center">
              <QuantityInput
                value={props.quantity}
                onChange={(value) => {
                  updateQuantity(String(props.id), value);
                }}
              />
              <div onClick={() => removeFromCart(String(props.id))}>
                <RemoveIcon color="#586189" />
              </div>
            </div>
            <div className="text-base font-[700] text-[#1E266E]">
              {formatPrice(props.product.discount_price)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
