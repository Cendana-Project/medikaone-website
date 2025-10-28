'use client';

import Link from "next/link";
import { LogOut, Home, Settings, Users } from "lucide-react";
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
import { usePathname } from "next/navigation";

const mainMenus = [
    {
        name: "Kelola Role",
        href: "#",
        icon: "/sidebar/User-circle.svg",
    },
    {
        name: "Kelola Doctor",
        href: "#",
        icon: "/sidebar/Document-report.svg",
    },
];

const systemMenus = [
    {
        name: "Settings",
        href: "#",
        icon: "/sidebar/Cog-settings.svg",
    },
];

export function AppSidebar() {
    const pathname = usePathname();
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
                        const isActive = pathname === menu.href;
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
                                        <Link href={menu.href}>
                                        <div className="flex items-center gap-3">
                                            <Image
                                            src={menu.icon}
                                            alt={menu.name}
                                            width={30}
                                            height={30}
                                            />
                                            <span>{menu.name}</span>
                                        </div>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">
                        SYSTEM
                    </SidebarGroupLabel>

                    <SidebarMenu>
                        {systemMenus.map((menu) => {
                        const isActive = pathname === menu.href;
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
                                        <Link href={menu.href}>
                                        <div className="flex items-center gap-3">
                                            <Image
                                            src={menu.icon}
                                            alt={menu.name}
                                            width={30}
                                            height={30}
                                            />
                                            <span>{menu.name}</span>
                                        </div>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-3 px-4 py-6 text-lg mb-6 text-[#767676] hover:text-[#464444]"
                    onClick={() => {
                        // handle logout logic here
                        console.log("Logging out...");
                    }}
                >
                    <LogOut size={18} />
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}