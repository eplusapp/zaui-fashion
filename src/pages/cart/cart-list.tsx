import { useAtomValue } from "jotai";
import { cartState } from "@/state";
import CartItem from "./cart-item";
import { useCart } from "@/hook/userAddToCart";

export default function CartList() {
  const { items } = useCart();

  return (
    <div className="flex-1 overflow-y-auto">
      {items.map((item) => (
        <CartItem key={item.id} {...item} />
      ))}
    </div>
  );
}
