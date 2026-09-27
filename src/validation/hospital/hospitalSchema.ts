import { z } from "zod";

export const createHospitalSchema = z.object({
    code: z.string().min(1, "Kode rumah sakit wajib diisi").max(40, "Kode rumah sakit maksimal 40 karakter"),
    name: z.string().min(1, "Nama rumah sakit wajib diisi").max(160, "Nama rumah sakit maksimal 160 karakter"),
    address: z.string().min(1, "Alamat wajib diisi").max(1000, "Alamat maksimal 1000 karakter"),
    city: z.string().min(1, "Kota wajib diisi").max(100, "Kota maksimal 100 karakter"),
    province: z.string().min(1, "Provinsi wajib diisi").max(100, "Provinsi maksimal 100 karakter"),
    country: z.string().min(1, "Negara wajib diisi").max(100, "Negara maksimal 100 karakter"),
    phone: z.string().min(1, "Nomor telepon wajib diisi").regex(/^(?:\+62|0)[2-9]\d{7,12}$/, "Nomor telepon harus format valid (cth: +62812... atau 0812...)"),
    email: z.string().email("Email tidak valid").or(z.literal("")).optional(),
    website: z.string().url("URL website tidak valid").or(z.literal("")).optional(),
    established_year: z.union([z.number(), z.string()]).optional().transform((val) => (val ? Number(val) : undefined)),
    timezone: z.string().optional(),
    latitude: z.union([z.number(), z.string()]).optional().transform((val) => (val ? Number(val) : undefined)),
    longitude: z.union([z.number(), z.string()]).optional().transform((val) => (val ? Number(val) : undefined)),
    description: z.string().max(10000, "Deskripsi maksimal 10000 karakter").optional(),
    facilities: z.any().optional(),
    opening_hours: z.any().optional(),
});
