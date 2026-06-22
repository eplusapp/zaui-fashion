import ProductFilter from "./product-filter";
import HorizontalDivider from "@/components/horizontal-divider";
import ProductGrid from "@/components/product-grid";
import { useAtomValue } from "jotai";
import { productsState } from "@/request/product";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import SearchBar from "@/components/search-bar";

export default function ProductListPage() {
  const { id } = useParams();
  const idList = id?.split(',')
  const navigate = useNavigate();
  
  const params = useMemo(
    () => ({
      is_flash_sale: false,
      sc: id ? idList : [],
      sub_categories: id ? idList : [],
    }),
    [id]
  );

  const products = useAtomValue(productsState(params));
  return (
    <>
      <div className="pb-2">
        <SearchBar onClick={() => navigate("/search")} />
      </div>
      <HorizontalDivider />
      <ProductGrid products={products} className="pt-4 pb-[13px]" />
    </>
  );
}
