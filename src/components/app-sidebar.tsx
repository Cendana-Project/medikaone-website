'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
    LogOut, 
    UserCheck, 
    FileText, 
    Settings, 
    Building2, 
    UserPlus, 
    Calendar, 
    MessageSquare, 
    Clock, 
    Users, 
    TrendingUp, 
    LayoutDashboard, 
    Stethoscope,
    User
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarMenuByRole } from "@/data/sideBarMenu";
import { logout } from "@/services/AuthService";
import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo";
import toast from "react-hot-toast";

type AppSidebarProps = {
    role?: string;   
};

// Helper function to return icon for menu item matching Figma icons
const getMenuIcon = (name: string, isActive: boolean) => {
    const iconColor = isActive ? "#3BB49F" : "#767676";
    const iconSize = 20;

    switch (name) {
        case "Kelola Role":
            return <UserCheck size={iconSize} style={{ color: iconColor }} />;
        case "Kelola Dokter":
        case "Kelola Doctor":
            return <FileText size={iconSize} style={{ color: iconColor }} />;
        case "Tambah Rumah Sakit":
            return <Building2 size={iconSize} style={{ color: iconColor }} />;
        case "Tambah Admin RS":
            return <UserPlus size={iconSize} style={{ color: iconColor }} />;
        case "Data Appointment":
        case "Appointment":
            return <Calendar size={iconSize} style={{ color: iconColor }} />;
        case "Chat":
            return <MessageSquare size={iconSize} style={{ color: iconColor }} />;
        case "Cek Jadwal Dokter":
            return <Clock size={iconSize} style={{ color: iconColor }} />;
        case "Antrian Pasien":
        case "Data User":
            return <Users size={iconSize} style={{ color: iconColor }} />;
        case "Detail Pasien":
            return <Stethoscope size={iconSize} style={{ color: iconColor }} />;
        case "Riwayat Pemasukan":
            return <TrendingUp size={iconSize} style={{ color: iconColor }} />;
        case "Dashboard":
            return <LayoutDashboard size={iconSize} style={{ color: iconColor }} />;
        case "System Setting":
        case "Settings":
            return <Settings size={iconSize} style={{ color: iconColor }} />;
        default:
            return <FileText size={iconSize} style={{ color: iconColor }} />;
    }
};

export function AppSidebar({ role }: AppSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { userInfo } = useGetUserInfo();

    const userRole = userInfo?.role || role || "ADMIN";
    const normalizedRole = userRole.toUpperCase().replace("-", "_");
    const menuItems =
        sidebarMenuByRole[userRole] ||
        sidebarMenuByRole[normalizedRole] ||
        sidebarMenuByRole[userRole.toLowerCase()] ||
        sidebarMenuByRole.default;

    const mainMenus = menuItems.filter(item => item.name !== "System Setting" && item.name !== "Settings");
    const systemMenus = menuItems.filter(item => item.name === "System Setting" || item.name === "Settings");

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            toast.success("Anda berhasil logout.");
            router.push("/auth/login");
        }
    };

    // User details fetched from tenant/me
    const getDisplayName = () => {
        if (!userInfo) return "John Doe";
        if (userInfo.first_name || userInfo.last_name) {
            return `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim();
        }
        return userInfo.username || userInfo.email || "User";
    };

    const getDisplayRole = () => {
        const rawRole = (userInfo?.role || role || "ADMIN").toUpperCase().replace(/[-\s]+/g, "_");

        switch (rawRole) {
            case "ADMIN":
            case "HOSPITAL_ADMIN":
                return "Admin Dashboard";
            case "NURSE":
            case "PERAWAT":
                return "Pegawai Perawat";
            case "BOD":
                return "Board of Director";
            case "RECEPTIONIST":
            case "RESEPSIONIS":
                return "Resepsionis";
            case "DOCTOR":
            case "DOKTER":
                return "Dokter";
            case "SUPER_ADMIN":
                return "Super Admin";
            default:
                return rawRole.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
        }
    };

    const userInfoRecord = userInfo as (Record<string, unknown> & { photo_url?: string; avatar?: string; image?: string; profile_picture?: string }) | null;
    const userAvatarUrl = userInfoRecord?.photo_url || userInfoRecord?.avatar || userInfoRecord?.image || userInfoRecord?.profile_picture;
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [userAvatarUrl]);

    const getInitials = () => {
        if (userInfo?.first_name) {
            const first = userInfo.first_name.charAt(0).toUpperCase();
            const last = userInfo.last_name ? userInfo.last_name.charAt(0).toUpperCase() : "";
            return `${first}${last}`;
        }
        if (userInfo?.username) {
            return userInfo.username.charAt(0).toUpperCase();
        }
        return "";
    };

    const initials = getInitials();

    return (
        <Sidebar className="w-[240px] border-r border-[#EAECF0] bg-white flex flex-col justify-between py-12 px-3">
            {/* Frame 681: Top Container for Logo and Navigation */}
            <div className="flex flex-col gap-10 w-full">
                {/* Frame 42 / Frame 120957: Header Logo */}
                <SidebarHeader className="flex items-center justify-center p-0">
                    <Link href="/dashboard" className="flex items-center justify-center py-1.5 px-3">
                        <Image
                            src="/sidebar/Logo-MedikaOne.png"
                            alt="Medika One Logo"
                            width={160}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </Link>
                </SidebarHeader>

                {/* Sections */}
                <SidebarContent className="flex flex-col gap-6 p-0 overflow-visible">
                    {/* Frame 121017: MAIN Group */}
                    <SidebarGroup className="p-0 flex flex-col gap-1">
                        <SidebarGroupLabel className="text-[12px] font-semibold text-[#858585] uppercase tracking-[-0.006em] px-2 h-6 mb-1">
                            MAIN
                        </SidebarGroupLabel>

                        <SidebarMenu className="gap-1">
                            {mainMenus.map((menu) => {
                                const isActive = pathname === menu.path;
                                return (
                                    <SidebarMenuItem key={menu.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={`flex items-center gap-2 px-3 py-3 rounded-[4px] h-[48px] text-[14px] font-sans transition-colors ${
                                                isActive
                                                    ? "bg-[#EBF8F5] text-[#3BB49F] font-semibold"
                                                    : "text-[#767676] font-normal hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                        >
                                            <Link href={menu.path} className="flex items-center gap-2 w-full">
                                                {getMenuIcon(menu.name, isActive)}
                                                <span className="truncate leading-[24px] tracking-[-0.006em]">
                                                    {menu.name}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>

                    {/* Frame 121018: SYSTEM Group */}
                    {systemMenus.length > 0 && (
                        <SidebarGroup className="p-0 flex flex-col gap-1">
                            <SidebarGroupLabel className="text-[12px] font-semibold text-[#858585] uppercase tracking-[-0.006em] px-2 h-6 mb-1">
                                SYSTEM
                            </SidebarGroupLabel>

                            <SidebarMenu className="gap-1">
                                {systemMenus.map((menu) => {
                                    const isActive = pathname === menu.path;
                                    return (
                                        <SidebarMenuItem key={menu.name}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                className={`flex items-center gap-2 px-3 py-3 rounded-[4px] h-[48px] text-[14px] font-sans transition-colors ${
                                                    isActive
                                                        ? "bg-[#EBF8F5] text-[#3BB49F] font-semibold"
                                                        : "text-[#767676] font-normal hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                            >
                                                <Link href={menu.path} className="flex items-center gap-2 w-full">
                                                    {getMenuIcon("Settings", isActive)}
                                                    <span className="truncate leading-[24px] tracking-[-0.006em]">
                                                        {menu.name === "System Setting" ? "Settings" : menu.name}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroup>
                    )}
                </SidebarContent>
            </div>

            {/* Frame 121022: Bottom Container (Gradient Tenant Profile Card + Log Out) */}
            <SidebarFooter className="p-0 flex flex-col gap-6 mt-auto">
                {/* Tenant User Info Card - Click to navigate to Profile */}
                <Link 
                    href="/profile"
                    className="w-full min-h-[96px] rounded-[12px] p-[24px_12px_24px_10px] border border-[#EAECF0] flex items-center gap-[10px] box-border transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{
                        background: "linear-gradient(148.58deg, #3BB49F 18.96%, #00FFD3 176.22%)"
                    }}
                >
                    <div className="relative w-[48px] h-[48px] rounded-full bg-[#D8F0EC] overflow-hidden shrink-0 flex items-center justify-center">
                        {userAvatarUrl && !imgError ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={userAvatarUrl}
                                alt="User Avatar"
                                onError={() => setImgError(true)}
                                className="w-full h-full object-cover"
                            />
                        ) : initials ? (
                            <span className="text-[#3BB49F] font-bold text-[16px] select-none">
                                {initials}
                            </span>
                        ) : (
                            <User size={24} className="text-[#3BB49F]" />
                        )}
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden min-w-0">
                        <h4 className="text-[14px] font-bold text-white leading-[24px] tracking-[-0.006em] truncate">
                            {getDisplayName()}
                        </h4>
                        <p className="text-[14px] font-normal text-white leading-[24px] tracking-[-0.006em] truncate opacity-90">
                            {getDisplayRole()}
                        </p>
                    </div>
                </Link>

                {/* Sidenav Log Out Item */}
                <button
                    onClick={handleLogout}
                    className="w-full h-[48px] px-3 py-3 rounded-[4px] flex items-center gap-2 text-[#767676] text-[14px] font-semibold tracking-[-0.006em] hover:bg-gray-100 hover:text-red-600 transition-colors"
                >
                    <LogOut size={20} className="shrink-0 text-[#767676]" />
                    <span>Log Out</span>
                </button>
            </SidebarFooter>
        </Sidebar>
    );
}