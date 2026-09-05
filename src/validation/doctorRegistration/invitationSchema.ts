import { z } from "zod";

const scheduleSchema = z.object({
    day_of_week: z.number().min(0).max(6),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Format jam harus HH:mm"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Format jam harus HH:mm"),
    timezone: z.string().min(1, "Timezone wajib diisi"),
});

export const createInvitationSchema = z.object({
    doctor_id: z.string().min(1, "Dokter wajib dipilih"),
    department_id: z.string().min(1, "Department wajib dipilih"),
    room_id: z.string().optional(),
    message: z.string().optional(),
    schedules: z.array(scheduleSchema).optional(),
    contract: z
        .instanceof(File, { message: "File kontrak PDF wajib diunggah" })
        .refine((file) => file.type === "application/pdf", "File harus format PDF")
        .refine((file) => file.size <= 10 * 1024 * 1024, "Ukuran file maksimal 10MB"),
});
