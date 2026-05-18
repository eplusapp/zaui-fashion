import { useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import {
    Box,
    Text,
    Icon,
} from 'zmp-ui';

import type {
    ProductDetailData,
    ProductDetailItem,
} from '@/types/products';

type Props = {
    data: ProductDetailData | string;
    only?: Array<
        keyof ProductDetailData
    >;
    isVNVCShop?: boolean;
};

const DEFAULT_ONLY: Array<
    keyof ProductDetailData
> = [
        'specifications',
        'effects',
        'advantages',
        'features',
        'researches',
        'video',
        'faqs',
    ];

const SPECIAL_KEY =
    'Ưu đãi đặc biệt cho Quý Khách hàng của Hệ thống Trung tâm tiêm chủng vắc xin VNVC';

const SectionTitle = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <Text
            size="large"
            className="
        mb-4
        text-center
        text-xl
        font-bold
        uppercase
      "
        >
            {children}
        </Text>
    );
};

const MetaTable = ({
    items = [],
    isVNVCShop,
}: {
    items: ProductDetailItem[];
    isVNVCShop?: boolean;
}) => {
    return (
        <Box className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            {items.map((item, index) => {
                const isSpecial =
                    item.key === SPECIAL_KEY;

                if (
                    isSpecial &&
                    !isVNVCShop
                ) {
                    return null;
                }

                return (
                    <Box
                        key={index}
                        className="
              border-b
              border-neutral-200
              last:border-none
            "
                    >
                        {!isSpecial && (
                            <Box
                                className="
                  bg-neutral-50
                  px-4
                  py-3
                  text-sm
                  font-semibold
                "
                                dangerouslySetInnerHTML={{
                                    __html:
                                        item.key || '',
                                }}
                            />
                        )}

                        <Box
                            className="
                px-4
                py-3
                text-sm
                leading-6
                text-neutral-700
              "
                            dangerouslySetInnerHTML={{
                                __html:
                                    item.value || '',
                            }}
                        />
                    </Box>
                );
            })}
        </Box>
    );
};

export default function ProductSectionsRenderer({
    data: rawData,
    only = DEFAULT_ONLY,
    isVNVCShop = false,
}: Props) {
    const [faqOpen, setFaqOpen] =
        useState<number | null>(null);

    const [ researchRef] = useEmblaCarousel(
        {
            align: 'start',
            loop: true,
        },
        [
            Autoplay({
                delay: 3000,
            }),
        ],
    );
    const data =
        useMemo<ProductDetailData>(() => {
            if (!rawData) {
                return {} as ProductDetailData;
            }
            if (typeof rawData === 'string') {
                try {
                    return JSON.parse(rawData);
                } catch (error) {
                    console.log(
                        'parse product_detail error',
                        error,
                    );
                    return {} as ProductDetailData;
                }
            }
            return rawData;
        }, [rawData]);
    const [
        desktopImage,
        mobileImage,
    ] = useMemo(() => {
        const cover =
            data?.advantages
                ?.coverUrl;
        if (!cover) {
            return [null, null];
        }
        return cover.split(',');
    }, [data]);

    const ingredients = data?.ingredients?.items ?? [];
    const advantages = data.advantages?.items ?? [];
    const effects = data.effects?.items ?? [];
    const specifications = data.specifications?.items ?? [];
    const features = data.features?.items ?? [];
    const researches = data.researches?.items ?? [];
    const video = data.video?.youtube ?? null;
    const faqs = data.faqs?.items ?? [];

    return (
        <Box className="space-y-8 px-4 pb-8">
            {only.includes('ingredients') && ingredients.length > 0 && (
                    <section>
                        <SectionTitle>
                            Thành phần
                        </SectionTitle>
                        <MetaTable
                            items={ingredients}
                            isVNVCShop={
                                isVNVCShop
                            }
                        />
                    </section>
                )}
            {only.includes('advantages') && advantages?.length > 0 && (
                    <section>
                        <Box className="overflow-hidden rounded-3xl bg-cover bg-center p-5 text-white "
                            style={{
                                backgroundImage:
                                    desktopImage
                                        ? `url(${desktopImage})`
                                        : undefined,
                            }}
                        >
                            <SectionTitle>
                                Ưu điểm
                            </SectionTitle>
                            <ul className="space-y-3">
                            {advantages.map((item,index) => (
                                        <li
                                            key={index}
                                            className="relative pl-5 text-sm leading-6 "
                                        >
                                            <span
                                                className="
                          absolute
                          left-0
                          top-2
                          h-2
                          w-2
                          rounded-full
                          bg-white
                        "
                                            />

                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        item.content ||
                                                        '',
                                                }}
                                            />
                                        </li>
                                    ),
                                )}
                            </ul>
                        </Box>

                        {mobileImage && (
                            <img
                                src={mobileImage}
                                className="
                  mt-4
                  hidden
                  w-full
                  rounded-3xl
                  md:block
                "
                            />
                        )}
                    </section>
                )}

            {only.includes('effects') &&
                effects?.length >
                0 && (
                    <section>
                        <SectionTitle>
                            Công dụng
                        </SectionTitle>

                        <Box
                            className="
                grid
                grid-cols-1
                gap-4
              "
                        >
                        {effects.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <Box
                                        key={index}
                                        className="
                      flex
                      items-start
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-white
                      p-4
                    "
                                    >
                                        {item?.iconUrl && (
                                            <img
                                                src={
                                                    item.iconUrl
                                                }
                                                className="
                          mr-4
                          h-10
                          w-10
                          object-contain
                        "
                                            />
                                        )}

                                        <div
                                            className="
                        text-sm
                        leading-6
                        text-neutral-700
                      "
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    item.content ||
                                                    '',
                                            }}
                                        />
                                    </Box>
                                ),
                            )}
                        </Box>
                    </section>
                )}

            {only.includes(
                'specifications',
            ) &&
                specifications?.length >
                0 && (
                    <section>
                        <SectionTitle>
                            Thông tin sản phẩm
                        </SectionTitle>

                        <MetaTable
                            items={specifications}
                            isVNVCShop={
                                isVNVCShop
                            }
                        />
                    </section>
                )}

            {only.includes(
                'features',
            ) &&
                features?.length >
                0 && (
                    <section>
                        <SectionTitle>
                            Đặc điểm nổi bật
                        </SectionTitle>

                        <Box
                            className="
                grid
                grid-cols-2
                gap-4
              "
                        >
                            {features.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <Box
                                        key={index}
                                        className="
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-white
                      p-4
                      text-center
                    "
                                    >
                                        {item?.iconUrl && (
                                            <img
                                                src={
                                                    item?.iconUrl
                                                }
                                                className="
                          mx-auto
                          h-14
                          w-14
                          object-contain
                        "
                                            />
                                        )}

                                        <div
                                            className="
                        mt-4
                        text-sm
                        font-bold
                        uppercase
                      "
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    item.key ||
                                                    '',
                                            }}
                                        />

                                        <div
                                            className="
                        mt-2
                        text-xs
                        leading-5
                        text-neutral-600
                      "
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    item.value ||
                                                    '',
                                            }}
                                        />
                                    </Box>
                                ),
                            )}
                        </Box>
                    </section>
                )}

            {only.includes(
                'researches',
            ) &&
                researches?.length >
                0 && (
                    <section>
                        <SectionTitle>
                            Nghiên cứu khoa học
                        </SectionTitle>

                        <div
                            ref={researchRef}
                            className="overflow-hidden"
                        >
                            <div className="flex gap-4">
                                {researches.map(
                                    (
                                        item,
                                        index,
                                    ) => (
                                        <div
                                            key={index}
                                            className="
                        min-w-[85%]
                        rounded-3xl
                        bg-white
                        p-4
                        shadow-sm
                      "
                                        >
                                            {item.imageUrl && (
                                                <img
                                                    src={
                                                        item.imageUrl
                                                    }
                                                    className="
                            aspect-square
                            w-full
                            rounded-2xl
                            border
                            object-contain
                          "
                                                />
                                            )}

                                            <Box className="mt-4 flex gap-4">
                                                <Text
                                                    className="
                            text-3xl
                            font-bold
                            text-neutral-300
                          "
                                                >
                                                    {String(
                                                        index +
                                                        1,
                                                    ).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </Text>

                                                <Box>
                                                    <div
                                                        className="
                              text-base
                              font-bold
                            "
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                item.title ||
                                                                '',
                                                        }}
                                                    />

                                                    <div
                                                        className="
                              mt-2
                              text-sm
                              leading-6
                              text-neutral-600
                            "
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                item.description ||
                                                                '',
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </section>
                )}

            {only.includes('video') &&
                video && (
                    <section>
                        <SectionTitle>
                            Video
                        </SectionTitle>

                        <Box
                            className="
                overflow-hidden
                rounded-3xl
              "
                        >
                            <div
                                className="aspect-video"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        video,
                                }}
                            />
                        </Box>
                    </section>
                )}

            {only.includes('faqs') &&
                faqs?.length >
                0 && (
                    <section>
                        <SectionTitle>
                            Câu hỏi thường gặp
                        </SectionTitle>

                        <Box className="space-y-4">
                            {faqs.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const opened =
                                        faqOpen ===
                                        index;

                                    return (
                                        <Box
                                            key={index}
                                            className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-100
                        bg-white
                      "
                                        >
                                            <button
                                                className="
                          flex
                          w-full
                          items-center
                          justify-between
                          gap-4
                          p-4
                          text-left
                        "
                                                onClick={() =>
                                                    setFaqOpen(
                                                        opened
                                                            ? null
                                                            : index,
                                                    )
                                                }
                                            >
                                                <Box className="flex flex-1 items-center gap-3">
                                                    <Icon
                                                        icon="zi-help-circle"
                                                        className="text-blue-500"
                                                    />

                                                    <div
                                                        className="
                              text-sm
                              font-bold
                              uppercase
                            "
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                item?.question ||
                                                                '',
                                                        }}
                                                    />
                                                </Box>

                                                <Icon
                                                    icon="zi-chevron-down"
                                                    className={`transition-transform ${opened
                                                            ? 'rotate-180'
                                                            : ''
                                                        }`}
                                                />
                                            </button>

                                            {opened && (
                                                <Box
                                                    className="
                            border-t
                            border-blue-100
                            p-4
                          "
                                                >
                                                    <Box
                                                        className="
                              mb-3
                              flex
                              items-center
                              gap-2
                              font-semibold
                              text-blue-500
                            "
                                                    >
                                                        <Icon icon="zi-chat" />
                                                        <span>
                                                            Trả lời
                                                        </span>
                                                    </Box>

                                                    <div
                                                        className="
                              text-sm
                              leading-6
                              text-neutral-600
                            "
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                item?.answer ||
                                                                '',
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                },
                            )}
                        </Box>
                    </section>
                )}
        </Box>
    );
}