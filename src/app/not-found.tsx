"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-[#F1FAF9] px-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex flex-col items-center"
            >
                <Sparkles className="h-16 w-16 text-[#2F907F] mb-6 animate-pulse" />

                <h1 className="text-7xl font-extrabold bg-gradient-to-r from-[#2F907F] to-[#3FB39D] bg-clip-text text-transparent mb-4">
                    404
                </h1>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Halaman Tidak Ditemukan
                </h2>

                <p className="text-gray-500 max-w-md mb-8">
                    Sepertinya kamu nyasar ke halaman yang tidak tersedia.  
                    Coba periksa kembali alamat link atau kembali ke beranda.
                </p>

                <Button
                asChild
                size="lg"
                className="bg-[#2F907F] hover:bg-[#267869] text-white px-8 py-6 text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <Link href="/">Kembali ke Beranda</Link>
                </Button>
            </motion.div>
        </div>
    );
}