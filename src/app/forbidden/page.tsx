"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Forbidden() {
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = Cookies.get("accessToken") || Cookies.get("refreshToken");
        setHasToken(!!token);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-[#F1FAF9] px-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex flex-col items-center"
            >
                <ShieldAlert className="h-16 w-16 text-[#2F907F] mb-6 animate-pulse" />

                <h1 className="text-6xl font-extrabold bg-gradient-to-r from-[#2F907F] to-[#3FB39D] bg-clip-text text-transparent mb-4">
                    403
                </h1>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Akses Dilarang
                </h2>

                <p className="text-gray-500 max-w-md mb-8">
                    Kamu tidak memiliki izin untuk mengakses halaman ini.  
                    Jika kamu merasa ini kesalahan, hubungi administrator atau kembali ke beranda.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    {hasToken ? (
                        <Button
                        asChild
                        size="lg"
                        className="bg-[#2F907F] hover:bg-[#267869] text-white px-8 py-6 text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                        <Link href="/dashboard">Kembali ke Dashboard</Link>
                        </Button>
                    ) : (
                        <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="text-[#2F907F] border-[#2F907F] hover:bg-[#2F907F] hover:text-white transition-colors px-8 py-6 text-lg"
                        >
                        <Link href="/auth/login">Login</Link>
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}