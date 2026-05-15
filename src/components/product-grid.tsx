import { Product } from "@/types/products";
import ProductItem from "./product-item";
import { HTMLAttributes } from "react";

export interface ProductGridProps extends HTMLAttributes<HTMLDivElement> {
  products: Product[];
  replace?: boolean;
}

export default function ProductGrid({
  products,
  className,
  replace,
  ...props
}: ProductGridProps) {
  return (
    <div
      className={"grid grid-cols-2 px-4 py-2 gap-6 ".concat(className ?? "")}
      {...props}
    >
      {products.map((product) => (
        <ProductItem key={product.id} product={product} replace={replace} />
      ))}
    </div>
  );
}
