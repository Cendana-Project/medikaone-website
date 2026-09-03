import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
});

export const verifyPinSchema = z.object({
    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
    pin: z.string().min(1, "PIN wajib diisi").length(6, "PIN harus 6 digit angka"),
});

export const resetPasswordSchema = z.object({
    new_password: z.string().min(6, "Password minimal 6 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm_password"],
});

