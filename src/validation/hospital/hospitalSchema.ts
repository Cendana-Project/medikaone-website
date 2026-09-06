import { z } from "zod";

export const createHospitalSchema = z.object({
    code: z.string().min(1, "Kode rumah sakit wajib diisi"),
    name: z.string().min(1, "Nama rumah sakit wajib diisi"),
    address: z.string().min(1, "Alamat wajib diisi"),
    city: z.string().min(1, "Kota wajib diisi"),
    province: z.string().min(1, "Provinsi wajib diisi"),
    country: z.string().min(1, "Negara wajib diisi"),
    phone: z.string().min(1, "Nomor telepon wajib diisi"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    description: z.string().optional(),
    facilities: z.union([z.record(z.string(), z.unknown()), z.string()]).optional(),
});
