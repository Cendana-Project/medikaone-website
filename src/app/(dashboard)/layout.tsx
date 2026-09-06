'use client';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import LanguageAndNotification from "@/components/LanguageAndNotification";

import { usePathname } from "next/navigation";

const getHeaderInfo = (pathname: string) => {
    if (pathname.startsWith("/profile")) {
        return { title: "Pengaturan Profil", badge: null };
    }
    if (pathname.startsWith("/roles")) {
        return { title: "Kelola Role", badge: null };
    }
    if (pathname.startsWith("/doctors")) {
        return { title: "Kelola Dokter", badge: null };
    }
    if (pathname.startsWith("/departments")) {
        return { title: "Kelola Departemen", badge: null };
    }
    if (pathname.startsWith("/rooms")) {
        return { title: "Kelola Ruangan", badge: null };
    }
    if (pathname.startsWith("/system")) {
        return { title: "System Setting", badge: null };
    }
    return { title: "Detail Pegawai Rumah Sakit", badge: "100 users" };
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const { userInfo, loading, error } = useGetUserInfo();
    const pathname = usePathname();
    const headerInfo = getHeaderInfo(pathname);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <Spinner className="w-10 h-10 text-green-600" />
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
        <SidebarProvider className="h-screen w-full overflow-hidden">
            <div className="flex h-screen w-full bg-[#F5F7F9] overflow-hidden">
                <AppSidebar role={userInfo.role} />
                <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
                    {/* Fixed Top Navbar Header */}
                    <header className="sticky top-0 z-40 bg-white py-4 px-6 border-b border-black/10 shrink-0 shadow-2xs">
                        <div className="flex justify-between items-center">
                            <div className="self-start flex items-center gap-4">
                                <SidebarTrigger />
                                <h2 className="font-bold text-lg text-gray-900">{headerInfo.title}</h2>
                                {headerInfo.badge && (
                                    <span className="text-[#2596be] bg-[#f0f8fd] px-3 py-1 rounded-full text-xs font-semibold">
                                        {headerInfo.badge}
                                    </span>
                                )}
                            </div>
                            <div>
                                <LanguageAndNotification />
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Main Content Area */}
                    <main className="flex-1 overflow-y-auto w-full">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}