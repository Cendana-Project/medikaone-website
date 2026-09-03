'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/auth/forgot-password");
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <p className="text-gray-500">Mengarahkan ke halaman lupa kata sandi...</p>
        </div>
    );
}