'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, X } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateHospital } from "@/hooks/hospital/useCreateHospital";
import { createHospitalSchema } from "@/validation/hospital/hospitalSchema";
import ConfirmModal, { ConfirmDetailItem } from "@/components/ui/confirm-modal";

type CreateHospitalFormValues = z.infer<typeof createHospitalSchema>;

interface RegisterHospitalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegisterHospitalModal({
    isOpen,
    onClose,
}: RegisterHospitalModalProps) {
    const { mutate, isPending } = useCreateHospital();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [formData, setFormData] = useState<CreateHospitalFormValues | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateHospitalFormValues>({
        resolver: zodResolver(createHospitalSchema),
        defaultValues: {
            code: "",
            name: "",
            address: "",
            city: "",
            province: "",
            country: "Indonesia",
            phone: "",
            description: "",
        },
    });

    const handleFormSubmit = (data: CreateHospitalFormValues) => {
        setFormData(data);
        setIsConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        if (!formData) return;
        mutate(formData, {
            onSuccess: () => {
                setIsConfirmOpen(false);
                reset();
                onClose();
            },
            onError: () => {
                setIsConfirmOpen(false);
            },
        });
    };

    const handleModalClose = () => {
        if (!isPending) {
            reset();
            onClose();
        }
    };

    const confirmDetails: ConfirmDetailItem[] = formData
        ? [
            { label: "Kode RS", value: formData.code },
            { label: "Nama RS", value: formData.name },
            { label: "Kota", value: formData.city },
            { label: "No. Telepon", value: formData.phone },
        ]
        : [];

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
                <DialogContent className="max-w-xl bg-white rounded-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-0">
                    {/* Modal Header */}
                    <div className="px-7 pt-7 pb-4 border-b border-gray-100 shrink-0">
                        <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                            Register Rumah Sakit Baru
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1 font-normal">
                            Pastikan identitas rumah sakit sesuai dengan data resmi
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-7 pb-5 flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="code" className="text-sm font-medium text-gray-800">
                                        Kode Rumah Sakit <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="code"
                                        placeholder="Contoh: HSP-MO-001"
                                        {...register("code")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.code && <p className="text-red-500 text-xs mt-0.5">{errors.code.message}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-800">
                                        Nama Rumah Sakit <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: RS MedikaOne Jakarta"
                                        {...register("name")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name.message}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="address" className="text-sm font-medium text-gray-800">
                                    Alamat Lengkap <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    placeholder="Contoh: Jl. Sudirman No. 1"
                                    {...register("address")}
                                    className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-0.5">{errors.address.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="city" className="text-sm font-medium text-gray-800">
                                        Kota / Kabupaten <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="city"
                                        placeholder="Contoh: Jakarta Pusat"
                                        {...register("city")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-0.5">{errors.city.message}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="province" className="text-sm font-medium text-gray-800">
                                        Provinsi <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="province"
                                        placeholder="Contoh: DKI Jakarta"
                                        {...register("province")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.province && <p className="text-red-500 text-xs mt-0.5">{errors.province.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="country" className="text-sm font-medium text-gray-800">
                                        Negara <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="country"
                                        placeholder="Contoh: Indonesia"
                                        {...register("country")}
                                        className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                    />
                                    {errors.country && <p className="text-red-500 text-xs mt-0.5">{errors.country.message}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-800">
                                        Nomor Telepon RS <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        placeholder="Contoh: +628123456789 atau 08123456789"
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
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="description" className="text-sm font-medium text-gray-800">
                                    Deskripsi <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                                </Label>
                                <Input
                                    id="description"
                                    placeholder="Contoh: Rumah sakit rujukan umum"
                                    {...register("description")}
                                    className="h-11 bg-[#F8FAFC] border-gray-200 rounded-xl px-4 text-sm focus-visible:bg-white focus-visible:ring-[#3BB49F]/20 focus-visible:border-[#3BB49F]"
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-0.5">{errors.description.message}</p>}
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
                title="Konfirmasi Pendaftaran Rumah Sakit"
                description="Apakah Anda yakin data rumah sakit berikut sudah benar dan siap untuk didaftarkan ke dalam sistem?"
                confirmText="Ya, Daftarkan Rumah Sakit"
                cancelText="Kembali"
                details={confirmDetails}
            />
        </>
    );
}
