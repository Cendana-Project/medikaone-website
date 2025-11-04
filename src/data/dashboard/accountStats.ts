export type AccountStat = {
    role: string;
    label: string;
    total: number;
    unit: string;
};

export const accountStats: AccountStat[] = [
    {
        role: "bod",
        label: "Total Akun BOD",
        total: 10,
        unit: "Akun",
    },
    {
        role: "dokter",
        label: "Total Akun Dokter",
        total: 20,
        unit: "Akun",
    },
    {
        role: "resepsionis",
        label: "Total Akun Resepsionis",
        total: 5,
        unit: "Akun",
    },
    {
        role: "nurse",
        label: "Total Akun Nurse",
        total: 8,
        unit: "Akun",
    },
];