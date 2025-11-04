'use client';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { userInfo, loading, error, refetch } = useGetUserInfo();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
            <Spinner className="w-10 h-10 text-green-600" /> {/* ukuran & warna bisa disesuaikan */}
            </div>
        );
    }    
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
            <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                Gagal memuat data user. Silakan coba lagi nanti.
                </AlertDescription>
            </Alert>
            </div>
        );
    }

    if (!userInfo || userInfo.status !== "active") {
        return (
            <div className="flex items-center justify-center min-h-screen">
            <Alert variant="warning" className="max-w-md">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Akun Tidak Aktif</AlertTitle>
                <AlertDescription>
                Akun kamu tidak aktif atau data user tidak ditemukan.
                </AlertDescription>
            </Alert>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-[#F5F7F9]">
                <AppSidebar role={userInfo.role} />
                <main className="w-full">
                    <div className="bg-white py-6 px-4 border-b border-black/10">
                        <div className="self-start flex items-center gap-4">
                            <SidebarTrigger />
                            <h2 className="font-bold text-lg">Detail Pegawai Rumah Sakit</h2>
                            <span className="text-[#2596be] bg-[#f0f8fd] p-2 rounded-full text-xs">100 users</span>
                        </div>
                    </div>

                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}