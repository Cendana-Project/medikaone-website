'use client';

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import AuthCarousel from "@/components/auth/authCarousel";

const guestRoutes = [
    "/auth/login",
    "/auth/forgot-password",
    "/auth/verify-pin",
    "/auth/change-password",
    "/auth/reset-password",
];

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = Cookies.get("accessToken") || Cookies.get("refreshToken");
        const isGuestRoute = guestRoutes.some((route) => pathname.startsWith(route));
        if (token && isGuestRoute) {
            router.replace("/dashboard");
        }
    }, [pathname, router]);

    return (
        <div className="flex min-h-screen w-full bg-[#FFFFFF] font-sans overflow-x-hidden">
            {/* Left form section */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-14">
                {children}
            </div>

            {/* Right image section */}
            <AuthCarousel />
        </div>
    );
}
