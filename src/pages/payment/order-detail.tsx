import ProductItem from "@/components/product-item";
import SearchBar from "@/components/search-bar";
import Section from "@/components/section";
import { ProductItemSkeleton } from "@/components/skeleton";
import { SearchIconLarge } from "@/components/vectors";
import { useAtom, useAtomValue } from "jotai";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  keywordState,
  recommendedProductsState,
} from "@/state";
import { useNavigate, useParams } from "react-router-dom";
import { bestSaleProductsState, getOrderState, productsState } from "@/request/product";
import { Product } from "@/types/products";
type Props = {
  searchResult: Product[];
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const orderState = useAtomValue(getOrderState({ code: String(id) }));
  console.log("🚀 ~ OrderDetailPage ~ orderState:", orderState)

  return (
    <div className="py-2">

    </div>
  );
}
