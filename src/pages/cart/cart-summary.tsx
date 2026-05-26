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
  const {totalPrice, totalQuantity, summary} = useCart();
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
            Tổng đơn hàng
          </div>
          <div className="text-lg font-[900] font-medium">
            {formatPrice(summary.subtotal)}
          </div>
        </div>
        {Boolean(summary.discounted) && <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-primary">
            Giảm giá sản phẩm
          </div>
          <div className="text-lg font-[900] font-medium text-danger">
            {formatPrice(summary.discounted)}
          </div>
        </div>}
        
        {Boolean(summary.crossSale) && <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-primary">
            Giảm giá Cross sale
          </div>
          <div className="text-lg font-[900] font-medium text-danger">
            {formatPrice(summary.crossSale)}
          </div>
        </div>}
        {Boolean(summary.totalDiscount) && <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-primary">
            Tiết kiệm
          </div>
          <div className="text-lg font-[900] font-medium text-danger">
            {formatPrice(summary.totalDiscount)}
          </div>
        </div>}
        
        <HorizontalDivider />
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">
            Thanh toán
          </div>
          <div className="text-[20px] font-bold">
            {formatPrice(summary.payment)}
          </div>
        </div>
        <Button onClick={checkout} className="w-full" primary disabled={totalQuantity === 0}>
          Mua ngay
        </Button>
      </div>
      
    </div>
  );
}
