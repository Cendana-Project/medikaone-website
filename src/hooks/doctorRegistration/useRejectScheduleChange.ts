import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectScheduleChangeRequest } from "@/services/DoctorRegistrationService";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";

export const useRejectScheduleChange = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ scheduleChangeId, reason }: { scheduleChangeId: string; reason?: string }) =>
            rejectScheduleChangeRequest(hospitalId, scheduleChangeId, { reason }),
        onSuccess: (data) => {
            if (data?.error) {
                handleApiError(data.error, "Gagal menolak perubahan jadwal");
                return;
            }
            handleApiSuccess(data, "Permintaan perubahan jadwal berhasil ditolak");
            queryClient.invalidateQueries({ queryKey: ["scheduleChanges", hospitalId] });
            queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal menolak perubahan jadwal");
        },
    });
};
