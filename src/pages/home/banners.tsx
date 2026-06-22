import Carousel from "@/components/carousel";
import { bannersState } from "@/request/banner";
// import Banner from "@/static/banner/banner.jpg";
// import Banner1 from "@/static/banner/banner1.jpg";
// import Banner2 from "@/static/banner/banner2.jpg";
import { useAtomValue } from "jotai";

export default function Banners() {
  // const banners = [
  //   {
  //     id: 0,
  //     url: Banner
  //   }, {
  //     id: 1,
  //     url: Banner1
  //   }, {
  //     id: 2,
  //     url: Banner2
  //   }
  // ]
  const banners1 = useAtomValue(bannersState('home'));
  return (
    <Carousel
      slides={banners1.map((banner) => (
        <img className="w-full rounded" src={banner.content} />
      ))}
    />
  );
}
