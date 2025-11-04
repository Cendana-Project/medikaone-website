export type SidebarMenuItem = {
    name: string;
    path: string;
};

const baseMenus: Record<string, SidebarMenuItem[]> = {
    ADMIN: [
        { name: "Kelola Role", path: "/roles" },
        { name: "Kelola Dokter", path: "/doctors" },
    ],

    SUPER_ADMIN: [
        { name: "Kelola Role", path: "/roles" },
        { name: "Kelola Dokter", path: "/doctors" },
    ],

    RESEPSIONIS: [
        { name: "Data Appointment", path: "/appointments" },
        { name: "Chat", path: "/chat" },
        { name: "Cek Jadwal Dokter", path: "/doctor-schedule" },
    ],

    NURSE: [
        { name: "Antrian Pasien", path: "/queue" },
        { name: "Detail Pasien", path: "/patients" },
    ],

    BOD: [
        { name: "Data User", path: "/users" },
        { name: "Riwayat Pemasukan", path: "/revenue" },
    ],

    DOKTER: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Appointment", path: "/appointment" },
    ],

    default: [],
};

export const sidebarMenuByRole: Record<string, SidebarMenuItem[]> = Object.keys(baseMenus).reduce(
    (acc, key) => {
        acc[key] = [
            ...baseMenus[key],
            { name: "System Setting", path: "/system" },
        ];
        return acc;
    },
    {} as Record<string, SidebarMenuItem[]>
);