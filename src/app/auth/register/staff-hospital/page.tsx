'use client';

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { registerStaffSchema } from "@/validation/auth/registerStaffHospitalSchema";
import { RegisterStaffForm } from "@/types/auth";
import { useRegisterStaffHospital } from "@/hooks/auth/useRegisterStaffHospital";

export default function RegisterStaffPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { mutate, isPending } = useRegisterStaffHospital();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<RegisterStaffForm>({
        resolver: yupResolver(registerStaffSchema),
        defaultValues: {
            hospitalId: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            first_name: "",
            last_name: "",
            role: "nurse",
        },
    });

    const onSubmit = (data: RegisterStaffForm) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, hospitalId, ...payload } = data;
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
                    <h1 className="text-4xl font-bold">Daftarkan Staff Rumah Sakit</h1>
                    <p className="w-full text-lg max-w-lg">
                        Akses sistem rumah sakit dengan aman dan mudah.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col w-full max-w-3xl gap-6 px-6"
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="hospitalId">Kode Rumah Sakit</Label>
                        <Input id="hospitalId" {...register("hospitalId")} placeholder="Contoh: RS123" />
                        {errors.hospitalId && <p className="text-red-500 text-sm">{errors.hospitalId.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" placeholder="Masukkan username" {...register("username")} />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-base font-semibold text-[#212121]">
                            Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="Masukkan email"
                            {...register("email")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="phone" className="text-base font-semibold text-[#212121]">
                            Nomor Telepon
                        </Label>
                        <Input
                            type="text"
                            id="phone"
                            placeholder="Contoh: +628123456789"
                            {...register("phone")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 relative">
                        <Label htmlFor="password" className="text-base font-semibold text-[#212121]">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Masukkan password"
                                {...register("password")}
                                className="py-6 placeholder:text-[#616161]"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 relative">
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
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 overflow-visible"
                            >
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="first_name" className="text-base font-semibold text-[#212121]">
                            Nama Depan
                        </Label>
                        <Input
                            type="text"
                            id="first_name"
                            placeholder="Masukkan nama depan"
                            {...register("first_name")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="last_name" className="text-base font-semibold text-[#212121]">
                            Nama Belakang
                        </Label>
                        <Input
                            type="text"
                            id="last_name"
                            placeholder="Masukkan nama belakang"
                            {...register("last_name")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="dob">Tanggal Lahir</Label>
                        <Input type="date" id="dob" {...register("dob")} />
                        {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Input id="address" placeholder="Masukkan alamat lengkap" {...register("address")} />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="gender">Jenis Kelamin</Label>
                        <Select onValueChange={(value) => setValue("gender", value as "L" | "P")}>
                            <SelectTrigger className="py-6 text-[#212121]">
                                <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="L">Laki-laki</SelectItem>
                                <SelectItem value="F">Perempuan</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nik">NIK</Label>
                        <Input id="nik" placeholder="Masukkan NIK" {...register("nik")} />
                        {errors.nik && <p className="text-red-500 text-sm">{errors.nik.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="role" className="text-base font-semibold text-[#212121]">
                            Role Pegawai
                        </Label>
                        <Select
                            onValueChange={(value) => setValue("role", value as "nurse" | "receptionist" | "bod" | "doctor")}
                        >
                            <SelectTrigger className="py-6 text-[#212121]">
                                <SelectValue placeholder="Pilih role pegawai" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nurse">Perawat (Nurse)</SelectItem>
                                <SelectItem value="doctor">Dokter (Doctor)</SelectItem>
                                <SelectItem value="receptionist">Resepsionis (Receptionist)</SelectItem>
                                <SelectItem value="bod">BOD (Manajemen)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-red-500 text-sm">{errors.role.message}</p>
                        )}
                    </div>


                    <div className="flex items-center gap-3">
                        <Checkbox id="agree" />
                        <Label htmlFor="agree" className="text-base font-normal text-[#212121]">
                            Saya setuju dengan Ketentuan Layanan dan Kebijakan Privasi
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="bg-[#2F907F] py-6 text-base"
                        disabled={isPending}
                    >
                        {isPending ? "Mendaftarkan..." : "Daftar Akun"}
                    </Button>
                </form>
            </div>
        </div>
    );
}