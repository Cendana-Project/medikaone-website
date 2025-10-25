import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCarousel from "@/components/auth/authCarousel";
import { ArrowLeft } from "lucide-react";

export default function Login() {
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

                <form action="" className="flex flex-col w-full gap-6 px-6">
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
                            placeholder="Enter your email"
                            className="py-6 placeholder:text-[#616161]" 
                        />
                        <p className="text-base font-normal text-[#212121]">
                            Silakan masukkan email terdaftar Anda untuk menerima tautan pengaturan ulang kata sandi.
                        </p>
                    </div>
                    <Button type="submit" className="bg-[#2F907F] py-6 text-base">
                        Login
                    </Button>
                </form>
            </div>
            <AuthCarousel />
        </div>
    );
}
