export type PaymentType =
  | "recieve"
  | "transfer"
  | "qrCode"
  | "domestic_card"
  | "international_card";

export type AddressType = "delivery" | "pickup";

export interface InvoiceInfo {
  isInvoiceRequested: boolean;
  type: 0 | 1 | null;
  // Personal
  fullName?: string;
  phoneNumber?: string;
  personalTaxOrCCCD?: string;
  // Company
  companyName?: string;
  taxCode?: string;
  // Shared
  invoiceEmail?: string;
  address?: string;
}

export interface CreateOrderBody {
  source: string;
  payment_status: string;
  url_order: string;
  invoiceInfo: InvoiceInfo;
  customer_fullname: string;
  customer_phone: string;
  payment_type: string;
  address_type: string;
  customer_full_address: string | null;
  pickup_address: AddressInfo;
  pickup_full_address: string;
  customer_address: string;
  estimated_delivery: string;
  ward_id: string;
  ward_name: string;
  province_id: string;
  province_name: string;
  erp_province_id: string;
  erp_ward_id: string;
  warehouse: string;
  isTaxIssued: boolean;
  invoice_company: string;
  invoice_address: string;
  receiver_fullname: string;
  receiver_phone: string;
  products: OrderProduct[];
  summary: OrderSummary;
  vouchers: Voucher[];
  shipping_type: string;
  totalAmountDiscount: number;
  finalAmount: number;
  otp: string;
  otp_phone: string;
}

export interface InvoiceInfo {
  isInvoiceRequested: boolean;
  type: string | null;
  fullName: string;
  phoneNumber: string;
  personalTaxOrCCCD: string;
  address: string;
  companyName: string;
  taxCode: string;
  invoiceEmail: string;
}

export interface AddressInfo {
  address: string;
  province_id: string;
  province_name: string;
  ward_id: string;
  ward_name: string;
  erp_province_id: string;
  erp_ward_id: string;
  full_address: string;
}

export interface OrderProduct {
  quantity: number;
  id: string;
  comboProducts?: ComboProduct[];
  product_type: string;
  product_code: string;
  promotion_id: string | null;
  estimated_point: number | null;
  autoReplen: string;
}

export interface ComboProduct {
  quantity: number;
  id: string;
  product_code: string;
  product_type: string;
  promotion_id: string | null;
  autoReplen: string;
  estimated_point: number | null;
}

export interface OrderSummary {
  discounted: number;
  total: number;
  orderPreDiscount: number;
  saved: number;
  orderValue: number;
  shippingFee: number;
  payment: number;
  totalPointUse: number;
}

export interface Voucher {
  id?: string;
  code?: string;
  discount?: number;
  [key: string]: any;
}
export interface CheckoutForm extends Omit<
  CreateOrderBody,
  "source" | "payment_status" | "url_order"
> {}

export interface CreateOrderRequest extends CreateOrderBody {}

export interface CreateOrderResponse {
  data: any;
}
export type CreateOrderResult =
  | {
      success: true;
      order: OrderResponse;
    }
  | {
      success: false;
      type: "ECO_STAFF_CONFLICT" | "INVALID_VOUCHER" | "UNKNOWN";
      phone?: string;
      error?: unknown;
    };
export interface OrderCostItem {
  amount: number;
  transactionEnum: string;
}

export interface OrderCosts {
  discount_promotion: OrderCostItem;
  discount_amount: OrderCostItem;
  order_total: OrderCostItem;
  collectible_amount: OrderCostItem;
}

export interface OrderAddress {
  receiver_fullname: string;
  receiver_phone: string;
  receiver_email: string | null;
  receiver_address: string;
  province_id: string;
  province_name: string;
  district_id: string;
  district_name: string | null;
  ward_id: string;
  ward_name: string;
  type: string;
  source_address: string | null;
}

export interface OrderProduct {
  id: string;
  promotion_name: string | null;
  promotion_id: string | null;
  product_id: string;
  product_name: string;
  product_code: string;
  product_type: string;
  quantity: number;
  unit_price: string;
  burn_point: number | null;
  estimated_point: number | null;
  original_price: string;
}

export interface Order {
  vouchers: Record<string, unknown>;

  id: string;
  code: string;

  customer_firstname: string;
  customer_lastname: string;
  customer_fullname: string;
  customer_phone: string;
  customer_mail: string | null;

  payment_type: string;
  payment_name: string | null;
  payment_status: string;

  note: string | null;

  source: string;
  status: string;

  shipping_type: string;
  address_type: string;

  cancel_reason: string | null;

  created_at: string;
  updated_at: string;
  estimated_delivery: string;

  costs: OrderCosts;

  invoice_company: string;
  invoice_no: string | null;
  invoice_tax_code: string;
  invoice_address: string;

  available_point: number;
  remain_point: number;

  is_eco: boolean;
  is_tax_issued: boolean;

  address: OrderAddress;

  products: OrderProduct[];
}

export interface PromotionResponse {
  products: PromotionProduct[];
  costs: PromotionCosts;
  totalOriginalPrice: number;
  totalDiscountPromotion: number;
  totalDiscountVoucher: number;
  shippingFee: number;
  collectibleAmount: number;
  isFirstOrder: boolean;
}

export interface PromotionProduct {
  productId: string;
  orderId: string | null;
  productType: string;
  productName: string;
  productCode: string;
  promotionId: string | null;
  promotionName: string | null;
  unitPrice: number;
  burnPoint: number | null;
  estimatedPoint: number | null;
  quantity: number;
  originalPrice: number;
  autoReplen: string | null;
  brand: string;
}

export interface PromotionCosts {
  discount_promotion: PromotionCostItem;
  discount_amount: PromotionCostItem;
  order_total: PromotionCostItem;
  collectible_amount: PromotionCostItem;
}

export interface PromotionCostItem {
  amount: number;
  transactionEnum:
    | "discount_promotion"
    | "discount_amount"
    | "order_total"
    | "collectible_amount";
}