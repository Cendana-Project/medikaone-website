'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRegisterAdmin } from "@/hooks/auth/useRegisterAdmin";
import { RegisterAdminForm } from "@/types/auth";
import { registerAdminSchema } from "@/validation/auth/registerAdminHospitalSchema";
import ConfirmModal, { ConfirmDetailItem } from "@/components/ui/confirm-modal";

interface RegisterAdminHospitalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegisterAdminHospitalModal({
    isOpen,
    onClose,
}: RegisterAdminHospitalModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [formData, setFormData] = useState<RegisterAdminForm | null>(null);

    const { mutate, isPending } = useRegisterAdmin();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterAdminForm>({
        resolver: zodResolver(registerAdminSchema),
        defaultValues: {
            hospitalId: "",
            email: "",
            username: "",
            phone: "",
            password: "",
            confirmPassword: "",
            first_name: "",
            last_name: "",
            dob: "",
            address: "",
            gender: "L",
            nik: "",
        },
    });

    const handleFormSubmit = (data: RegisterAdminForm) => {
        setFormData(data);
        setIsConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        if (!formData) return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hospitalId, confirmPassword, ...payload } = formData;
        mutate(
            { hospitalId, ...payload },
            {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    reset();
                    onClose();
                },
                onError: () => {
                    setIsConfirmOpen(false);
                },
            }
        );
    };

    const handleModalClose = () => {
        if (!isPending) {
            reset();
            onClose();
        }
    };

    const confirmDetails: ConfirmDetailItem[] = formData
        ? [
            { label: "Kode Rumah Sakit", value: formData.hospitalId },
            { label: "Nama Admin", value: `${formData.first_name || ""} ${formData.last_name || ""}`.trim() || formData.username || formData.email },
            { label: "Email", value: formData.email },
            { label: "Username", value: formData.username },
            { label: "No. Telepon", value: formData.phone || "-" },
        ]
        : [];

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
                <DialogContent className="max-w-xl bg-white rounded-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-0">
                    {/* Modal Header */}
                    <div className="px-7 pt-7 pb-4 border-b border-gray-100 shrink-0">
                        <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                            Tambah Admin Rumah Sakit
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1 font-normal">
                            Pastikan identitas akun sesuai dengan user
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-7 pb-5 flex flex-col gap-4">
                            {/* Hospital Code / ID Input */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="hospitalId" className="text-sm font-medium text-gray-800">
                                    Kode Rumah Sakit <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    id="hospitalId"
                                    placeholder="Contoh: HSP-MO-001"
                                    {...register("hospitalId")}
                                    className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                />
                                {errors.hospitalId && <p className="text-red-500 text-xs mt-0.5">{errors.hospitalId.message}</p>}
                            </div>

                            {/* Email & Username */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-800">
                                        Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        placeholder="email@domain.com"
                                        {...register("email")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="username" className="text-sm font-medium text-gray-800">
                                        Username <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="username"
                                        placeholder="username"
                                        {...register("username")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.username && <p className="text-red-500 text-xs mt-0.5">{errors.username.message}</p>}
                                </div>
                            </div>

                            {/* Password & Confirm Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-800">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            placeholder="Masukkan password"
                                            {...register("password")}
                                            className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm pr-11 focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password.message}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-800">
                                        Re - type password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirm ? "text" : "password"}
                                            id="confirmPassword"
                                            placeholder="Ulangi password"
                                            {...register("confirmPassword")}
                                            className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm pr-11 focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((prev) => !prev)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            {/* First & Last Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="first_name" className="text-sm font-medium text-gray-800">
                                        Nama Depan <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                                    </Label>
                                    <Input
                                        id="first_name"
                                        placeholder="Nama depan"
                                        {...register("first_name")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.first_name && <p className="text-red-500 text-xs mt-0.5">{errors.first_name.message}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="last_name" className="text-sm font-medium text-gray-800">
                                        Nama Belakang <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                                    </Label>
                                    <Input
                                        id="last_name"
                                        placeholder="Nama belakang"
                                        {...register("last_name")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.last_name && <p className="text-red-500 text-xs mt-0.5">{errors.last_name.message}</p>}
                                </div>
                            </div>

                            {/* Phone & Gender */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-800">
                                        Nomor Telepon <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="phone"
                                        placeholder="+628123456789 atau 08123456789"
                                        {...register("phone", {
                                            onChange: (e) => {
                                                const raw = e.target.value;
                                                const cleaned = raw.replace(/^1+(\+62|0)/, "$1").replace(/^1+(?=\+62)/, "");
                                                setValue("phone", cleaned);
                                            },
                                        })}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone.message}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="gender" className="text-sm font-medium text-gray-800">
                                        Jenis Kelamin <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => setValue("gender", value as "L" | "P")}
                                        defaultValue={watch("gender") || "L"}
                                    >
                                        <SelectTrigger className="w-full h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm text-gray-800 focus:bg-white focus:ring-[#3BB49F]/20 focus:border-[#3BB49F]">
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                                            <SelectItem value="L">Laki-laki</SelectItem>
                                            <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-red-500 text-xs mt-0.5">{errors.gender.message}</p>}
                                </div>
                            </div>

                            {/* DOB & NIK */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="dob" className="text-sm font-medium text-gray-800">
                                        Tanggal Lahir <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        id="dob"
                                        {...register("dob")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.dob && <p className="text-red-500 text-xs mt-0.5">{errors.dob.message}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="nik" className="text-sm font-medium text-gray-800">
                                        NIK <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="nik"
                                        placeholder="16 digit NIK"
                                        {...register("nik")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.nik && <p className="text-red-500 text-xs mt-0.5">{errors.nik.message}</p>}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="address" className="text-sm font-medium text-gray-800">
                                    Alamat Lengkap <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                                </Label>
                                <Input
                                    type="text"
                                    id="address"
                                    placeholder="Alamat domisili admin"
                                    {...register("address")}
                                    className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-0.5">{errors.address.message}</p>}
                            </div>
                        </div>

                        {/* Form Actions Footer */}
                        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 shrink-0 bg-white">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleModalClose}
                                disabled={isPending}
                                className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl px-6 h-11 text-sm font-semibold cursor-pointer shadow-xs"
                            >
                                Batalkan
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-xl px-7 h-11 text-sm font-semibold cursor-pointer shadow-xs"
                            >
                                Daftar Akun
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirmation Popup Modal */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmSubmit}
                isLoading={isPending}
                title="Konfirmasi Tambah Admin Rumah Sakit"
                description={`Apakah Anda yakin ingin mendaftarkan user admin ini untuk kode rumah sakit "${formData?.hospitalId}"?`}
                confirmText="Ya, Daftarkan Admin"
                cancelText="Kembali"
                details={confirmDetails}
            />
        </>
    );
}

