import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScheduleChangeRequest } from "@/services/DoctorRegistrationService";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import { CreateScheduleChangePayload } from "@/types/doctorRegistration";

export const useCreateScheduleChange = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateScheduleChangePayload) =>
            createScheduleChangeRequest(hospitalId, payload),
        onSuccess: (data) => {
            if (data?.error) {
                handleApiError(data.error, "Gagal membuat pengajuan perubahan jadwal");
                return;
            }
            handleApiSuccess(data, "Pengajuan perubahan jadwal berhasil dibuat");
            queryClient.invalidateQueries({ queryKey: ["scheduleChanges", hospitalId] });
            queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal membuat pengajuan perubahan jadwal");
        },
    });
};
