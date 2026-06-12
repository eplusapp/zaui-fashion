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
  comboProducts: string;
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
}

export type ReciveType = {
  type: "customer" | "eco";
  selectedProvince?: { id: string; name: string };
  selectedWard?: { id: string; name: string };
  address?: string;
  region?: "north" | "south" | "central";
};

export interface CheckVoucherBody {
  phone: string;
  voucherCode: string;
}
export interface VeryfiVoucherBody {
  phone: string;
  voucherCode: string;
  otpCode: string;
}
export interface Voucher {
  id: string;
  voucherCode: string;
  fullName: string;
  phone: string;
  voucherValue: number;
  voucherType: string;
  voucherName: string;
  description: string | null;
  voucherDefinitionType: string;
  availableQuantity: number;
  usedQuantity: number;
  status: string;
  startDate: string | null;
  expiredDate: string;
  maxValue: number | null;
  shippingFee: number | null;
  source: string;
  province: string;
  applySource: string;
  customerCode: string;
  brand: string;
  updatedUser: string | null;
  importBy: string | null;
  storeCode: string | null;
  storeName: string | null;
  drugStoreIp: string | null;
  updatedLogs: unknown | null;
  voucherStores: unknown[] | null;
  schemeStores: unknown[] | null;
  numberVoucher: number | null;
  applyMultiOrder: boolean | null;
  createdAt: string | null;
  updatedAt: string;
  promotion_id: string;
  caseNumber: string | null;
  ly_PromotionID: string | null;
  ly_ProductCode: string | null;
  ly_LoyaltyNumber: string | null;
  ly_CreatedBy: string | null;
  status_offset: string;
  status_offset_at: string | null;
  status_offset_by: string | null;
  extraInfo: {
    staffInfo: string;
  };
  orderCodeErp: string | null;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  voucherGroup: string;
}