import CartList from "./cart-list";
import ApplyVoucher from "./apply-voucher";
import CartSummary from "./cart-summary";
import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import { cartState } from "@/state";
import { EmptyBoxIcon } from "@/components/vectors";
import SelectAll from "./select-all";
import { useCart } from "@/hook/userAddToCart";

export default function CartPage() {
  const { items } = useCart();

  if (!items.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
        <EmptyBoxIcon />
        <div className="text-2xs text-inactive text-center">
          Không có sản phẩm trong giỏ hàng
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col">
      <HorizontalDivider />
      <CartList />
      <HorizontalDivider />      
      <CartSummary />
    </div>
  );
}
