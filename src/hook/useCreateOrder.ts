import { useCallback, useEffect, useState } from "react";
import { useSetAtom } from "jotai";

import {
  CreateOrderBody,
  CreateOrderResult,
  OrderProduct,
} from "@/types/order";
import { createOrderState, createOrderOtpState, createMACState } from "@/request/product";
import { addOrderState } from "@/request/order";
import { CheckoutSDK, EventName, events } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { getConfig } from "@/utils/template";

const ENV = getConfig((config) => config.template.env);
interface CreateOrderParams {
  form: CreateOrderBody;
  callback?: (order: any) => void;
  isOrderVNVC?: boolean;
}

interface PaymentItem {
  id: number | string;
  amount: number | string;
  quantity: number | string;
}
interface PaymentOrderParams {
  paymentType: string;
  orderCode: string;
  orderId: string;
  phone?: string;
  amount: number;
  items: PaymentItem[];
  onSuccess?: (data: any) => void;
  onFail?: (error: any) => void;
}

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const addOrder = useSetAtom(addOrderState);
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const createOrderRequest = useSetAtom(createOrderState);
  const createMACRequest = useSetAtom(createMACState);

  const crateOrderOtpRequest = useSetAtom(createOrderOtpState);

  const handlePaymentDone = useCallback(
    async (data) => {
      try {

        const result = await CheckoutSDK.checkTransaction({ data });
        console.log("result --->", result);

        const extraData = JSON.parse((result as any).extradata);
        console.log("extraData --->", extraData);
        switch (result.resultCode) {
          case 1:
            // Giao dịch thành công
            navigate(`/orders/${extraData?.ecoOrderId}?status=success`, {
              replace: true
            });
            break;
          case 0:
            // Giao dịch đang chờ xử lý
            navigate(`/orders/${extraData?.ecoOrderId}?status=pending`, {
              replace: true
            });
            break;
          case -1:
            // Giao dịch không thành công
            navigate(`/orders/${extraData?.ecoOrderId}?status=fail`, {
              replace: true
            });
            break;
          case -2:
            // Người dùng không chọn phương thức thanh toán và thoát Checkout SDK
            openSnackbar({
              type: "info",
              text: "Vui lòng chọn phương thức thanh toán",
            });
            break;

          default:
            openSnackbar({
              type: "error",
              text: result.msg || "Đã xảy ra lỗi, vui lòng thử lại sau",
            });
            // Giao dịch không hợp lệ, kiểm tra `result.err` & `result.msg` để biết thêm thông tin
            console.error(result.msg);
            break;
        }
      } catch (error) {
        openSnackbar({
          type: "error",
          text: "Đã xảy ra lỗi, vui lòng thử lại sau",
        });
      }
    },
    [openSnackbar, navigate],
  );

  useEffect(() => {
    events.on(EventName.PaymentDone, handlePaymentDone);
    return () => {
      events.off(EventName.PaymentDone, handlePaymentDone);
    };
  }, [handlePaymentDone]);
  const createOrder = useCallback(
    async ({
      form,
      callback,
    }: CreateOrderParams): Promise<CreateOrderResult> => {
      try {
        setLoading(true);
        const utm = JSON.parse(sessionStorage.getItem("utm") || "{}");
        const queryString = new URLSearchParams(utm).toString();
        const order = await createOrderRequest({
          ...form,
          source: "web",
          payment_status: "open",
          url_order: queryString,
        });
        addOrder({
          ...order?.data,
          estimated_delivery: form.estimated_delivery,
        });  
        if (order?.data) {   
          await createZaloPaymentOrder({
            paymentType: form.payment_type,
            orderCode: order.data.code,
            orderId: order.data.id,
            phone: form.customer_phone,
            amount: form.finalAmount,
            items:
              form.products?.map((x) => ({
                id: x.id,
                amount: x.unit_price || "",
                quantity: x.quantity,
              })) || [],
            onSuccess: (data) => {
              callback?.(data);
            },
            onFail: (error) => {
              console.error(error);
            },
          });
   
        }
        return {
          success: true,
          order,
        };
      } catch (error) {
        console.log("catch error ==>", error);
        return handleCreateOrderError(error);
      } finally {
        setLoading(false);
      }
    },
    [createOrderRequest],
  );
  async function createZaloPaymentOrder({
    paymentType,
    orderCode,
    orderId,
    phone,
    amount,
    items,
    onSuccess,
    onFail,
  }: PaymentOrderParams) {
    const paymentMethodSandBox =
      paymentType === "recieve"
        ? "COD_SANDBOX"
        : paymentType === "transfer"
          ? "BANK_SANDBOX"
          : "";
    const paymentMethod =
      paymentType === "recieve"
        ? "COD"
        : paymentType === "transfer"
          ? "BANK"
          : "";
    const paymentBody = {
      desc: `Số điện thoại: ${phone || ""} | Mã đơn hàng: ${orderCode || ""}`,
      item: items.map((x) => ({
        id: x.id,
        amount: x.amount,
        quantity: x.quantity,
      })),
      amount,
      extradata: JSON.stringify({
        ecoOrderId: orderCode,
      }),
      method: JSON.stringify({
        id: ENV === "STAG" ? paymentMethodSandBox : paymentMethod,
        isCustom: false,
      }),
    };

    const mac = await createMACRequest(paymentBody);

    return CheckoutSDK.createOrder({
      ...paymentBody,
      mac: mac.mac,
      success: onSuccess,
      fail: onFail,
    });
  }
  const prepareCreateOrder =
    useCallback(async (createOrderCallBack: () => void, openOtpCallBack: () => void, phone: string): Promise<void> => {
      try {
        const otpConfig = await crateOrderOtpRequest(phone);
        if (otpConfig.isOtpRequired) {
          openOtpCallBack();
        } else {
          createOrderCallBack();
        }
      } catch (error) {
        console.error(error);
      }
    }, [crateOrderOtpRequest]);
  return {
    loading,
    createOrder,
    prepareCreateOrder,
    createZaloPaymentOrder,
  };
};

function handleCreateOrderError(error: any): CreateOrderResult {
  const code = error?.response?.data?.errors?.code;

  const message = error?.response?.data?.errors?.message;

  if (code === 409) {
    return {
      success: false,
      type: "ECO_STAFF_CONFLICT",
      phone: error?.response?.data?.errors?.field,
    };
  }

  if (message === "Voucher Member invalid") {
    return {
      success: false,
      type: "INVALID_VOUCHER",
    };
  }

  return {
    success: false,
    type: "UNKNOWN",
    error,
  };
}