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
            <div className="flex min-h-screen w-full">
                <AppSidebar role={userInfo.role} />
                <main className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="self-start mb-4">
                        <SidebarTrigger />
                    </div>

                    <div className="w-full max-w-4xl bg-[#F5F7F9]">
                        <div>

                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}