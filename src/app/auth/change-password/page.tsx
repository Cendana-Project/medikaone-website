'use client';

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCarousel from "@/components/auth/authCarousel";

import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { changePasswordRequest } from "@/types/auth";
import { changePasswordSchema } from "@/validation/auth/passwordSchema";

export default function ChangePassword() {
    const { mutate, isPending } = useChangePassword();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<changePasswordRequest>({
        resolver: yupResolver(changePasswordSchema),
    });

    const onSubmit = (data: changePasswordRequest) => {
        mutate(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-14 gap-8">
                <Button type="submit" className="bg-[#2F907F] py-6 text-base">
                    <Link href="/auth/login" className="flex items-center gap-2 text-white font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </Button>
                <div className="text-center space-y-5 text-[#212121]">
                    <h1 className="text-4xl font-bold">Lupa Kata Sandi</h1>
                    <p className="w-full text-lg max-w-lg">
                        Akses informasi medis, jadwal dokter, hasil pemeriksaan, dan layanan kesehatan Anda dengan aman.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-6 px-6">
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="email"
                            className="text-base font-semibold text-[#212121]"
                        >
                            Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="Masukkan Email Kamu"
                            className="py-6 placeholder:text-[#616161]" 
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="pin" className="text-base font-semibold text-[#212121]">
                            Pin
                        </Label>
                        <Input
                            type="text"
                            id="pin"
                            placeholder="Masukkan PIN Kamu"
                            className="py-6 placeholder:text-[#616161]"
                            {...register("pin")}
                        />
                        {errors.pin && <p className="text-sm text-red-500">{errors.pin.message}</p>}
                    </div>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="new_password"
                            placeholder="Masukkan Password Baru Kamu"
                            {...register("new_password")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                    </div>
                    <Button type="submit" className="bg-[#2F907F] py-6 text-base disabled={isLoading}">
                        {isPending ? "Mengirim..." : "Kirim"}
                    </Button>
                </form>
            </div>
            <AuthCarousel />
        </div>
    );
}