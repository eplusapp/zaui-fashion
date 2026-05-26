import QuantityInput from "@/components/quantity-input";
import { CartItem as CartItemProps } from "@/types/cart";
import { formatPrice } from "@/utils/format";
import { RemoveIcon } from "@/components/vectors";
import { useMemo } from "react";
import { useCart } from "@/hook/useCart";

export default function CartItem(props: CartItemProps) {
  const { getDiscount, updateQuantity, removeFromCart } = useCart();

  const thump = props.product?.images?.find(x => x.type === 'thumbnail')
  const discount = useMemo(() => getDiscount(props.product), [props.product.discount_price, props.product.original_price])

  return (
    <div className="relative">
      <div
        className="bg-white pl-4 flex items-center space-x-4 relative"
      >
        <img src={thump?.slug} className="w-24 h-24 rounded-lg" />
        {Boolean(discount) && <div className="absolute top-2 left-[-12px] bg-danger w-8 h-8 items-center justify-center flex rounded-full text-white text-[10px] font-[900]">
          -{discount}%
        </div>}
        <div className="py-4 pr-4 flex-1 border-b-[0.5px] border-black/10">
          <div className="text-lg font-[700] mb-2">{props.product.name}</div>

          <div className="flex-1 flex flex-col flex-wrap gap-1">
            {props.product.original_price && (
              <div className="text-base line-through text-[##000c17]">
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
