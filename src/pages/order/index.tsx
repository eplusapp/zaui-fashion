import SearchBar from "@/components/search-bar";
import { EmptyBoxIcon } from "@/components/vectors";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { ordersState } from "@/request/order";
import OrderItem from "./order-item";
export default function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useAtom(ordersState);
  if (!orders.length) {
      return <div className="w-full h-full flex flex-col items-center justify-center">
        <EmptyBoxIcon />
        <div className="text-[24px] font-[600] text-[#646464]">
          Bạn chưa có đơn hàng nào
        </div>
      </div>  
    }
  return (
    <div className="py-2">
      {/* <SearchBar /> */}
      {orders.map(x => {
        return <OrderItem order={x} key={x.code}/>
      })}
    </div>
  );
}
