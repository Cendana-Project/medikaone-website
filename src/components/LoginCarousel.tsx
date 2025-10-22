// src/components/LoginCarousel.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// Import images so we can read their intrinsic width/height and preserve aspect ratio
// Use public paths instead of static imports to avoid module resolution errors
const slides = [
  { id: 1, src: '/carousel-slide-1.jpg', alt: 'Slide 1' },
  { id: 2, src: '/carousel-slide-2.jpg', alt: 'Slide 2' },
];

type LoginCarouselProps = {
  fit?: 'cover' | 'contain'
}

export function LoginCarousel({ fit = 'cover' }: LoginCarouselProps) {
  const plugin = React.useRef<any>(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const [aspectMap, setAspectMap] = React.useState<Record<number, string>>({});
  const [statusMap, setStatusMap] = React.useState<Record<number, 'pending' | 'loaded' | 'error'>>({});

  React.useEffect(() => {
    // Load each image to read naturalWidth / naturalHeight
    slides.forEach((s) => {
      setStatusMap((p) => ({ ...p, [s.id]: 'pending' }));
      const img = new window.Image();
      img.src = s.src;
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setStatusMap((p) => ({ ...p, [s.id]: 'loaded' }));
        if (w && h) {
          setAspectMap((prev) => ({ ...prev, [s.id]: `${(h / w) * 100}%` }));
        }
      };
      img.onerror = () => {
        setStatusMap((p) => ({ ...p, [s.id]: 'error' }));
      };
    });
  }, []);

  // Ensure the container that Image.fill relies on has an explicit height.
  // We'll use a responsive aspect ratio with a min-height so the card remains
  // visually balanced and never collapses to zero height.
  return (
    <div
      className="relative mx-auto overflow-hidden rounded-xl shadow-2xl w-[65%] sm:w-[180px] md:w-[300px] lg:w-[400px] max-h-[90vh]"
      style={{ aspectRatio: '700 / 1035' }}
    >
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={() => plugin.current?.stop?.()}
        onMouseLeave={() => plugin.current?.reset?.()}
      >
        <CarouselContent className="h-full">
          {slides.map((slide) => {
            // Use measured aspect ratio from aspectMap when available
            const aspectPct = aspectMap[slide.id] ?? '56.25%';

            return (
              <CarouselItem key={slide.id} className="relative p-0">
                {/* Wrapper that enforces intrinsic image aspect ratio using padding-top trick */}
                <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      style={{ objectFit: fit }}
                      className="w-full h-full"
                      priority={slide.id === 1}
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}