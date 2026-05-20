import { Product } from "@/types/products";
import { formatPrice } from "@/utils/format";
import TransitionLink from "./transition-link";
import { useState } from "react";
import IcPlus from "@/static/icon/plus.png";
import { useCart } from "@/hook/useCart";

export interface ProductItemProps {
  product: Product;
  /**
   * Whether to replace the current page when user clicks on this product item. Default behavior is to push a new page to the history stack.
   * This prop should be used when navigating to a new product detail from a current product detail page (related products, etc.)
   */
  replace?: boolean;
}

export default function ProductItem(props: ProductItemProps) {
  const [selected, setSelected] = useState(false);
  const image = props.product.images?.find(x => x.type === 'thumbnail')
  const { addToCart } = useCart()
  return (
    <TransitionLink
      className="
        flex flex-col
        cursor-pointer
        group
        overflow-hidden
        rounded-xl
        border border-black/5
        bg-white
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        hover:-translate-y-1
      "
      to={`/product/${props.product.slug}`}
      replace={props.replace}
      onClick={() => setSelected(true)}
    >
      {({ isTransitioning }) => (
        <>
          {image ? (
            <img
              src={image.slug}
              className="w-full aspect-square object-cover"
              style={{
                viewTransitionName:
                  isTransitioning && selected
                    ? `product-image-${props.product.id}`
                    : undefined,
              }}
              alt={props.product.name}
            />
          ) : null}

          <div className="flex flex-col items-center py-2 pt-0 text-center">
            <div className="text-base line-clamp-2">
              {props.product.name}
            </div>
            <div className="flex w-full items-center justify-between pt-2 px-2">
              <div className="w-full flex items-start flex-col">
                <div className="text-sm font-[700] text-[#1E266E] mt-1 ">
                  {formatPrice(Number(props.product.original_price))}
                </div>
                <div className="text-3xs text-subtitle line-through mt-0.5">
                  {formatPrice(Number(props.product.discount_price))}
                </div>
              </div>
              <div onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(props.product)
              }}>
                <img className="w-7 h-7" src={IcPlus} />
              </div>
            </div>
          </div>
        </>
      )}
    </TransitionLink>
  );
}
