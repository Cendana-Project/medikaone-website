'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/profile");
    }, [router]);

    return <div className="p-6 text-sm text-gray-500">Mengarahkan ke Pengaturan Profil...</div>;
}
