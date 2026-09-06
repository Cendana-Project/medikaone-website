import { z } from "zod";

export const createRoomSchema = z.object({
    department_id: z.string().min(1, "Department ID wajib dipilih"),
    code: z.string().min(1, "Kode ruangan wajib diisi"),
    name: z.string().min(1, "Nama ruangan wajib diisi"),
});
