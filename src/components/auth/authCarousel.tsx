"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselApi,
} from "@/components/ui/carousel";

const slides = [
    {
        id: 1,
        image: "/auth/bg1.png",
        alt: "Doctor Banner 1",
    },
    {
        id: 2,
        image: "/auth/bg2.png",
        alt: "Doctor Banner 2",
    },
];

export default function AuthCarousel() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    );

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => setCurrent(api.selectedScrollSnap()));
    }, [api]);

    return (
        <div className="hidden lg:flex lg:w-1/2 h-screen p-4 items-center justify-center">
            <div className="relative w-full h-[calc(100vh-2rem)] overflow-hidden rounded-[16px] bg-[#2F907F] shadow-md">
                <Carousel
                    setApi={setApi}
                    plugins={[plugin.current]}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full h-full"
                >
                    <CarouselContent className="h-full -ml-0">
                        {slides.map((slide, idx) => (
                            <CarouselItem key={slide.id} className="pl-0 h-full">
                                <div className="relative w-full h-[calc(100vh-2rem)]">
                                    <Image
                                        src={slide.image}
                                        alt={slide.alt}
                                        fill
                                        priority={idx === 0}
                                        className="object-cover object-top"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Bullet Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`transition-all h-[7px] rounded-[84px] cursor-pointer ${
                                current === index
                                    ? "w-10 bg-[#2F907F]"
                                    : "w-8 bg-[#D9D9D9] hover:bg-gray-400"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}



