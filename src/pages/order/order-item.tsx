import { useNavigate } from "react-router-dom";
import { Order } from "@/types/order";
import moment from "moment";
import { formatPrice } from "@/utils/format";
import { getOrderColor, getOrderStatus } from "@/utils/cart";
type Props = {
  order: Order;
};

export default function OrderItem(props: Props) {
  const {order} = props;
  const navigate = useNavigate();
  const renderLine = (title: string, titleColor: string, value: string, valueColor: string, highlight?: boolean) => {
    return <>
      <div className="flex">
        <div style={{ color: titleColor }} className={`font-[400] flex-1 text-md`}>
          {title}
        </div>
        <div style={{ color: valueColor }} className={`font-[${highlight ? '700' : '400'}] flex-1 text-md`}>
          {value}
        </div>
      </div>
    </>
  }
  const toDetail = () => navigate(`/orders/${order.code}`)
  return (
    <div onClick={toDetail} className="py-2 px-4 mt-2">
      <div className="font-[600] text-lg flex items-center gap-2">
        {moment(order.created_at).format('DD/MM/YYYY')}
        <div className="flex flex-1 h-0.5 bg-[#D7DDF3]"/>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        {renderLine('Mã đơn hàng', '#586189', `#${order.code}`,  '#1E266E', true)}
        {renderLine('Số tiền', '#586189', `${formatPrice(order.costs.collectible_amount?.amount)}`, '#1E266E', true)}
        {renderLine('Ngày giao dự kiến', '#586189', `${order.estimated_delivery ? moment(order.estimated_delivery).format('DD/MM/YYYY') : '-'}`, '#233248', true)}
        {renderLine('Hình thức thanh toán', '#586189', `${order.code}`, '#233248')}
        {renderLine('Trạng thái', '#586189', `${getOrderStatus(order, !order.is_eco)}`, `${getOrderColor(order, !order.is_eco)}`, true)}
        {renderLine('Họ tên người nhận', '#586189', `${order.customer_fullname}`, '#233248')}
        {renderLine('Số di động', '#586189', `${order.customer_phone}`, '#233248')}
        {renderLine('Địa chỉ nhận hàng', '#586189', `${[order.address.receiver_address, order.address.ward_name, order.address.province_name].join(', ')}`, '#233248')}
        {renderLine('Tên công ty', '#586189', `${order.invoice_company || '-'}`, '#233248')}
        {renderLine('Mã số thuế', '#586189', `${order.invoice_tax_code || '-'}`, '#233248')}
        {renderLine('Địa chỉ', '#586189', `${[order.address.receiver_address, order.address.ward_name, order.address.province_name].join(', ')}`, '#233248')}
        {renderLine('Ghi chú', '#586189', `${order.note || '-'}`, '#233248')}
      </div>
    </div>
  );
}
