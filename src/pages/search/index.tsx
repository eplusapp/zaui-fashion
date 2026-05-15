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

export function SearchResult({
  searchResult = [],
}: Props) {
  return (
    <div className="w-full space-y-2 bg-section">
      <Section
        title={`Kết quả (${searchResult.length})`}
      >
        {searchResult.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 px-4 py-2">
            {searchResult.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <EmptySearchResult />
        )}
      </Section>

      {searchResult.length === 0 && (
        <RecommendedProducts />
      )}
    </div>
  );
}

export function EmptySearchResult() {
  return (
    <div className="p-6 space-y-4 flex flex-col items-center">
      <SearchIconLarge />
      <div className="text-inactive text-center text-2xs">
        Không có sản phẩm bạn tìm kiếm
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <Section title={`Kết quả`}>
      <div className="py-2 px-4 grid grid-cols-2 gap-4">
        <ProductItemSkeleton />
        <ProductItemSkeleton />
        <ProductItemSkeleton />
        <ProductItemSkeleton />
      </div>
    </Section>
  );
}

export function RecommendedProducts() {
  const recommendedProducts = useAtomValue(bestSaleProductsState);

  return (
    <Section title="Gợi ý sản phẩm">
      <div className="py-2 px-4 flex space-x-2 overflow-x-auto">
        {recommendedProducts.map((product) => (
          <div
            className="flex-none"
            style={{ flexBasis: "calc((100vw - 48px) / 2)" }}
          >
            <ProductItem key={product.id} product={product} />
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localKeyword, setLocalKeyword] = useState("");
  const [keyword, setKeyword] = useAtom(keywordState);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    return () => {
      setKeyword("");
    };
  }, []);
  const navigate = useNavigate();

  const params = useMemo(
    () => ({
      search: keyword,
    }),
    [keyword]
  );

  const products = useAtomValue(productsState(params));
  return (
    <>
      <div className="py-2">
        <SearchBar
          ref={inputRef}
          value={localKeyword}
          onChange={(e) => setLocalKeyword(e.currentTarget.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setKeyword(localKeyword);
            }
          }}
          onBlur={() => setKeyword(localKeyword)}
        />
      </div>
      {keyword ? (
        <Suspense fallback={<SearchResultSkeleton />}>
          <SearchResult searchResult={products} />
        </Suspense>
      ) : (
        <RecommendedProducts />
      )}
    </>
  );
}
