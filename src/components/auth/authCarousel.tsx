"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselApi,
} from "@/components/ui/carousel";

export default function AuthCarousel() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => setCurrent(api.selectedScrollSnap()));
    }, [api]);

    return (
        <div className="hidden xl:block xl:w-1/2 relative p-4">
            <div className="relative w-full overflow-hidden rounded-2xl">
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    <CarouselContent>
                        <CarouselItem>
                            <div className="relative w-full h-screen">
                                <Image
                                src="/auth/bg1.png"
                                alt="Doctor Picture"
                                fill
                                className="object-contain xl:object-cover object-center"
                                />
                            </div>
                        </CarouselItem>

                        <CarouselItem>
                            <div className="relative w-full h-screen">
                                <Image
                                src="/auth/bg2.png"
                                alt="Picture 2"
                                fill
                                className="object-contain xl:object-cover object-center"
                                />
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
                <div className="absolute lg:bottom-16 xl:bottom-6 left-1/2 -translate-x-1/2 w-[85%] xl:w-[90%] bg-white rounded-2xl shadow-lg py-4 xl:py-12 lg:px-6 gap-8 text-center slide-image">
                    <h3 className="font-semibold text-base xl:text-lg text-black">
                        🩺 Buat Perjanjian Secara Online
                    </h3>
                    <p className="text-gray-600 text-sm xl:text-base leading-relaxed">
                        Buat perjanjian dengan lebih cepat, mudah, dan efisien bersama
                        MedicalOne—solusi terbaik untuk mengatur jadwal medis Anda kapan
                        saja dan di mana saja. Nikmati kemudahan akses, tanpa repot, dengan
                        layanan digital yang dirancang khusus untuk Anda.
                    </p>
                    <div className="flex justify-center items-center gap-3 mt-6">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`transition-all rounded-full h-2 ${
                                current === index ? "w-10 bg-[#2F907F]" : "w-6 bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}