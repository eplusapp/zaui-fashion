import { useAtom, useAtomValue } from "jotai";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { orderDetailState, ordersState } from "@/request/order";
import { getOrderColor, getOrderStatus } from "@/utils/cart";
import { formatPrice } from "@/utils/format";
import moment from "moment";
import { EmptyBoxIcon } from "@/components/vectors";
import Button from "@/components/button";
import toast from "react-hot-toast";
import {  } from "zmp-sdk/apis";
import { Icon } from "zmp-ui";
import { Suspense, useMemo } from "react";
import { PageSkeleton } from "@/components/skeleton";
import { useCreateOrder } from "@/hook/useCreateOrder";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { createZaloPaymentOrder } = useCreateOrder()
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const [orders] = useAtom(ordersState);
  const orderLocal = orders.find(x => x.code === id)
  const phone = orderLocal?.customer_phone!;

  const params = useMemo(
    () => ({
      phone,
      code: id ?? "",
    }),
    [phone, id]
  );

  const order = useAtomValue(
    orderDetailState(params)
  );
  console.log('order ---->', order)
  const startPayment = async () => {
    await createZaloPaymentOrder({
      paymentType: order.payment_type,
      orderCode: order.code,
      orderId: order.id,
      phone: order.customer_phone,
      amount: order.total_discount_price || order.total_original_price,
      items:
        order.products?.map((x) => ({
          id: x.id,
          amount: x.unit_price || x.original_price,
          quantity: x.quantity,
        })) || [],
      onSuccess: (data) => {
        toast.success("Thanh toán thành công. Cảm ơn bạn đã mua hàng!", {
          icon: "🎉",
        });
        navigate(`/orders/${order.code}?status=success`, {
          replace: true,
        });
      },
      onFail: (error) => {
        console.error(error);
      },
    });
  }
  const navigate = useNavigate()
  const continuteShop = () => {
    navigate("/")
  }
  const getPayment = (payment: string) => {
    switch (payment) {
      case "recieve":
        return 'Tiền mặt'
      case "domestic_card":
        return 'Thẻ nội địa'
      case "transfer":
        return 'Chuyển khoản'
      case "international_card":
        return 'Thẻ quốc tế'
      default:
        return 'Tiền mặt'
    }
  }
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
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Đã sao chép");
    } catch (error) {
      console.error(error);
    }
  }
  const checkGift = () => {
    if (order && order.products?.length) {
      const lengthGift = order.products.filter((item) => {
        return item.product_type === 'voucher' || item.product_type === 'gift'
      }).length
      const lengthProduct = order.products.filter((item) => {
        return item.product_type === 'sale'
      }).length
      return lengthGift > 0 && lengthProduct === 0
    } else return false
  }
  const isWithin24Hours = order?.created_at
    ? moment().diff(moment(order.created_at), "hours", true) < 24
    : false;
  if (!order) return <div className="flex flex-1 items-center justify-center h-full">
    <EmptyBoxIcon />
  </div>
  return (
    <Suspense fallback={<PageSkeleton />}>
      <div className="py-2 px-4 mt-2 bg-[#FBFBFE] overflow-y-auto">
        {order.payment_status === 'open' && isWithin24Hours && !checkGift() && <div className="w-full items-center flex flex-col py-3 px-4" style={{ backgroundColor: '#F7941D' }}>
          <div className="text-white font-[800] text-lg">Đang chờ thanh toán</div>
          <div className="text-white font-[600] text-lg text-center">Quý khách vui lòng thanh toán đơn hàng trong vòng 24h.</div>
        </div>}
        {status && status === 'pending' && order.payment_type === 'receiver' && !checkGift() && <div className="w-full items-center flex flex-col py-3 px-4" style={{ backgroundColor: '#F7941D' }}>
          <div className="text-white font-[800] text-lg">Đang chờ xác nhận</div>
          <div className="text-white font-[600] text-lg text-center">Quý khách vui lòng thanh toán đơn hàng khi nhận hàng.</div>
        </div>}
        {order.payment_status === 'success' && !checkGift() && <div className="w-full items-center flex flex-col py-3 px-4" style={{ backgroundColor: '#00B712' }}>
          <div className="text-white font-[800] text-lg">Thanh toán thành công</div>
          <div className="text-white font-[600] text-lg text-center">Cảm ơn Quý khách đã đặt hàng tại Ecogreen. Đơn hàng của Quý khách sẽ được giao đến địa chỉ đăng ký.</div>
        </div>}
        {order.payment_status === 'failed' && !checkGift() && <div className="w-full items-center flex flex-col py-3 px-4" style={{ backgroundColor: '#EE0F0F' }}>
          <div className="text-white font-[800] text-lg">Thanh toán bị từ chối</div>
          <div className="text-white font-[400] text-lg text-center">Giao dịch của Quý khách chưa hoàn tất. Vui lòng liên hệ ngân hàng của Quý khách để kiểm tra giao dịch.</div>
        </div>}
        <div className="flex flex-col gap-1 mt-4 bg-[#fff] p-2 border border-1  rounded">
          <div className="font-[600] text-lg flex items-center gap-2 mb-2">
            <div>
              Thông tin đơn hàng
            </div>
            <div className="flex flex-1 h-0.5 bg-[#D7DDF3]" />
          </div>
          {renderLine('Mã đơn hàng', '#586189', `#${order?.code}`, '#1E266E', true)}
          {renderLine('Ngày giao dự kiến', '#586189', `${order?.estimated_delivery ? moment(order?.estimated_delivery).format('DD/MM/YYYY') : '-'}`, '#233248', true)}
          {renderLine('Hình thức thanh toán', '#586189', `${getPayment(order?.payment_type)}`, '#233248', true)}
          {renderLine('Số tiền', '#586189', `${formatPrice(order?.costs.collectible_amount?.amount)}`, '#1E266E', true)}
          {renderLine('Trạng thái', '#586189', `${getOrderStatus(order, !order?.is_eco)}`, `${getOrderColor(order, !order?.is_eco)}`, true)}
          {renderLine('Họ tên người nhận', '#586189', `${order?.customer_fullname}`, '#233248')}
          {renderLine('Số di động', '#586189', `${order?.customer_phone}`, '#233248')}
          {renderLine('Địa chỉ nhận hàng', '#586189', `${[order?.address?.receiver_address, order?.address?.ward_name, order?.address?.province_name].join(', ')}`, '#233248')}
          {renderLine('Tên công ty', '#586189', `${order?.invoice_company || '-'}`, '#233248')}
          {renderLine('Mã số thuế', '#586189', `${order?.invoice_tax_code || '-'}`, '#233248')}
          {renderLine('Địa chỉ', '#586189', `${[order?.address?.receiver_address, order?.address?.ward_name, order?.address?.province_name].join(', ')}`, '#233248')}
          {renderLine('Ghi chú', '#586189', `${order?.note || '-'}`, '#233248')}
          {renderLine('Điểm dự kiến', '#586189', `${order?.available_point}`, '#233248')}
          {renderLine('Điểm còn lại', '#586189', `${order?.remain_point}`, '#233248')}
        </div>
        {order?.payment_type === 'transfer' &&
          <>
          <div className="flex flex-col gap-1 mt-4 bg-[#fff] p-2 border border-1  rounded">
            <div className="font-[600] text-lg flex items-center gap-2 mb-2">
              <div>
                Thông tin chuyển khoản
              </div>
              <div className="flex flex-1 h-0.5 bg-[#D7DDF3]" />
            </div>
            {renderLine('Số tiền', '#586189', `${formatPrice(order?.costs.collectible_amount?.amount)}`, '#1E266E', true)}
            <div className="flex">
              <div style={{ color: '#586189' }} className={`font-[400] flex-1 text-md`}>
                {'Số tài khoản'}
              </div>
              <div onClick={() => copyText('0000041197357')} style={{ color: '#233248' }} className={`font-[700] flex-1 text-md`}>
                {'0000041197357'}
                <Icon
                  icon="zi-copy"
                />
              </div>
            </div>
            {renderLine('Ngân hàng', '#586189', `Ngân Hàng Thương Mại Cổ Phần Quân Đội - Chi Nhánh Sở Giao Dịch 2`, '#233248')}
            {renderLine('Đơn vị thụ hưởng', '#586189', `Chi Nhánh Công ty Cổ Phần Dược Phẩm Eco (TP. Hà Nội)`, '#233248')}
            <div className="font-[400] text-lg flex flex-col items-center gap-2 mb-2 mt-4 mb-6 text-[#233248]">
              Khi thanh toán tiền, Quý Khách hàng vui lòng ghi rõ nội dung chuyển khoản như sau:
              <div className="font-[600] text-[#000]">
                {`Số điện thoại: ${order.customer_phone || ''} | Mã đơn hàng: ${order.code || ''}`}
              </div>
              Mọi thắc mắc và góp ý vui lòng liên hệ Hotline Chăm sóc khách hàng: 0287 307 6089
            </div>
          </div>
          <Button primary className="w-full font-[900] text-xl mt-4" onClick={startPayment}>
            Thanh toán bằng chuyển khoản
          </Button>
          </>
        }
        <Button  className="w-full font-[900] text-xl mt-4" onClick={continuteShop}>
          Tiếp tục mua
        </Button>
      </div>
    </Suspense>
  );
}
