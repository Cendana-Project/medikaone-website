import { z } from "zod";

export const registerAdminSchema = z.object({
    hospitalId: z.string().min(1, "Kode rumah sakit wajib diisi"),
    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
    username: z.string().min(3, "Username minimal 3 karakter"),
    phone: z.string().regex(/^(?:\+62|0)\d{9,15}$/, "Nomor telepon harus format +62 atau 0 dan minimal 10 digit"),
    password: z.string()
        .min(8, "Password minimal 8 karakter")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, "Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    first_name: z.string().min(2, "Nama depan minimal 2 huruf").regex(/^[A-Za-z\s]+$/, "Nama depan hanya boleh huruf"),
    last_name: z.string().min(2, "Nama belakang minimal 2 huruf").regex(/^[A-Za-z\s]+$/, "Nama belakang hanya boleh huruf"),
    dob: z.string().min(1, "Tanggal lahir wajib diisi"),
    address: z.string().min(5, "Alamat minimal 5 karakter"),
    gender: z.enum(["L", "P"]),
    nik: z.string().regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});

