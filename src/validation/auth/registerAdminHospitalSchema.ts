import { z } from "zod";
import { passwordSecuritySchema, validatePasswordContainsUserData } from "./passwordSchema";

export const registerAdminSchema = z.object({
    hospitalId: z.string().min(1, "Kode rumah sakit wajib diisi"),
    email: z.string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid")
        .max(190, "Email maksimal 190 karakter"),
    username: z.string()
        .min(3, "Username minimal 3 karakter")
        .max(64, "Username maksimal 64 karakter")
        .regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]{2,63}$/, "Username 3–64 karakter, diawali alfanumerik, dan hanya mengandung huruf, angka, titik, underscore, atau minus"),
    password: passwordSecuritySchema,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    phone: z.string().max(32, "Nomor telepon maksimal 32 karakter").optional().or(z.literal("")),
    first_name: z.string().max(100, "Nama depan maksimal 100 karakter").optional().or(z.literal("")),
    last_name: z.string().max(100, "Nama belakang maksimal 100 karakter").optional().or(z.literal("")),
    dob: z.string().optional().or(z.literal(""))
        .refine((val) => {
            if (!val) return true;
            if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
            const d = new Date(val);
            return !isNaN(d.getTime());
        }, { message: "Format tanggal lahir tidak valid" })
        .refine((val) => {
            if (!val) return true;
            const birthDate = new Date(val);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return birthDate <= today;
        }, { message: "Tanggal lahir tidak boleh di masa depan" })
        .refine((val) => {
            if (!val) return true;
            const birthDate = new Date(val);
            const today = new Date();
            const minAgeDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
            return birthDate <= minAgeDate;
        }, { message: "Usia minimal 15 tahun" }),
    address: z.string().max(1000, "Alamat maksimal 1.000 karakter").optional().or(z.literal("")),
    gender: z.enum(["L", "P"]).optional().or(z.literal("")),
    nik: z.string().optional().or(z.literal("")).refine((val) => {
        if (!val) return true;
        return /^\d{16}$/.test(val);
    }, { message: "NIK harus tepat 16 digit angka" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
}).superRefine((data, ctx) => {
    const errorMsg = validatePasswordContainsUserData(data.password, data.email, data.username);
    if (errorMsg) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMsg,
            path: ["password"],
        });
    }
});
