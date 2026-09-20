'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RolesRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/roles");
    }, [router]);

    return <div className="p-6 text-sm text-gray-500">Mengarahkan ke Kelola Role...</div>;
}
