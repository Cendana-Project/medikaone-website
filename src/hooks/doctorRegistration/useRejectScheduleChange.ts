import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectScheduleChangeRequest } from "@/services/DoctorRegistrationService";
import { handleApiError } from "@/lib/handleError";

export const useRejectScheduleChange = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ scheduleChangeId, reason }: { scheduleChangeId: string; reason?: string }) =>
            rejectScheduleChangeRequest(hospitalId, scheduleChangeId, { reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scheduleChanges", hospitalId] });
            queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal menolak perubahan jadwal");
        },
    });
};
