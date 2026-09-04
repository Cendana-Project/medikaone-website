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
        { name: "Tambah Rumah Sakit", path: "/auth/register/hospital" },
        { name: "Tambah Admin RS", path: "/auth/register/admin-hospital" },
    ],

    RECEPTIONIST: [
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

    DOCTOR: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Appointment", path: "/appointment" },
    ],

    default: [],
};

// Synonym/Alias mapping for roles coming from backend
const roleAliases: Record<string, string> = {
    "SUPER_ADMIN": "SUPER_ADMIN",
    "SUPER-ADMIN": "SUPER_ADMIN",
    "ADMIN": "ADMIN",
    "DOCTOR": "DOCTOR",
    "DOKTER": "DOCTOR",
    "NURSE": "NURSE",
    "PERAWAT": "NURSE",
    "RECEPTIONIST": "RECEPTIONIST",
    "RESEPSIONIS": "RECEPTIONIST",
    "BOD": "BOD",
};

export const sidebarMenuByRole: Record<string, SidebarMenuItem[]> = new Proxy(
    {},
    {
        get: (_, prop: string) => {
            if (typeof prop !== "string") return [];
            const normalizedKey = prop.toUpperCase().replace("-", "_");
            const targetRole = roleAliases[normalizedKey] || normalizedKey;
            const items = baseMenus[targetRole] || baseMenus[prop] || baseMenus.default;
            return [
                ...items,
                { name: "System Setting", path: "/system" },
            ];
        },
    }
);