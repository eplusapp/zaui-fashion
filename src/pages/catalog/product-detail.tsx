import Button from "@/components/button";
import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { formatPrice } from "@/utils/format";
import { useState } from "react";
import toast from "react-hot-toast";
import { productDetailState } from "@/request/product";
import Carousel from "@/components/carousel";
import RelatedProducts from "./related-products";
import ProductSectionsRenderer from "@/components/product-detail-section";
import { Product } from "@/types/products";
import { useCart } from "@/hook/useCart";
import ProductComboSection from "@/components/product-combo-section";
import QuantityInput from "@/components/quantity-input";
import { Icon } from "zmp-ui";
import { CartIcon } from "@/components/vectors";
import { openPhone } from "zmp-sdk";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useAtomValue(productDetailState(String(id)))!;
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [quantity, setQuantity] = useState(1);

  const [tab, setTab] = useState<
    'detail' | 'ingredients'
  >('detail');

  const tabs = [
    {
      key: 'detail',
      label: 'Chi tiết sản phẩm',
    },
    {
      key: 'ingredients',
      label: 'Thành phần',
    },
  ];
  const { addToCart, buyNow } = useCart();

  const renderVariant = () => {
    const listVariant = product?.sku_related?.filter(x => x.sell_on?.includes("Web Ecogreen") && x.brand !== "COMBO")
    if (product.brand === "COMBO") {
      return null;
    }
    return <div className={`flex gap-4 flex-wrap mt-4 mb-2`}>
      {listVariant?.map(x => {
        const isSelected = x.id === selectedProduct?.id
        return <div onClick={() => setSelectedProduct(x)} className={`
          border-[1px] border-black/15 px-4 rounded-[8px] min-w-[100px] text-center
          ${isSelected
            ? `border-primary-eco-blue text-primary-eco-blue font-semibold `
            : ` border-black/15 text-black `
        } `}>
          {x.sku}
        </div>
      })}
    </div>
  }
  const renderTab = () => {
    if (product.brand === "COMBO") {
      return <ProductComboSection record={product} />
    }
    return (
      <div className="overflow-hidden  bg-white">
        <div className=" flex overflow-x-auto bg-neutral-50">
          {tabs.map(item => {
            const selected = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() =>
                  setTab(
                    item.key as
                    | 'detail'
                    | 'ingredients',
                  )
                }
                className={` relative min-w-fit px-5 py-4 text-sm font-semibold transition-all duration-200 
                  ${selected ? ` bg-white text-primary` : `text-neutral-500` }`}
              >
                {item.label}
                {selected && (
                  <div className="  absolute  bottom-0  left-0  right-0  h-[2px]  bg-primary"/>
                )}
              </button>
            );
          })}
        </div>
        <div className="p-4">
          {tab === 'detail' && <ProductSectionsRenderer data={product.product_detail} />}
          {tab === 'ingredients' && <ProductSectionsRenderer data={product.product_detail} only={['ingredients']} />}
        </div>
      </div>
    )
  } 
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-4 pb-4">
          <div className="py-2 pb-0">
            <Carousel
              slides={product?.images?.map((banner) => (
                <img className="w-full aspect-square" src={banner.slug} />
              ))}
              previewImages={product?.images?.map(x => x.slug)}
            />
          </div>
          {renderVariant()} 
          <div className="text-[24px] font-[700] text-primary">
            {formatPrice(Number(product.discount_price || product.original_price))}
          </div>
          {!!product.original_price && (
            <div className="text-[18px] text-subtitle line-through">
              {formatPrice(Number(product.original_price))}
            </div>
          )}
          <div className="pt-2">
            <QuantityInput
              value={quantity}
              minValue={1}
              size={25}
              onChange={(value) => {
                setQuantity(value)
              }}
            />
          </div>
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
        <div className="">
          {renderTab()}
        </div>
        <div className="bg-section h-2 w-full"></div>

        <div className="font-medium py-2 px-4">
          <div className="pt-2 pb-2.5">Sản phẩm khác</div>
          <HorizontalDivider />
        </div>
        <RelatedProducts currentProductId={String(product?.id)} />
      </div>

      <HorizontalDivider />
      <div className="flex-none grid grid-cols-3 gap-2 py-3 px-4">
        <Button
          large
          className="px-0 py-0"
          onClick={() => {
            openPhone({
              phoneNumber: "0869896089",
            });
          }}
        >
          <div className="w-full flex flex-col items-center">
            <Icon
              icon="zi-call"
            />
            <div className="w-full">
              Gọi mua hàng
            </div>
          </div>
        </Button>
        <Button
          className="px-0 py-0"
          large
          onClick={() => {
            if (!selectedProduct && product.brand !== "COMBO") {
              toast.error("Vui lòng chọn loại sản phẩm");
              return;
            }
            if (selectedProduct) {
              addToCart(selectedProduct as Product, quantity);
            } else {
              addToCart(product as Product, quantity);
            }
          }}
        >
          <div className="w-full flex flex-col items-center">
            <CartIcon />
            <div className="w-full">
              Thêm vào giỏ
            </div>
          </div>
        </Button>
        <Button
          large
          primary
          className="px-0 py-0"
          onClick={() => {
            if (!selectedProduct && product.brand !== "COMBO") {
              toast.error("Vui lòng chọn loại sản phẩm");
              return;
            }
            if (selectedProduct) {
              buyNow(selectedProduct as Product, quantity);
            } else {
              buyNow(product as Product, quantity);
            }
            navigate("/check-out");
          }}
        >
          <div className="text-lg font-bold">
            Mua ngay
          </div>
        </Button>
      </div>
    </div>
  );
}
