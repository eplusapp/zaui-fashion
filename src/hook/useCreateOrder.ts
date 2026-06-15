import { useCallback, useState } from "react";
import { useSetAtom } from "jotai";
import { openWebview } from "zmp-sdk/apis";

import {
  CreateOrderBody,
  CreateOrderResult,
  CreateOrderResponse,
  PaymentType,
} from "@/types/order";
import { createOrderState, createOrderOtpState } from "@/request/product";
import { requestWithFallback } from "@/utils/request";
import { getConfig } from "@/utils/template";
import { addOrderState } from "@/request/order";

interface CreateOrderParams {
  form: CreateOrderBody;
  callback?: (order: any) => void;
  isOrderVNVC?: boolean;
}


export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const addOrder = useSetAtom(addOrderState);

  const createOrderRequest = useSetAtom(createOrderState);
  const crateOrderOtpRequest = useSetAtom(createOrderOtpState);

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
        if (order?.data) {   
          addOrder({
            ...order?.data,
            estimated_delivery: form.estimated_delivery,
          });       
          if (
            form.payment_type === "recieve" ||
            form.payment_type === "transfer"
          ) {
            if (callback) {
              callback(order.data?.code);
            }
          } else {
            await handlePayment({
              order: order?.data,
              paymentType: form.payment_type as PaymentType,
              amount: form.summary?.payment || 0,
            });
          }
          
        }
        return {
          success: true,
          order,
        };
      } catch (error) {
        return handleCreateOrderError(error);
      } finally {
        setLoading(false);
      }
    },
    [createOrderRequest],
  );
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
  };
};

async function handlePayment({
  order,
  paymentType,
  amount,
}: {
  order: any;
  paymentType: PaymentType;
  amount: number;
}) {

  const referenceNumber = `${order.code}_${Date.now()}`;
  const API_URL = getConfig((config) => config.template.apiUrl);
  
  const returnUrl = `${API_URL}/order/${order.code}`;

  
  switch (paymentType) {
    case "domestic_card":
    case "international_card":
      try {
        const response = await requestWithFallback<any>(
          `/payment/redirect?card=vnpay&reference_number=${encodeURIComponent(
            referenceNumber,
          )}&amount=${amount}&return_url=${encodeURIComponent(returnUrl)}`,
          {},
          {
            method: "GET",
          },
        );
        const paymentUrl =
          response?.paymentUrl ??
          response?.data?.paymentUrl ??
          response?.data ??
          response?.url;
        if (paymentUrl) {
          await openWebview({
            url: paymentUrl,
          });
        }
      } catch (error) {
        console.error("Payment error:", error);
      }
      return;
    case "qrCode":
      return {
        redirect: `/checkout/payment/${order.code}`,
      };
    case "recieve":
    default:
      return {
        redirect: `/checkout/payment/${order.code}`,
      };
  }
}

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