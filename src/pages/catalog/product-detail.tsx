import Button from "@/components/button";
import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { formatPrice } from "@/utils/format";
import { useEffect, useState } from "react";
import { useAddToCart } from "@/hooks";
import toast from "react-hot-toast";
import { Color, Size } from "@/types";
import { productDetailState } from "@/request/product";
import Carousel from "@/components/carousel";
import RelatedProducts from "./related-products";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useAtomValue(productDetailState(String(id)))!;
  const [selectedColor, setSelectedColor] = useState<Color>();
  const [selectedSize, setSelectedSize] = useState<Size>();


  const { addToCart, setOptions } = useAddToCart(product as any); //fix later

  useEffect(() => {
    setOptions({
      size: selectedSize,
      color: selectedColor?.name,
    });
  }, [selectedSize, selectedColor]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-4 pb-4">
          <div className="py-2 pb-0">
            <Carousel
              slides={product.images?.map((banner) => (
                <img className="w-full" src={banner.slug} />
              ))}
              previewImages={product.images.map(x => x.slug)}
            />
          </div>
          <div className="text-xl font-[700] text-primary">
            {formatPrice(Number(product.discount_price || product.original_price))}
          </div>
          {!!product.original_price && (
            <div className="text-2xs text-subtitle line-through">
              {formatPrice(Number(product.original_price))}
            </div>
          )}
        </div>
        {product?.description && (
          <>
            <div className="bg-section h-2 w-full"></div>
            <div className="p-4">
              <div dangerouslySetInnerHTML={{ __html: product?.description }} />
            </div>
          </>
        )}
        <div className="bg-section h-2 w-full"></div>
        <div className="font-medium py-2 px-4">
          <div className="pt-2 pb-2.5">Sản phẩm khác</div>
          <HorizontalDivider />
        </div>
        <RelatedProducts currentProductId={String(product?.id)} />
      </div>

      <HorizontalDivider />
      <div className="flex-none grid grid-cols-2 gap-2 py-3 px-4">
        <Button
          large
          onClick={() => {
            addToCart(1);
            toast.success("Đã thêm vào giỏ hàng");
          }}
        >
          Thêm vào giỏ
        </Button>
        <Button
          large
          primary
          onClick={() => {
            addToCart(1);
            navigate("/cart");
          }}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
