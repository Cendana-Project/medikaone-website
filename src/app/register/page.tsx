// src/app/register/page.tsx
'use client';

import RegisterForm from '../../components/RegisterForm'; // Komponen Form yang baru
import { LoginCarousel } from '../../components/LoginCarousel';   // Re-use komponen carousel
import { QueryClientProviderComponent } from '../../components/QueryClientProviderComponent';

export default function RegisterPage() {
  return (
    <QueryClientProviderComponent>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* Kolom Kiri: Form Registrasi */}
        <div className="flex flex-col items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md space-y-8">
            <RegisterForm /> {/* <-- Menggunakan form yang baru */}
          </div>
        </div>

        {/* Kolom Kanan: Carousel (Sama Persis dengan Login) */}
        <div className="hidden lg:flex relative items-center justify-center bg-primary h-screen py-16 px-8">
          <LoginCarousel /> 
        </div>
      </div>
    </QueryClientProviderComponent>
  );
}