'use client';

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRegisterAdmin } from "@/hooks/auth/useRegisterAdmin";
import { RegisterAdminForm } from "@/types/auth";
import { registerAdminSchema } from "@/validation/auth/registerAdminHospitalSchema";

export default function RegisterAdminPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { mutate, isPending } = useRegisterAdmin();

    const {
        register,
        handleSubmit,
        setValue, watch,
        formState: { errors },
    } = useForm<RegisterAdminForm>({
        resolver: yupResolver(registerAdminSchema),
    });

    const onSubmit = (data: RegisterAdminForm) => {
        const { hospitalId, confirmPassword, ...payload } = data;
        mutate({ hospitalId, ...payload });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="w-full flex flex-col items-center justify-center p-4 lg:p-14 gap-8">
                <Button type="button" className="bg-[#2F907F] py-6 text-base">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </Button>

                <div className="text-center space-y-5 text-[#212121]">
                    <h1 className="text-4xl font-bold">Daftarkan Admin Rumah Sakit</h1>
                    <p className="w-full text-lg max-w-2xl">
                        Halaman ini hanya dapat diakses oleh Super Admin untuk membuat dan mengelola akun admin
                        rumah sakit yang bertanggung jawab terhadap data dan layanan kesehatan di sistem.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-3xl gap-6 px-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="hospitalId">Kode Rumah Sakit</Label>
                        <Input id="hospitalId" {...register("hospitalId")} placeholder="Contoh: RS123" />
                        {errors.hospitalId && <p className="text-red-500 text-sm">{errors.hospitalId.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-base font-semibold text-[#212121]">Email</Label>
                        <Input type="email" id="email" placeholder="Masukkan email admin" {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username" className="text-base font-semibold text-[#212121]">Username</Label>
                        <Input type="text" id="username" placeholder="Masukkan username" {...register("username")} />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password" className="text-base font-semibold text-[#212121]">Password</Label>
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </Button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="confirmPassword" className="text-base font-semibold text-[#212121]">
                            Konfirmasi Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showConfirm ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Ulangi password"
                                {...register("confirmPassword")}
                                className="py-6 placeholder:text-[#616161]"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowConfirm((prev) => !prev)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                aria-label={showConfirm ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </Button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="phone" className="text-base font-semibold text-[#212121]">Nomor Telepon</Label>
                        <Input type="text" id="phone" placeholder="+628xxxxxxxxxx" {...register("phone")} />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="first_name" className="text-base font-semibold text-[#212121]">Nama Depan</Label>
                        <Input type="text" id="first_name" placeholder="Nama depan" {...register("first_name")} />
                        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="last_name" className="text-base font-semibold text-[#212121]">Nama Belakang</Label>
                        <Input type="text" id="last_name" placeholder="Nama belakang" {...register("last_name")} />
                        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="dob" className="text-base font-semibold text-[#212121]">Tanggal Lahir</Label>
                        <Input type="date" id="dob" {...register("dob")} />
                        {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="address" className="text-base font-semibold text-[#212121]">Alamat</Label>
                        <Input type="text" id="address" placeholder="Masukkan alamat lengkap" {...register("address")} />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="gender" className="text-base font-semibold text-[#212121]">Jenis Kelamin</Label>
                        <Select
                            onValueChange={(value) => setValue("gender", value as "L" | "P")}
                            defaultValue={watch("gender")} 
                        >
                            <SelectTrigger className="w-full py-6 text-[#212121]">
                                <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="L">Laki-laki</SelectItem>
                                <SelectItem value="P">Perempuan</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nik" className="text-base font-semibold text-[#212121]">NIK</Label>
                        <Input type="text" id="nik" placeholder="Masukkan NIK" {...register("nik")} />
                        {errors.nik && <p className="text-red-500 text-sm">{errors.nik.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#2F907F] py-6 text-base text-white"
                    >
                        {isPending ? "Mendaftarkan..." : "Daftarkan Akun"}
                    </Button>
                </form>
            </div>
        </div>
    );
}