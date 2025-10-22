// src/app/page.tsx
'use client';

import { LoginForm } from '@/components/LoginForm';
import { LoginCarousel } from '@/components/LoginCarousel';
import { QueryClientProviderComponent } from '@/components/QueryClientProviderComponent';

export default function LoginPage() {
  return (
    // Membungkus seluruh aplikasi dengan provider TanStack Query
    <QueryClientProviderComponent>
      
      {/* Container utama: memastikan tinggi minimum layar */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* Kolom Kiri: Form Login */}
        <div className="flex flex-col items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md space-y-8">
            <LoginForm />
          </div>
        </div>

        {/* Kolom Kanan: Carousel (Sebagai Kartu Mengambang) */}
        <div 
          // h-screen untuk memberi batas tinggi penuh
          // py-16 dan px-8 untuk margin di sekitar kartu
          className="hidden lg:flex relative items-center justify-center bg-primary h-screen py-16 px-8" 
        >
          {/* Komponen LoginCarousel yang sekarang berfungsi sebagai kartu */}
          <LoginCarousel />
        </div>
        
      </div>
    </QueryClientProviderComponent>
  );
}