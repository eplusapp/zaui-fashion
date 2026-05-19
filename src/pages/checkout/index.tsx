import { useState } from "react";
import { Product } from "@/types/products";
import CollapseView from "@/components/collapse-view";
import HorizontalDivider from "@/components/horizontal-divider";
import { useCart } from "@/hook/userAddToCart";
import CartItemCheckout from "../cart/cart-item-checkout";
import TextInput from "@/components/text-input";
import TextArea from "@/components/text-area";
import Checkbox from "@/components/checkbox";
import { Radio } from "zmp-ui";
import Button from "@/components/button";
import { formatPrice } from "@/utils/format";
type Props = {
  searchResult: Product[];
};

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [enableReciver, setEnableReciver] = useState(false)
  const [recive, setRecive] = useState('1')

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
          <TextInput title="Họ và tên người mua" value={buyerForm.name} onChange={(value) => setBuyerForm({...buyerForm, name: value})} placeHolder="Nhập họ và tên người mua"/>
          <TextInput title="Số điện thoại" value={buyerForm.phone} onChange={(value) => setBuyerForm({...buyerForm, phone: value})} placeHolder="Nhập số điện thoại"/>
          <TextInput title="Email" value={buyerForm.email} onChange={(value) => setBuyerForm({...buyerForm, email: value})} placeHolder="Nhập email"/>
          <div className="flex items-center">
            <Checkbox
              checked={enableReciver}
              onChange={(checked) => setEnableReciver(checked)}
            />
            <div className="ml-2 text-base text-gray-500">Thông tin người nhận khác với thông tin người mua</div>
          </div>
          {enableReciver && <>
            <TextInput title="Họ và tên người nhận" value={receiverForm.name} onChange={(value) => setReceiverForm({...receiverForm, name: value})} placeHolder="Nhập họ và tên người nhận"/>
            <TextInput title="Số điện thoại người nhận" value={receiverForm.phone} onChange={(value) => setReceiverForm({...receiverForm, phone: value})} placeHolder="Nhập số điện thoại người nhận"/>
            <TextInput title="Email người nhận" value={receiverForm.email} onChange={(value) => setReceiverForm({...receiverForm, email: value})} placeHolder="Nhập email người nhận"/>
          </>}
          <TextArea title="Ghi chú" value={buyerForm.notes} onChange={(value) => setBuyerForm({...buyerForm, notes: value})} placeHolder="Nhập ghi chú cho đơn hàng"/>
        </div>
      </CollapseView>
      <HorizontalDivider />
      <CollapseView
        title="Hình thức giao hàng"
      >
        <div className="w-full my-4">
          <Radio.Group
            onChange={(x) => {
              setRecive(String(x))
            }}
            defaultValue="1"
            options={[
              {
                label: 'Giao hàng tận nơi',
                value: '1'
              },
              {
                label: 'Nhận tại Công ty Dược phẩm Eco',
                value: '2'
              }
            ]}
          />
        </div>
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
              setRecive(String(x))
            }}
            defaultValue="1"
            options={[
              {
                label: 'Tiền mặt',
                value: '1'
              },
              {
                label: 'Thẻ nội địa',
                value: '2'
              },
              {
                label: 'Chuyển khoản',
                value: '3'
              },
              {
                label: 'Thẻ quốc tế',
                value: '4'
              }
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
              checked={enableReciver}
              onChange={(checked) => setEnableReciver(checked)}
            />
            <div className="ml-2 text-base font-[500]">Thông tin xuất hóa đơn</div>
          </div>
          <div className="mt-4 border rounded-md pt-4 bg-white">
            <div className="px-4">
              <div className="w-full font-[700] text-lg">
                Tổng đơn hàng
              </div>
              <div className="flex items-center justify-between w-full my-1 mt-4 border-b border-dashed pb-1">
                <div>
                  Giá trị đơn hàng
                </div>
                <div>
                  {formatPrice(totalPrice)}
                </div>
              </div>
              <div className="flex items-center justify-between w-full my-1 mt-4 border-b border-dashed pb-1">
                <div>
                  Phí vận chuyển
                </div>
                <div>
                  {formatPrice(10000)}
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
                <div className="flex gap-4">
                  <TextInput
                    placeHolder="Nhập mã mua hàng (mã giảm giá)"
                    title=""
                    value=""
                    onChange={() => { }}
                  />
                  <Button className="w-[150px]" primary>
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
                {formatPrice(totalPrice)}
              </div>
            </div>
          </div>
        </div>
      </CollapseView>
      <HorizontalDivider />
      <div className="w-full my-4 px-4">
        <Button primary className="w-full font-[900] text-xl">
            XÁC NHẬN THANH TOÁN
        </Button>
      </div>
    </div>
  );
}
