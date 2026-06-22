import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import deepEqual from "fast-deep-equal";
import { requestWithFallback } from "@/utils/request";
import { BannerResponse } from "@/types/home";

export interface BannerParams {
  slug?: string;
}

export const bannersState = atomFamily(
  (params: BannerParams = {}) =>
    atom(async () => {
      const { slug = "home" } = params;
      const res = await requestWithFallback<BannerResponse>(
        `/api/banner/all?slug=${slug}`,
        [],
        {
          method: "GET",
        },
      );
      return res || [];
    }),
  deepEqual,
);
