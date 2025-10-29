'use client';

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCarousel from "@/components/auth/authCarousel";
import { ArrowLeft } from "lucide-react";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { useForm } from "react-hook-form";
import { forgetPasswordRequest } from "@/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/validation/auth/passwordSchema";

export default function ForgotPassword() {
    const { mutate, isPending } = useForgotPassword();

    const { register, handleSubmit, formState: { errors } } = useForm<forgetPasswordRequest>({
        resolver: yupResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: forgetPasswordRequest) => {
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
                        <p className="text-base font-normal text-[#212121]">
                            Silakan masukkan email terdaftar Anda untuk menerima tautan pengaturan ulang kata sandi.
                        </p>
                    </div>
                    <Button type="submit" className="bg-[#2F907F] py-6 text-base disabled={isLoading}">
                        {isPending ? "Mengirim..." : "Kirim Pin"}
                    </Button>
                </form>
            </div>
            <AuthCarousel />
        </div>
    );
}
