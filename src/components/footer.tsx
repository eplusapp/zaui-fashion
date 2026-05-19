import { CartIcon, CategoryIcon, HomeIcon, OrderHistoryIcon, OrderIcon, ProfileIcon } from "./vectors";
import HorizontalDivider from "./horizontal-divider";
import { useAtomValue } from "jotai";
import { cartState } from "@/state";
import TransitionLink from "./transition-link";
import { useCart } from "@/hook/userAddToCart";
import { formatPrice } from "@/utils/format";

const NAV_ITEMS = [
  {
    name: "Trang chủ",
    path: "/",
    icon: HomeIcon,
  },
  // {
  //   name: "Danh mục",
  //   path: "/categories",
  //   icon: CategoryIcon,
  // },
  {
    name: "Đơn hàng",
    path: "/orders",
    icon: OrderIcon,
  },
  {
    name: "Giỏ hàng",
    path: "/cart",
    icon: (props) => {
      const { totalQuantity } = useCart();

      return (
        <div className="relative">
          {totalQuantity > 0 && (
            <div className="absolute top-0 left-[18px] h-4 px-1.5 pt-[1.5px] pb-[0.5px] rounded-full bg-[#FF3333] text-white text-[10px] leading-[14px] font-medium shadow-[0_0_0_2px_white]">
              {totalQuantity > 9 ? "9+" : totalQuantity}
            </div>
          )}
          <CartIcon {...props} />
        </div>
      );
    },
  }
];

export default function Footer() {
  const { totalPrice } = useCart();

  return (
    <>
      <HorizontalDivider />
      <div
        className="w-full px-4 pt-2 flex"
        style={{
          paddingBottom: `max(16px, env(safe-area-inset-bottom)`,
        }}
      >
        {NAV_ITEMS.map((item) => {
          if(item.path === '/cart') {
            return <div key={item.path} className="cursor-pointer flex-[2] bg-[#EAECF5] rounded flex gap-1 pl-1">
              <TransitionLink
                to={item.path}
                className="flex flex-[1] flex-col items-center space-y-0.5 p-1 pb-0.5 cursor-pointer active:scale-105 align-center"
              >
                {({ isActive }) => (
                  <>
                    <div className="w-6 h-6 flex justify-center items-center">
                      <item.icon active={isActive} />
                    </div>
                    <div className={`text-2xs ${isActive ? "text-primary" : ""}`}>
                      {item.name}
                    </div>
                  </>
                )}
              </TransitionLink>
              <TransitionLink to="/check-out" className="flex-[2] bg-primary-eco-blue rounded flex flex-col items-center">
                <div className="text-white font-[700]">
                  {formatPrice(totalPrice)}
                </div>
                <div className="text-white font-[500]">
                  Đặt mua
                </div>
              </TransitionLink>
            </div>
          }
          return (
            <TransitionLink
              to={item.path}
              key={item.path}
              className="flex flex-1 flex-col items-center space-y-0.5 p-1 pb-0.5 cursor-pointer active:scale-105"
            >
              {({ isActive }) => (
                <>
                  <div className="w-6 h-6 flex justify-center items-center">
                    <item.icon active={isActive} />
                  </div>
                  <div className={`text-2xs ${isActive ? "text-primary" : ""}`}>
                    {item.name}
                  </div>
                </>
              )}
            </TransitionLink>
          );
        })}
      </div>
    </>
  );
}
