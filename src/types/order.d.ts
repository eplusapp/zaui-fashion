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
  data: any
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