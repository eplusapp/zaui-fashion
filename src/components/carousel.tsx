// Polyfills
import ResizeObserver from "resize-observer-polyfill";
Object.assign(window, { ResizeObserver });

import { ReactNode, useCallback, useEffect, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import clsx from "clsx";

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;

      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi
      .on("reInit", onInit)
      .on("reInit", onSelect)
      .on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export interface CarouselProps {
  slides: ReactNode[];
  previewImages?: string[];
  disabled?: boolean;
}

export default function Carousel({
  slides,
  previewImages,
  disabled,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
    },
    [
      Autoplay({
        active: !disabled,
      }),
    ]
  );

  const {
    selectedIndex,
    onDotButtonClick,
    scrollSnaps,
  } = useDotButton(emblaApi);

  return (
    <>
      {/* Main carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="flex-none basis-full flex items-center justify-center"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      {previewImages && previewImages.length ? <div className="flex gap-2 overflow-x-auto py-0 scrollbar-hide">
        {previewImages?.map((image, i) => (
          <button
            key={i}
            onClick={() => onDotButtonClick(i)}
            className={clsx(
              "flex-shrink-0 w-[23%] aspect-square  overflow-hidden border-2 transition-all",
              selectedIndex === i
                ? "border-primary"
                : "border-transparent"
            )}
          >
            <img
              src={image}
              alt={`preview-${i}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div> : <div className="py-4 flex justify-center items-center space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`rounded-full w-1 h-1 bg-black/10 ${index === selectedIndex && !disabled ? "bg-primary" : ""
              }`}
          />
        ))}
      </div>}
      
      
    </>
  );
}