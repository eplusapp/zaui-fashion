import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import deepEqual from "fast-deep-equal";
import { requestWithFallback } from "@/utils/request";
import {
  DelivertyTimeRespond,
  DeliveryTimeParams,
  ProvinceParams,
  ProvinceResponse,
  WardParams,
  WardResponse,
} from "@/types/locations";
import moment from "moment";

export const provincesState = atomFamily(
  (params: ProvinceParams = {}) =>
    atom(async () => {
      const { size = 999 } = params;

      const res = await requestWithFallback<ProvinceResponse>(
        "/api/app/Province2025/GetAll",
        {
          data: [],
        },
        {
          method: "POST",
          body: JSON.stringify({
            size,
            query: {
              bool: {
                must: [
                  {
                    term: {
                      isDelete: false,
                    },
                  },
                ],
              },
            },
          }),
          baseUrl: "eco",
        },
      );

      return res.data?.sort((a, b) => (a.sort || 0) - (b.sort || 0)) || [];
    }),
  deepEqual,
);

export const wardsState = atomFamily(
  (params: WardParams = {}) =>
    atom(async () => {
      const { size = 100, provinceId } = params;

      const res = await requestWithFallback<WardResponse>(
        "/api/app/Ward2025/GetWardByProvince",
        {
          data: {
            wards: [],
          },
        },
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": "686ff9e204d34qsk581f548c0c0268fh",
          },
          body: JSON.stringify({
            size,
            query:
              provinceId !== undefined
                ? {
                    bool: {
                      must: {
                        term: {
                          code: provinceId,
                        },
                      },
                    },
                  }
                : undefined,
          }),
          baseUrl: "eco",
        },
      );

      return (res.data?.wards || []).sort(
        (a, b) => (a.sort || 0) - (b.sort || 0),
      );
    }),
  deepEqual,
);

export const deliveryTimeState = atomFamily(
  (params: DeliveryTimeParams) =>
    atom(async () => {
      const { provinceId } = params;
      const res = await requestWithFallback<any>(
        `/api/admin/estimated-delivery/calculate?provinceCode=${provinceId}&orderDate=${moment().format("YYYY-MM-DDTHH:mm:ss")}`,
        {
          estimatedWareHouse: "",
          estimatedWareHousePeriod: "",
        },
        {
          method: "GET",
        },
      );

      return res;
    }),
  deepEqual,
);