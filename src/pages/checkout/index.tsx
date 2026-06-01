import { useEffect, useState } from "react";
import { ReciveType, VoucherItem } from "@/types/products";
import CollapseView from "@/components/collapse-view";
import HorizontalDivider from "@/components/horizontal-divider";
import { useCart } from "@/hook/useCart";
import CartItemCheckout from "../cart/cart-item-checkout";
import TextInput from "@/components/text-input";
import TextArea from "@/components/text-area";
import Checkbox from "@/components/checkbox";
import { Radio } from "zmp-ui";
import Button from "@/components/button";
import { formatPrice } from "@/utils/format";
import CheckoutLocation from "@/components/modals/checkout-location";
import { AddressType, CreateOrderBody, PaymentType } from "@/types/order";
import { useCreateOrder } from "@/hook/useCreateOrder";
import OtpOrderModal from "@/components/modals/otp-order-modal";
import { useNavigate } from "react-router-dom";
import { checkingVoucherState } from "@/request/product";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
 
export default function CheckoutPage() {
  const { items, totalPrice, summary, clearBuyNow, clearCart } = useCart();
  const [paymentType, setPaymentType] = useState<PaymentType>("recieve");
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState('')
  const [voucherList, setVoucherList] = useState<VoucherItem[]>([])

  const [enableReciver, setEnableReciver] = useState(false)
  const [enableExport, setEnableExport] = useState(false)
  const [estimateTime, setEstimateTime] = useState<String>()

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [recive, setRecive] = useState<ReciveType>()
  const { createOrder, prepareCreateOrder, loading } = useCreateOrder();
  const [, checkVoucher] = useAtom(checkingVoucherState);

  useEffect(() => {
    return () => {
      clearBuyNow()
    }
  }, [])
  
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  })
  const [receiverForm, setReceiverForm] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [exportForm, setExportForm] = useState({
    companyName: "",
    taxCode: "",
    address: "",
  })

  const getDeliveryFee = () => {
    return 10000
  }
  const handleApplyVoucher = async () => {
    const result = await checkVoucher({
      phone: buyerForm.phone,
      voucherCode: voucher,
    });
    if((result as any).error) {
      toast.error((result as any).message);
    } else {
      if (result.data) {
        setVoucherList([...voucherList, result.data])
      }
      toast.success('Thêm voucher thành công')
    }
  };
  const handleCheckout = async (otp: string) => {
    if (!recive?.selectedProvince) {
      return;
    }
    if (!recive?.selectedWard) {
      return;
    }
    const ship = getDeliveryFee() 
    const body = {
      customer_fullname: buyerForm.name,
      customer_phone: buyerForm.phone,
      customer_mail: buyerForm.email,
      receiver_fullname: enableReciver ? receiverForm.name : buyerForm.name,
      receiver_phone: enableReciver ? receiverForm.phone : buyerForm.phone,
      receiver_email: enableReciver ? receiverForm.email : buyerForm.email,
      note: buyerForm.notes,
      address_type: (recive.type === "eco" ? "pickup" : "delivery") as AddressType,
      customer_address: recive.address ?? "",
      province_id: recive.selectedProvince.id,
      province_name: recive.selectedProvince.name,
      ward_id: recive.selectedWard.id,
      ward_name: recive.selectedWard.name,
      erp_province_id: recive.selectedProvince.id,
      erp_ward_id: recive.selectedWard.id,
      warehouse: '',
      payment_type: paymentType,
      invoicing: enableExport,
      invoice_company: exportForm.companyName,
      invoice_taxcode: exportForm.taxCode,
      invoice_address: exportForm.address,
      summary: { 
        payment: summary.payment, 
        shippingFee: ship,
        discounted: summary.discounted,
        total: summary.payment + ship,
        orderPreDiscount: summary.subtotal,
        saved: summary.totalDiscount,
        orderValue: summary.subtotal,
        totalPointUse: 0,
      },
      products: items.map((item) => ({ 
        id: String(item.product.id), 
        quantity: item.quantity,
        comboProducts: [],
        product_type: item.product.product_type,
        product_code: item.product.product_code,
        promotion_id: '',
        autoReplen: '',
        estimated_point: null,
      })),
      source: '',
      payment_status: '',
      url_order: '',
      invoiceInfo: {
        isInvoiceRequested: false,
        type: null,
        fullName: "",
        phoneNumber: "",
        personalTaxOrCCCD: "",
        address: "",
        companyName: exportForm.companyName,
        taxCode: exportForm.taxCode,
        invoiceEmail: exportForm.address
      },
      customer_full_address: '',
      pickup_address: {
        address: recive.address || '',
        province_id: recive.selectedProvince.id,
        province_name: recive.selectedProvince.name,
        ward_id: recive.selectedWard.id,
        ward_name: recive.selectedWard.name,
        erp_province_id: recive.selectedProvince.id,
        erp_ward_id: recive.selectedWard.id,
        full_address: [
          recive.address,
          recive.selectedWard.name,
          recive.selectedProvince?.name
        ].join(', '),
      },
      pickup_full_address: [
        recive.address,
        recive.selectedWard.name,
        recive.selectedProvince?.name
      ].join(', '),
      estimated_delivery: estimateTime,
      isTaxIssued: false,
      vouchers: [],
      shipping_type: recive.type === 'customer' ? 'viettle_post' : 'eco',
      totalAmountDiscount: summary.totalDiscount,
      finalAmount: summary.payment + ship,
      otp: otp,
      otp_phone: buyerForm.phone,
    } as any as CreateOrderBody;
    const result = await createOrder({
      form: body,
      callback: (code) => {
        navigate(`/orders/${code}`)
        toast.success(`Đặt hàng thành công!, Mã đơn hàng: ${code}`, {
          icon: "🎉",
        });
        clearCart();
        // navigate("/orders/" + order.code)
      }
    });
    if (!result.success) {
      console.log(result);
      return;
    }
    setShowOtpModal(false)
  };
  const createOtpCheckout = async () => {
    if (!buyerForm.name || !buyerForm.phone) {
      toast.error('Vui lòng nhập tên người mua')
      return
    }
    if (!recive?.selectedProvince?.id || !recive?.selectedWard?.id) {
      toast.error('Vui lòng chọn địa chỉ giao hàng')
      return
    }
    if (!paymentType) {
      toast.error('Vui lòng chọn phương thức thanh toán')
      return
    }
    await prepareCreateOrder()
    setShowOtpModal(true);
  }
  const handleOtpConfirm = async (otp: string) => {
    handleCheckout(otp)
  }
  const fee = getDeliveryFee()
  return (
    <div className="pt-2">
      <HorizontalDivider />
      <CollapseView
        title="Sản phẩm"
      >
        <div className="flex flex-1 flex-col">
          {items.map((product) => {
            return (
              <CartItemCheckout key={product.id} {...product} />
            )
          })}
        </div>
      </CollapseView>
      <HorizontalDivider/>
      <CollapseView
        title="Thông tin người mua"
      >
        <div className="w-full gap-4 flex flex-col my-4">
          <TextInput isRequired title="Họ và tên người mua" value={buyerForm.name} onChange={(value) => setBuyerForm({...buyerForm, name: value})} placeHolder="Nhập họ và tên người mua"/>
          <TextInput isRequired title="Số điện thoại" value={buyerForm.phone} onChange={(value) => setBuyerForm({...buyerForm, phone: value})} placeHolder="Nhập số điện thoại"/>
          <TextInput title="Email" value={buyerForm.email} onChange={(value) => setBuyerForm({...buyerForm, email: value})} placeHolder="Nhập email"/>
          <div className="flex items-center">
            <Checkbox
              checked={enableReciver}
              onChange={(checked) => setEnableReciver(checked)}
            />
            <div className="ml-2 text-base text-gray-500">Thông tin người nhận khác với thông tin người mua</div>
          </div>
          {enableReciver && <>
            <TextInput isRequired title="Họ và tên người nhận" value={receiverForm.name} onChange={(value) => setReceiverForm({...receiverForm, name: value})} placeHolder="Nhập họ và tên người nhận"/>
            <TextInput isRequired title="Số điện thoại người nhận" value={receiverForm.phone} onChange={(value) => setReceiverForm({...receiverForm, phone: value})} placeHolder="Nhập số điện thoại người nhận"/>
            <TextInput title="Email người nhận" value={receiverForm.email} onChange={(value) => setReceiverForm({...receiverForm, email: value})} placeHolder="Nhập email người nhận"/>
          </>}
          <TextArea title="Ghi chú" value={buyerForm.notes} onChange={(value) => setBuyerForm({...buyerForm, notes: value})} placeHolder="Nhập ghi chú cho đơn hàng"/>
        </div>
      </CollapseView>
      <HorizontalDivider />
      <CollapseView
        title="Hình thức giao hàng"
      >
        <CheckoutLocation setEstimateTime={setEstimateTime} setRecive={setRecive} recive={recive} />
      </CollapseView>
      <HorizontalDivider />
      <CollapseView
        title="Thông tin thanh toán"
      >
        <div className="w-full my-4">
          <div className="text-base">
            Hình thức thanh toán
          </div>
          <Radio.Group
            className="mt-2 flex flex-col gap-2"
            onChange={(x) => {
              switch (String(x)) {
                case "1":
                  setPaymentType("recieve");
                  break;
                case "2":
                  setPaymentType("domestic_card");
                  break;
                case "3":
                  setPaymentType("transfer");
                  break;
                case "4":
                  setPaymentType("international_card");
                  break;
              }
            }}
            defaultValue="1"
            options={[
              {
                label: 'Tiền mặt',
                value: '1'
              },
              // {
              //   label: 'Thẻ nội địa',
              //   value: '2'
              // },
              {
                label: 'Chuyển khoản',
                value: '3'
              },
              // {
              //   label: 'Thẻ quốc tế',
              //   value: '4'
              // }
            ]}
          />
        </div>
      </CollapseView>
      <HorizontalDivider />
      <CollapseView
        title="Thông tin xuất hóa đơn"
      >
        <div className="w-full my-4">
          <div className="flex items-center">
            <Checkbox
              checked={enableExport}
              onChange={(checked) => setEnableExport(checked)}
            />
            <div className="ml-2 text-base font-[500]">Thông tin xuất hóa đơn</div>
          </div>
          {enableExport && <div className="my-4 flex flex-col gap-4">
            <TextInput title="Tên công ty" value={exportForm.companyName} onChange={(value) => setExportForm({ ...exportForm, companyName: value })} placeHolder="Nhập tên công ty" />
            <TextInput title="Mã số thuế" value={exportForm.taxCode} onChange={(value) => setExportForm({ ...exportForm, taxCode: value })} placeHolder="Nhập mst" />
            <TextInput title="Địa chỉ" value={exportForm.address} onChange={(value) => setExportForm({ ...exportForm, address: value })} placeHolder="Nhập địa chỉ công ty" />
          </div>}
          <div className="mt-6 border rounded-md pt-4 bg-white">
            <div className="px-4">
              <div className="w-full font-[700] text-lg">
                Tổng đơn hàng
              </div>
              <div className="flex items-center justify-between w-full my-1 mt-4 border-b border-dashed pb-1">
                <div>
                  Giá trị đơn hàng
                </div>
                <div>
                  {formatPrice(summary.subtotal)}
                </div>
              </div>
              <div className="flex items-center justify-between w-full my-1 mt-4 border-b border-dashed pb-1">
                <div>
                  Phí vận chuyển
                </div>
                <div>
                  {formatPrice(fee)}
                </div>
              </div>
              <div className="flex items-center justify-between w-full my-1 mt-4 border-b border-dashed pb-1">
                <div>
                  Sử dụng voucher
                </div>
                <div className="text-[#586189] cursor-pointer">
                  Chọn mã +
                </div>
              </div>
              <div className="flex flex-col w-full my-1 mt-4">
                <div className="mb-2">
                  Nhập mã mua hàng (mã giảm giá)
                </div>
                <div className="flex gap-2">
                  <TextInput
                    placeHolder="Nhập mã mua hàng (mã giảm giá)"
                    title=""
                    value={voucher}
                    onChange={(x) => setVoucher(x)}
                  />
                  <Button onClick={handleApplyVoucher} className="w-[150px] line text-[12px]" primary>
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full py-4 mt-4 border-t   px-4 bg-[#D7DDF34D]">
              <div className="text-xl">
                Thanh toán
              </div>
              <div className="font-[900] text-xl">
                {formatPrice(summary.payment + fee)}
              </div>
            </div>
          </div>
        </div>
      </CollapseView>
      <HorizontalDivider />
      <div className="w-full my-4 px-4">
        <Button primary className="w-full font-[900] text-xl" onClick={createOtpCheckout}>
            XÁC NHẬN THANH TOÁN
        </Button>
      </div>
      <OtpOrderModal
        open={showOtpModal}
        phone={buyerForm.phone}
        loading={loading}
        onClose={() => setShowOtpModal(false)}
        onConfirm={handleOtpConfirm}
      />
    </div>
  );
}
