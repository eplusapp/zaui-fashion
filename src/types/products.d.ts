export interface ProductImage {
  slug: string;
  path: string;
  size: string;
  type: "image" | "thumbnail" | "meta_image" | string;
}

export interface ProductTag {
  [key: string]: unknown;
}

export interface ProductDetailSection {
  items: ProductDetailItem[];
  coverUrl?: string;
}


type ProductParams = {
  limit?: number;
  sort_by?: string;
  sort_type?: string;
  sell_on?: string[];
  is_flash_sale: boolean;
};

export type FlashSaleProduct = {
  id: string;
  product_id: string;
  brand: string;
  discount_percentage: number;
};

export type FlashSaleSetting = {
  active: boolean;
  isEffective: boolean;
  start_time: string;
  end_time: string;
  products: FlashSaleProduct[];
};

export type FlashSaleSettingRes = {
  data: FlashSaleSetting | undefined;
};

type ProductDetailItem = {
  key?: string;
  value?: string;
  content?: string;
  question?: string;
  answer?: string;
  iconUrl?: string;
};

type ProductDetailSection = {
  items: ProductDetailItem[];
};

type ProductResearchItem = {
  title: string;
  description: string;
  imageUrl: string;
};

type ProductResearchSection = {
  items: ProductResearchItem[];
};

type ProductVideo = {
  youtube: string;
};

type ProductAdvantages = {
  items: ProductDetailItem[];
  coverUrl?: string;
};

export interface ProductDetailData {
  ingredients?: ProductDetailSection;
  specifications?: ProductDetailSection;
  effects?: ProductDetailSection;
  advantages?: ProductAdvantages;
  features?: ProductDetailSection;
  researches?: ProductResearchSection;
  faqs?: ProductDetailSection;
  video?: ProductVideo;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string;
}

export interface ProductImage {
  slug: string;
  path: string;
  size: string;
  type: string;
}

export interface ProductTag {
  id: string;
  name: string;
  description?: string;
  slug?: string;
}

export interface ComboProduct {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  quantity: number;
  image: string;
  effects: {
    items: {
      iconUrl: string;
      content: string;
    }[];
  };
  promotionName?: string;
}

export interface ProductDetail extends Product {
  categories?: ProductCategory;
  sub_categories?: ProductCategory;

  sku_related?: Product[];

  product_detail: ProductDetailData | string;

  comboProducts?: ComboProduct[] | string;
}
export interface Product {
  id?: string;
  name: string;
  description: string;
  original_price: string | number;
  discount_price: number;
  is_flash_sale: boolean;
  flash_sale_price: number;
  flash_sale_sold_count: number;
  flash_sale_remaining_quantity: number;
  product_origin: string;
  product_gender: string;
  product_age_min: string;
  product_age_max: string;
  display: string;
  product_code: string;
  product_id: string;
  ingredient: string;
  benefit: string;
  brand: string;
  product_type: string;
  expired_date: string;
  sku: string;
  unit: string;
  created_at: string;
  product_detail: ProductDetailData | string;
  tag: ProductTag[];
  images: ProductImage[];
  relateds: string;
  slug: string;
  order: string;
  quantity: number;
  sell_on: string[];
  weight: number;
  comboProducts: string[];
}