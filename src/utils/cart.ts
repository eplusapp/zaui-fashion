import { Product, SelectedOptions } from "@/types";
import { Order } from "@/types/order";
export const getOrderStatus = (order: Order, isOrderVNVC?: boolean) => {
  if (isOrderVNVC && order?.status === "open") {
    return "Chờ xác nhận";
  }
  if (order && order?.status) {
    switch (order?.status) {
      case "burning":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã huỷ";
      case "open":
        return "Chờ thanh toán";
      case "processing":
        return "Chờ xác nhận";
      case "completed":
        return "Hoàn tất";
      case "shipping":
        return "Chờ giao hàng";
      case "pre_cancel":
        return "Chờ huỷ";
      case "returning":
        return "Giao hàng thất bại";
      case "point_accumulating":
        return "Chờ tích điểm";
      case "re_shipping":
        return "Giao hàng lại";
      default:
        return "";
    }
  }
  return "";
};

export const getOrderColor = (order: Order, isOrderVNVC?: boolean) => {
  if (isOrderVNVC && order?.status === "open") {
    return  "#F7941D";
  }
  if (order && order?.status) {
    switch (order?.status) {
      case "burning":
        return "#F7941D";
      case "cancelled":
        return "#EE0F0F";
      case "open":
        return "#F7941D";
      case "processing":
        return "#F7941D";
      case "completed":
        return "#00B712";
      case "shipping":
        return "#F7941D";
      case "pre_cancel":
        return "#EE0F0F";
      case "returning":
        return "#EE0F0F";
      case "point_accumulating":
        return "#F7941D";
      case "re_shipping":
        return "#EE0F0F";
      default:
        return "#F7941D";
    }
  }
  return "#F7941D";
};