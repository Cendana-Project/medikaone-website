'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateHospital } from "@/hooks/hospital/useCreateHospital";
import { createHospitalSchema } from "@/validation/hospital/hospitalSchema";

type CreateHospitalFormValues = z.infer<typeof createHospitalSchema>;

export default function RegisterHospitalPage() {
    const router = useRouter();
    const { mutate, isPending } = useCreateHospital();

    const {
        register,
        handleSubmit,
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

    const onSubmit = (data: CreateHospitalFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard");
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="w-full flex flex-col items-center justify-center p-4 lg:p-14 gap-8">
                <Button type="button" className="bg-[#2F907F] py-6 text-base">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>
                </Button>

                <div className="text-center space-y-5 text-[#212121]">
                    <h1 className="text-4xl font-bold">Daftarkan Rumah Sakit Baru</h1>
                    <p className="w-full text-lg max-w-2xl">
                        Halaman ini khusus diakses oleh Super Admin untuk mendaftarkan instansi/rumah sakit baru ke dalam platform MedikaOne.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-3xl gap-6 px-6">
                    <p className="text-xs text-gray-500 self-end">
                        <span className="text-red-500">*</span> Wajib diisi
                    </p>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="code" className="text-base font-semibold text-[#212121]">
                            Kode Rumah Sakit <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="code"
                            placeholder="Contoh: HSP-MO-001"
                            {...register("code")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                        {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-base font-semibold text-[#212121]">
                            Nama Rumah Sakit <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Contoh: RS MedikaOne Jakarta"
                            {...register("name")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="address" className="text-base font-semibold text-[#212121]">
                            Alamat Lengkap <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="address"
                            placeholder="Contoh: Jl. Sudirman No. 1"
                            {...register("address")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="city" className="text-base font-semibold text-[#212121]">
                                Kota / Kabupaten <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="city"
                                placeholder="Contoh: Jakarta"
                                {...register("city")}
                                className="py-6 placeholder:text-[#616161]"
                            />
                            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="province" className="text-base font-semibold text-[#212121]">
                                Provinsi <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="province"
                                placeholder="Contoh: DKI Jakarta"
                                {...register("province")}
                                className="py-6 placeholder:text-[#616161]"
                            />
                            {errors.province && <p className="text-red-500 text-sm">{errors.province.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="country" className="text-base font-semibold text-[#212121]">
                                Negara <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="country"
                                placeholder="Contoh: Indonesia"
                                {...register("country")}
                                className="py-6 placeholder:text-[#616161]"
                            />
                            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone" className="text-base font-semibold text-[#212121]">
                                Nomor Telepon RS <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                placeholder="Contoh: 021-1234567"
                                {...register("phone")}
                                className="py-6 placeholder:text-[#616161]"
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description" className="text-base font-semibold text-[#212121]">
                            Deskripsi <span className="text-gray-400 font-normal">(Opsional)</span>
                        </Label>
                        <Input
                            id="description"
                            placeholder="Contoh: Rumah sakit rujukan nasional"
                            {...register("description")}
                            className="py-6 placeholder:text-[#616161]"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#2F907F] py-6 text-base text-white hover:bg-[#257366] transition"
                    >
                        {isPending ? "Mendaftarkan..." : "Daftarkan Rumah Sakit"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
