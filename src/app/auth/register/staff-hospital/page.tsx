'use client';

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsModal } from "@/components/auth/TermsModal";
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
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [hasReadTerms, setHasReadTerms] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [termsModalTab, setTermsModalTab] = useState<"terms" | "privacy">("terms");

    const openTermsModal = (tab: "terms" | "privacy" = "terms") => {
        setTermsModalTab(tab);
        setIsTermsModalOpen(true);
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        if (!hasReadTerms) {
            e.preventDefault();
            openTermsModal("terms");
        }
    };

    const { mutate, isPending } = useRegisterStaffHospital();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<RegisterStaffForm>({
        resolver: zodResolver(registerStaffSchema),
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
            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                defaultTab={termsModalTab}
                onAccept={() => {
                    setHasReadTerms(true);
                    setAgreedTerms(true);
                }}
            />
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
                    <p className="text-xs text-gray-500 self-end">
                        <span className="text-red-500">*</span> Wajib diisi
                    </p>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="hospitalId" className="text-base font-semibold text-[#212121]">
                            Kode Rumah Sakit <span className="text-red-500">*</span>
                        </Label>
                        <Input id="hospitalId" {...register("hospitalId")} placeholder="Contoh: RS123" />
                        {errors.hospitalId && <p className="text-red-500 text-sm">{errors.hospitalId.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username" className="text-base font-semibold text-[#212121]">
                            Username <span className="text-red-500">*</span>
                        </Label>
                        <Input id="username" placeholder="Masukkan username" {...register("username")} />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-base font-semibold text-[#212121]">
                            Email <span className="text-red-500">*</span>
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
                            Nomor Telepon <span className="text-red-500">*</span>
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
                            Password <span className="text-red-500">*</span>
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
                            Konfirmasi Password <span className="text-red-500">*</span>
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
                            Nama Depan <span className="text-red-500">*</span>
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
                            Nama Belakang <span className="text-red-500">*</span>
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
                        <Label htmlFor="dob" className="text-base font-semibold text-[#212121]">
                            Tanggal Lahir <span className="text-red-500">*</span>
                        </Label>
                        <Input type="date" id="dob" {...register("dob")} />
                        {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="address" className="text-base font-semibold text-[#212121]">
                            Alamat <span className="text-red-500">*</span>
                        </Label>
                        <Input id="address" placeholder="Masukkan alamat lengkap" {...register("address")} />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="gender" className="text-base font-semibold text-[#212121]">
                            Jenis Kelamin <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(value) => setValue("gender", value as "L" | "P")}>
                            <SelectTrigger className="py-6 text-[#212121]">
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
                        <Label htmlFor="nik" className="text-base font-semibold text-[#212121]">
                            NIK <span className="text-red-500">*</span>
                        </Label>
                        <Input id="nik" placeholder="Masukkan NIK" {...register("nik")} />
                        {errors.nik && <p className="text-red-500 text-sm">{errors.nik.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="role" className="text-base font-semibold text-[#212121]">
                            Role Pegawai <span className="text-red-500">*</span>
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
                        <div onClick={handleCheckboxClick} className="flex items-center">
                            <Checkbox
                                id="agree"
                                checked={agreedTerms}
                                onCheckedChange={(checked) => {
                                    if (hasReadTerms) {
                                        setAgreedTerms(!!checked);
                                    } else {
                                        openTermsModal("terms");
                                    }
                                }}
                                className="w-5 h-5 rounded-[4px] border-[#236C5F] data-[state=checked]:bg-[#2F907F] data-[state=checked]:border-[#236C5F] cursor-pointer"
                            />
                        </div>
                        <Label htmlFor="agree" className="text-base font-normal text-[#212121]">
                            Saya setuju dengan{" "}
                            <button
                                type="button"
                                onClick={() => openTermsModal("terms")}
                                className="font-semibold text-[#2F907F] hover:underline cursor-pointer"
                            >
                                Ketentuan Layanan
                            </button>{" "}
                            dan{" "}
                            <button
                                type="button"
                                onClick={() => openTermsModal("privacy")}
                                className="font-semibold text-[#2F907F] hover:underline cursor-pointer"
                            >
                                Kebijakan Privasi
                            </button>
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="bg-[#2F907F] py-6 text-base cursor-pointer"
                        disabled={isPending || !agreedTerms}
                    >
                        {isPending ? "Mendaftarkan..." : "Daftar Akun"}
                    </Button>
                </form>
            </div>
        </div>
    );
}