import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
    ProductDetail,
    ComboProduct,
} from "@/types/products";
import { formatPrice } from "@/utils/format";

interface ProductComboSectionProps {
    record: ProductDetail;
}


const ProductComboSection = memo(
    ({ record }: ProductComboSectionProps) => {
        const navigate = useNavigate();

        const comboDetail = useMemo(() => {
            if (
                typeof record.product_detail ===
                "string"
            ) {
                return "";
            }
            return (
                (
                    record.product_detail as any
                )?.comboDetail || ""
            );
        }, [record.product_detail]);
        const comboProducts = useMemo<
            ComboProduct[]
        >(() => {
            if (
                !record.comboProducts ||
                typeof record.comboProducts ===
                "string"
            ) {
                return [];
            }

            return record.comboProducts;
        }, [record.comboProducts]);

        const onClickProduct = (
            product: ComboProduct,
        ) => {
            navigate(`/product/${product.slug}`);
        };

        return (
            <div className="px-4 py-4">
                <div
                    className="  rounded-2xl  border border-black/5  bg-white  shadow-sm  overflow-hidden"
                >
                    <div className="px-4 pt-5 pb-2">
                        <div className="text-xl font-[800] text-[#202332]">
                            {record.name}
                        </div>
                    </div>

                    {!!comboDetail && (
                        <div className="px-4 pb-4">
                            <div
                                className="text-md  leading-6  text-[#475467]"
                                dangerouslySetInnerHTML={{
                                    __html: comboDetail,
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-5 space-y-4">
                    {comboProducts.map((item) => {
                        return (
                            <div
                                key={item.id}
                                onClick={() =>
                                    onClickProduct(item)
                                }
                                className="  rounded-2xl  border border-black/5  bg-white  shadow-sm  p-3  cursor-pointer  active:scale-[0.98]  transition-all"
                            >
                                <div
                                    className="  flex  gap-3  items-center  max-md:flex-col"
                                >
                                    <div
                                        className="w-full   shrink-0  flex  items-center  justify-center  rounded-xl  bg-[#F9FAFB]"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="  w-full  h-full  object-contain"
                                        />
                                    </div>

                                    <div className="flex-1 w-full">
                                        <div
                                            className="  text-[18px]  font-[800]  text-[#323232]"
                                        >
                                            {item.name}
                                        </div>
                                        <div
                                            className="  mt-2  text-[18px]  font-[700]  text-[#1E266E]"
                                        >
                                            {formatPrice(Number(item.price))}
                                        </div>
                                        <div
                                            className="  mt-2"
                                        >
                                            {item.effects?.items?.map((x, index) => (
                                                <div className="text-md  leading-6  text-[#475467] flex gap-1" key={index}>
                                                    <div className=" mt-2 h-1.5 w-1.5 min-w-1.5 rounded-full bg-[#475467]"                                                    />
                                                    <span>{x.content}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    },
);

export default ProductComboSection;