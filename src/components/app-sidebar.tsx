'use client';

import Link from "next/link";
import { LogOut } from "lucide-react";
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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { sidebarMenuByRole } from "@/data/sideBarMenu";
import { logout } from "@/services/AuthService";
import toast from "react-hot-toast";

type AppSidebarProps = {
    role: string;   
};

export function AppSidebar({ role }: AppSidebarProps) {
    const normalizedRole = role ? role.toUpperCase().replace("-", "_") : "";
    const menuItems =
        sidebarMenuByRole[role] ||
        sidebarMenuByRole[normalizedRole] ||
        sidebarMenuByRole[role?.toLowerCase()] ||
        sidebarMenuByRole.default;
    const pathname = usePathname();
    const router = useRouter();

    const mainMenus = menuItems.filter(item => item.name !== "System Setting");
    const systemMenus = menuItems.filter(item => item.name === "System Setting");
    
    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            toast.success("Anda berhasil logout.");
            router.push("/auth/login");
        }
    };

    return (
        <Sidebar>
            <SidebarHeader className="flex items-center justify-center py-10">
                <Link href="/" className="flex items-center justify-center">
                    <Image
                        src="/sidebar/Logo-MedikaOne.png"
                        alt="Logo MedikaOne"
                        width={160} 
                        height={40}
                        className="object-contain"
                        priority
                    />
                </Link>
            </SidebarHeader>

            <SidebarContent className="flex-1 space-y-6">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">
                        MAIN
                    </SidebarGroupLabel>

                    <SidebarMenu>
                        {mainMenus.map((menu) => {
                            const isActive = pathname === menu.path;
                            return (
                                <SidebarMenuItem key={menu.name}>
                                    <SidebarMenuButton
                                        asChild
                                        className={`flex items-center gap-3 px-4 py-6 rounded-lg text-lg ${
                                            isActive
                                                ? "bg-green-50 text-green-700 font-semibold"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Link href={menu.path}>
                                            <div className="flex items-center gap-3">
                                                {/* Kamu bisa tambahkan icon per menu kalau mau */}
                                                <span>{menu.name}</span>
                                            </div>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                {systemMenus.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">
                            SYSTEM
                        </SidebarGroupLabel>

                        <SidebarMenu>
                            {systemMenus.map((menu) => {
                                const isActive = pathname === menu.path;
                                return (
                                    <SidebarMenuItem key={menu.name}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`flex items-center gap-3 px-4 py-6 rounded-lg text-lg ${
                                                isActive
                                                    ? "bg-green-50 text-green-700 font-semibold"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            <Link href={menu.path}>
                                                <div className="flex items-center gap-3">
                                                    <span>{menu.name}</span>
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-3 px-4 py-6 text-lg mb-6 text-[#767676] hover:text-[#464444]"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}