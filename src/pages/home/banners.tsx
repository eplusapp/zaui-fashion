import Carousel from "@/components/carousel";
import Banner from "@/static/banner/banner.jpg";
import Banner1 from "@/static/banner/banner1.jpg";
import Banner2 from "@/static/banner/banner2.jpg";

export default function Banners() {
  const banners = [
    {
      id: 0,
      url: Banner
    }, {
      id: 1,
      url: Banner1
    }, {
      id: 2,
      url: Banner2
    }
  ]

  return (
    <Carousel
      slides={banners.map((banner) => (
        <img className="w-full rounded" src={banner.url} />
      ))}
    />
  );
}
