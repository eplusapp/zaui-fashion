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
import { useNavigate } from "react-router-dom";
import { bestSaleProductsState, productsState } from "@/request/product";
import { Product } from "@/types/products";
type Props = {
  searchResult: Product[];
};

export default function OrderPage() {

  return (
    <div className="py-2">

    </div>
  );
}
