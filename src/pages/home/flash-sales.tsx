import Countdown from "@/components/countdown";
import ProductGrid from "@/components/product-grid";
import ProductItem from "@/components/product-item";
import Section from "@/components/section";
import { flashSaleSettingState, productsState } from "@/request/product";
import { useAtomValue } from "jotai";
const params = {
  is_flash_sale: true,
}
export default function FlashSales() {
  const setting = useAtomValue(flashSaleSettingState);
  console.log("🚀 ~ FlashSales ~ setting:", setting)

  const products = useAtomValue(productsState(params));

  if (setting?.end_time) {
    return (
      <div className="bg-primary-eco-blue py-1 pb-4">
        <div className="flex items-center justify-between px-2">
          <div className="text-lg font-[800] p-2 truncate text-white">Flash Sale</div>
          <Countdown endTime={setting.end_time} />
        </div>
        <div className="flex overflow-x-auto gap-3 w-full scrollbar-hide px-2 mt-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[40%]"
            >
              <ProductItem product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  } return <></>
  
}
