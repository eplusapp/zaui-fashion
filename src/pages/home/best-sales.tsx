import ProductGrid from "@/components/product-grid";
import Section from "@/components/section";
import { useAtomValue } from "jotai";
import { productsState } from "@/request/product";
import { useMemo } from "react";

export default function BestSales() {

  const products = useAtomValue(productsState({
    page: 1,
    limit: 99999
  }));

  return (
    <Section title="Sản phẩm bán chạy" viewMoreTo="/best-seller">
      <ProductGrid products={products} />
    </Section>
  );
}
