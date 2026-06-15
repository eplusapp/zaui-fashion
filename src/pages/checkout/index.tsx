import { useEffect, useMemo, useState } from "react";
import { ReciveType, Voucher } from "@/types/products";
import CollapseView from "@/components/collapse-view";
import HorizontalDivider from "@/components/horizontal-divider";
import { useCart } from "@/hook/useCart";
import CartItemCheckout from "../cart/cart-item-checkout";
import TextInput from "@/components/text-input";
import TextArea from "@/components/text-area";
import Checkbox from "@/components/checkbox";
import { Radio } from "zmp-ui";
import Button from "@/components/button";
import { formatPrice,  parseBrand, safeJsonParse } from "@/utils/format";
import CheckoutLocation from "@/components/modals/checkout-location";
import { AddressType, CreateOrderBody, PaymentType } from "@/types/order";
import { useCreateOrder } from "@/hook/useCreateOrder";
import OtpOrderModal from "@/components/modals/otp-order-modal";
import { useNavigate } from "react-router-dom";
import { checkingVoucherState, verifyingVoucherState } from "@/request/product";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import { checkoutInfoState } from "@/request/user";
 
export default function CheckoutPage() {
  const { items, summary, clearBuyNow, clearCart } = useCart();
  const [paymentType, setPaymentType] = useState<PaymentType>("recieve");
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState('')
  const [voucherList, setVoucherList] = useState<Voucher[]>([])
  const [checkoutInfo, setCheckoutInfo] = useAtom(checkoutInfoState);
  const [enableReciver, setEnableReciver] = useState(false)
  const [enableExport, setEnableExport] = useState(false)
  const [estimateTime, setEstimateTime] = useState<String>()

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showOtpVoucherModal, setShowOtpVoucherModal] = useState(false);

  const [recive, setRecive] = useState<ReciveType>()
  const { createOrder, prepareCreateOrder, loading } = useCreateOrder();
  const [, checkVoucher] = useAtom(checkingVoucherState);
  const [, verifyVoucher] = useAtom(verifyingVoucherState);

  useEffect(() => {
    setBuyerForm((prev) => ({
      ...prev,
      ...checkoutInfo.buyer,
    }));

    setReceiverForm((prev) => ({
      ...prev,
      ...checkoutInfo.receiver,
    }));
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

  const handleApplyVoucher = async () => {
    try {
      if (!buyerForm.phone) {
        toast.error('Vui lòng điền số điện thoại')
        return
      }
      if (!items?.length) {
        toast.error('Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán')
        return
      }
      const result = await checkVoucher({
        phone: buyerForm.phone,
        voucherCode: voucher,
      });
      if (result.success) {
        setShowOtpVoucherModal(true);
      } else {
        toast.error((result as any).message);
      }
    } catch (error) {
      toast.error((error as any));
    }
  };
  const finalPayment = useMemo(() => {
    const totalVoucherDiscount = voucherList.reduce(
      (sum, voucher) => sum + (voucher.voucherValue || 0),
      0
    );
    return Math.max(0, summary.payment - totalVoucherDiscount);
  }, [summary.payment, voucherList]);
  const handleCheckout = async (otp: string) => {
    if (!recive?.selectedProvince) {
      return;
    }
    if (!recive?.selectedWard) {
      return;
    }
    if (!items?.length) {
      toast.error('Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán')
      return
    }
    const ship = summary.shippingFee
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
      warehouse: recive.region,
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
        comboProducts: safeJsonParse(
          item.product.comboProducts,
          [],
        ),
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
      vouchers: voucherList?.map(x => ({
        ...x,
        VoucherType: x?.voucherType === 'Percent' ? 'Percentage' : 'Amount',
        VoucherCode: x?.voucherCode,
        VoucherValue: x?.voucherValue,
        MaxValue: x?.maxValue,
        IsEcoGreenVoucher: true,
      })),
      shipping_type: recive.type === 'customer' ? 'viettle_post' : 'eco',
      totalAmountDiscount: summary.totalDiscount,
      finalAmount: finalPayment,
      otp: otp,
      otp_phone: buyerForm.phone,
    } as any as CreateOrderBody;
    const result = await createOrder({
      form: body,
      callback: (code) => {
        setCheckoutInfo({
          buyer: {
            name: buyerForm.name,
            phone: buyerForm.phone,
            email: buyerForm.email,
          },
          receiver: {
            name: enableReciver ? receiverForm.name : "",
            phone: enableReciver ? receiverForm.phone : "",
            email: enableReciver ? receiverForm.email : "",
          },
          address: {
            address: recive?.address ?? "",
            province: recive?.selectedProvince ?? null,
            ward: recive?.selectedWard ?? null,
          },
        });

        navigate(`/orders/${code}`)
        toast.success(`Đặt hàng thành công!, Mã đơn hàng: ${code}`, {
          icon: "🎉",
        });
        clearCart();
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
    if (!items?.length) {
      toast.error('Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán')
      return
    }
    await prepareCreateOrder(
      () => handleCheckout(''),
      () => setShowOtpModal(true),
      buyerForm.phone
    )
  }
  const handleOtpConfirm = async (otp: string) => {
    handleCheckout(otp)
  }
  const handleOtpVoucherConfirm = async (otp: string) => {
    try {
      const res = await verifyVoucher({
        phone: buyerForm.phone,
        voucherCode: voucher,
        otpCode: otp
      })
      if (res?.id) {
        const br = parseBrand(res?.brand)
        const validItem = items.filter(x => br.includes(x.product.product_code))
        if (validItem?.length > 0) {
          setVoucherList([...voucherList, res])
          toast.success('Thêm voucher thành công')
        } else {
          toast.error('Mã giảm giá không hợp lệ. Vui lòng nhập lại hoặc liên hệ 1800 556 889 (miễn cước) để được hỗ trợ.')
        }
        setVoucher('')
      }
    } catch (error) {
      toast.error('Something went wrong, please try again!')
    }
    setShowOtpVoucherModal(false);
  }
  const fee = summary?.shippingFee ?? 0;
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
          <TextInput inputMode="numeric" isRequired title="Số điện thoại" value={buyerForm.phone} onChange={(value) => setBuyerForm({...buyerForm, phone: value})} placeHolder="Nhập số điện thoại"/>
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
            <TextInput inputMode="numeric" isRequired title="Số điện thoại người nhận" value={receiverForm.phone} onChange={(value) => setReceiverForm({...receiverForm, phone: value})} placeHolder="Nhập số điện thoại người nhận"/>
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
                  {formatPrice(summary.discountPriceSum)}
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
              {Boolean(summary.discounted) && <div className="flex items-center justify-between w-full my-1 mt-4 border-b border-dashed pb-1">
                <div>
                  Giảm giá
                </div>
                <div className=" text-danger">
                  {formatPrice(summary.totalDiscount - summary.discounted)}
                </div>
              </div>}
            
              
              
              {/* <div className="flex items-center justify-between w-full my-1 mt-4 border-b border-dashed pb-1">
                <div>
                  Sử dụng voucher
                </div>
                <div className="text-[#586189] cursor-pointer">
                  Chọn mã +
                </div>
              </div> */}
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
              <div className="flex flex-col w-full my-1 mt-4">
                {voucherList?.map((x) => (
                  <div
                    key={x.id}
                    className="relative my-2 rounded-xl border border-gray-300 bg-white "
                  >
                    {/* top cut */}
                    <div className="absolute left-[36%] top-0 h-6 w-6 -translate-x-1/2 -translate-y-4 rounded-full bg-white border-b border-gray-300" />
                    {/* bottom cut */}
                    <div className="absolute left-[36%] bottom-0 h-6 w-6 -translate-x-1/2 translate-y-4 rounded-full bg-white border-t border-gray-300" />
                    <div className="flex items-center">
                      {/* Left content */}
                      <div className="flex flex-col flex-1 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-md font-medium">
                            {x.voucherCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#32323280] font-medium">
                            {x.fullName}
                          </span>
                        </div>
                      </div>
                    
                      {/* Right content */}
                      <div className="flex flex-[2] min-w-[120px] items-center justify-center px-4 py-3 border-l-2 border-dashed border-gray-300">
                        <span className="text-[20px] font-[600] text-red-500">
                          {formatPrice(x.voucherValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {Boolean(summary?.voucher) && <div className="flex items-center justify-between w-full my-1 mt-4 border-b border-dashed pb-1">
              <div>
                Giảm giá voucher
              </div>
              <div>
                {formatPrice(summary?.voucher ?? 0)}
              </div>
            </div>}
            <div className="flex items-center justify-between w-full py-4 mt-4 border-t   px-4 bg-[#D7DDF34D]">
              <div className="text-xl">
                Thanh toán
              </div>
              <div className="font-[900] text-xl">
                {formatPrice(finalPayment)}
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
      <OtpOrderModal
        open={showOtpVoucherModal}
        phone={buyerForm.phone}
        loading={false}
        onClose={() => setShowOtpVoucherModal(false)}
        onConfirm={handleOtpVoucherConfirm}
      />
    </div>
  );
}
