import Button from "@/components/button";
import { CustomerSupportIcon } from "@/components/vectors";
import { useCheckout, useCustomerSupport } from "@/hooks";
import { useAtomValue } from "jotai";
import { cartTotalState } from "@/state";
import { formatPrice } from "@/utils/format";
import { useCart } from "@/hook/useCart";
import HorizontalDivider from "@/components/horizontal-divider";
import { useNavigate } from "react-router-dom";

export default function CartSummary() {
  const {totalPrice, totalQuantity} = useCart();
    const navigate = useNavigate();
  
  const checkout = () => {
    navigate("/check-out");
  }
  return (
    <div className="flex-none items-center py-3 px-4 space-x-2">
      <div className="flex-1 space-y-4 border border-black/5 bg-white p-4 shadow-sm">
        <div className="text-xl font-[700] text-[#202332] text-subtitle">Tổng đơn hàng</div>
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-primary">
            Thanh toán
          </div>
          <div className="text-lg font-[900] font-medium text-primary">
            {formatPrice(totalPrice)}
          </div>
        </div>
        <HorizontalDivider />
        <Button onClick={checkout} className="w-full" primary disabled={totalQuantity === 0}>
          Mua ngay
        </Button>
      </div>
      
    </div>
  );
}
