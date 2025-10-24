import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AuthCarousel from "@/components/auth/authCarousel";

export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="w-1/2 flex flex-col items-center justify-center p-14 gap-8">
                <div className="text-center space-y-5 text-[#212121]">
                    <h1 className="text-4xl font-bold">Masuk Ke Akun Anda</h1>
                    <p className="w-full text-lg max-w-lg">
                        Akses informasi medis, jadwal dokter, hasil pemeriksaan, dan layanan
                        kesehatan Anda dengan aman.
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
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="password"
                            className="text-base font-semibold text-[#212121]"
                        >
                            Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
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
                    <Button type="submit" className="bg-[#2F907F] py-6 text-base">
                        Login
                    </Button>
                </form>
            </div>
            <AuthCarousel />
        </div>
    );
}