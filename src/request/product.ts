import { atom } from "jotai";
import { atomFamily, unwrap } from "jotai/utils";
import { Cart, Category, Color } from "@/types";
import { requestWithFallback } from "@/utils/request";
import { getUserInfo } from "zmp-sdk";
import { PaginatedResponse  } from "@/types/pagination";
import { FlashSaleSetting, FlashSaleSettingRes, Product, ProductParams } from "@/types/products";

export const userState = atom(() =>
  getUserInfo({
    avatarType: "normal",
  })
);

export const selectedTabIndexState = atom(0);

export const bestProductsState = atom(async (get) => {
  // const categories = await get(categoriesState);
  const res = await requestWithFallback<
    (PaginatedResponse<Product>)
  >("/api/product/best-seller", {
    data: [],
    paginate: {
      total_data: 0,
      total_page: 0,
      page: 0,
      limit: 0
    }
  });
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
export const productsState = atomFamily((body: ProductParams) =>
  atom(async () => {
    const defaultBody: ProductParams = {
      limit: 21,
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
);

