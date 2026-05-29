import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { requestWithFallback } from "@/utils/request";
import { getUserInfo } from "zmp-sdk";
import { PaginatedResponse } from "@/types/pagination";
import {
  CheckVoucherBody,
  CheckVoucherResponse,
  FlashSaleSettingRes,
  Product,
  ProductDetail,
  ProductParams,
} from "@/types/products";
import deepEqual from "fast-deep-equal";
import { CreateOrderBody, CreateOrderResponse } from "@/types/order";

export const userState = atom(() =>
  getUserInfo({
    avatarType: "normal",
  }),
);

export const bestProductsState = atom(async (get) => {
  // const categories = await get(categoriesState);
  const res = await requestWithFallback<PaginatedResponse<Product>>(
    "/api/product/best-seller",
    {
      data: [],
      paginate: {
        total_data: 0,
        total_page: 0,
        page: 0,
        limit: 0,
      },
    },
  );
  return res.data;
});

export const bestSaleProductsState = atom((get) => get(bestProductsState));
export const flashSaleSettingState = atom(async (get) => {
  const res = await requestWithFallback<FlashSaleSettingRes>(
    "/api/product/flash-sale-setting",
    {
      data: undefined,
    },
  );
  return res?.data;
});
export const productsState = atomFamily(
  (body: ProductParams) =>
    atom(async () => {
      const defaultBody: ProductParams = {
        limit: 9999,
        sort_by: "order",
        sort_type: "ASC",
        sell_on: ["Web Ecogreen"],
        is_flash_sale: false,
      };
      const res = await requestWithFallback<PaginatedResponse<Product>>(
        "/api/product/filter",
        {
          data: [],
          paginate: {
            total_data: 0,
            total_page: 0,
            page: 0,
            limit: 0,
          },
        },
        {
          method: "POST",
          body: JSON.stringify({
            ...defaultBody,
            ...body,
          }),
        },
      );

      return res.data;
    }),
  deepEqual,
);
export const productDetailState = atomFamily((id: string) =>
  atom(async () => {
    const res = await requestWithFallback<{
      data?: ProductDetail;
    }>(`/api/product/slug/${id}`, {
      data: undefined,
    });
    return res.data;
  }),
);
export interface GetFeeByCodeBody {
  receiverProvinceErpId?: string | number;
  receiverProvinceName?: string;
  receiverDistrictErpId?: string | number;
  weight?: number;
  price?: number;
}
export const feeByCodeState = atomFamily(
  (body: GetFeeByCodeBody) =>
    atom(async () => {
      const res = await requestWithFallback<any>(
        "/api/app/Booking/GetFeeByCode/get-fee-by-code",
        {
          data: undefined,
        },
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );

      return res.data;
    }),
  deepEqual,
);
//order-vnvc
export const createOrderState = atom(
  null,
  async (_, __, body: CreateOrderBody) => {
    return requestWithFallback<CreateOrderResponse>(
      "/api/order",
      {} as CreateOrderResponse,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },
);

export const getOrderOtpState = atom(null, async () => {
  return requestWithFallback<Boolean>(
    "/api/settings?key=ORDER_OTP",
    false as Boolean,
    {
      method: "GET",
    },
  );
});
export interface GetOrderParams {
  code: string;
}
export interface OrderResponse {
  error?: string;
  code: string;
  status: string;
  payment_status: string;
  customer_fullname: string;
  customer_phone: string;
  finalAmount: number;
  createdAt: string;
  products: any[];
}

export const getOrderState = atomFamily(
  ({ code }: GetOrderParams) =>
    atom(async () => {
      return requestWithFallback<OrderResponse>(
        `/api/order/${code}`,
        {} as OrderResponse,
        {
          method: "GET",
        },
      );
    }),
  deepEqual,
);

export const checkingVoucherState = atom(
  null,
  async (_, __, body: CheckVoucherBody) => {
    return requestWithFallback<CheckVoucherResponse>(
      "/api/order/checking-eco-voucher",
      {} as CheckVoucherResponse,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },
);