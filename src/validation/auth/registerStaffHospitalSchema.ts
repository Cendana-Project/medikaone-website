import { z } from "zod";

export const registerStaffSchema = z.object({
    hospitalId: z.string().min(1, "Hospital wajib diisi"),
    role: z.enum(["nurse", "receptionist", "bod", "doctor"]),
    username: z.string().min(3, "Username minimal 3 karakter").regex(/^[a-zA-Z0-9._-]+$/, "Username hanya boleh huruf, angka, titik, underscore atau minus"),
    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
    phone: z.string().regex(/^\+62\d{8,14}$/, "Nomor telepon harus format +62 dan 10-15 digit"),
    password: z.string()
        .min(8, "Password minimal 8 karakter")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, "Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    first_name: z.string().min(2, "Nama depan minimal 2 huruf").regex(/^[A-Za-z\s'-]+$/, "Nama depan hanya boleh huruf, spasi, tanda - atau '"),
    last_name: z.string().min(2, "Nama belakang minimal 2 huruf").regex(/^[A-Za-z\s'-]+$/, "Nama belakang hanya boleh huruf, spasi, tanda - atau '"),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal lahir harus format YYYY-MM-DD"),
    address: z.string().min(5, "Alamat minimal 5 karakter"),
    gender: z.enum(["L", "P"]),
    nik: z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});