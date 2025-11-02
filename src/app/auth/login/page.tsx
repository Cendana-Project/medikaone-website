'use client';

import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AuthCarousel from "@/components/auth/authCarousel";
import { useLoginHospital } from "@/hooks/auth/useLoginHospital";
import { loginHospitalSchema } from "@/validation/auth/loginSchema";
import { LoginHospitalRequest } from "@/types/auth";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { mutate, isPending } = useLoginHospital();
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<LoginHospitalRequest>({
        resolver: yupResolver(loginHospitalSchema),
    });

    const onSubmit = (data: LoginHospitalRequest) => mutate(data);

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="w-full xl:w-1/2 flex flex-col items-center justify-center p-4 lg:p-14 gap-8">
                <div className="text-center space-y-5 text-[#212121]">
                    <h1 className="text-4xl font-bold">Masuk Ke Akun Anda</h1>
                    <p className="w-full text-lg max-w-xl">
                        Akses informasi medis, jadwal dokter, hasil pemeriksaan, dan layanan
                        kesehatan Anda dengan aman.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-2xl gap-6 px-6">
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
                            {...register("identifier")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="password"
                            className="text-base font-semibold text-[#212121]"
                        >
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Masukkan password kamu"
                                {...register("password")}
                                className="py-6 placeholder:text-[#616161]"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="hospital_code"
                            className="text-base font-semibold text-[#212121]"
                        >
                            Hospital Code
                        </Label>
                        <Input
                            type="text"
                            id="hospital_code"
                            placeholder="Masukkan Kode Rumah Sakit"
                            {...register("hospital_code")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Checkbox id="remember" className="border-2" />
                            <Label
                                htmlFor="remember"
                                className="text-base font-normal text-[#212121]"
                            >
                                Ingat saya
                            </Label>
                        </div>
                        <Link href="/auth/forgot-password" className="text-base font-semibold text-[#1E1E1E]">
                            Lupa Kata Sandi
                        </Link>
                    </div>
                    <Button type="submit" className="bg-[#2F907F] py-6 text-base" disabled={isPending}>
                        {isPending ? "Loading..." : "Login"}
                    </Button>
                </form>
            </div>
            <AuthCarousel />
        </div>
    );
}