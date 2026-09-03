import { z } from "zod";

export const loginHospitalSchema = z.object({
    identifier: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
    hospital_id: z.string().min(1, "Hospital ID wajib diisi"),
});

export const loginSuperAdminSchema = z.object({
    identity: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

export const loginSuperAdmin = loginSuperAdminSchema;

