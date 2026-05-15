import ProductGrid from "@/components/product-grid";
import Section from "@/components/section";
import { useAtomValue } from "jotai";
import { bestSaleProductsState } from "@/request/product";

export default function BestSales() {
  const products = useAtomValue(bestSaleProductsState);

  return (
    <Section title="Sản phẩm bán chạy" viewMoreTo="/best-seller">
      <ProductGrid products={products} />
    </Section>
  );
}
