import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveScheduleChangeRequest } from "@/services/DoctorRegistrationService";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";

export const useApproveScheduleChange = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (scheduleChangeId: string) =>
            approveScheduleChangeRequest(hospitalId, scheduleChangeId),
        onSuccess: (data) => {
            if (data?.error) {
                handleApiError(data.error, "Gagal menyetujui perubahan jadwal");
                return;
            }
            handleApiSuccess(data, "Permintaan perubahan jadwal berhasil disetujui");
            queryClient.invalidateQueries({ queryKey: ["scheduleChanges", hospitalId] });
            queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal menyetujui perubahan jadwal");
        },
    });
};
