import { z } from "zod";

export const createDepartmentSchema = z.object({
    code: z.string().min(1, "Kode department wajib diisi"),
    name: z.string().min(1, "Nama department wajib diisi"),
});
