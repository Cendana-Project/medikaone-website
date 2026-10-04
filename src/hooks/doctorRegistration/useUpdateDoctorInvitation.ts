import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDoctorInvitation } from "@/services/DoctorRegistrationService";
import { UpdateInvitationRequest } from "@/types/doctorRegistration";
import { handleApiError } from "@/lib/handleError";

export function useUpdateDoctorInvitation(hospitalId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ invitationId, payload }: { invitationId: string; payload: UpdateInvitationRequest }) =>
            updateDoctorInvitation(hospitalId, invitationId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctor-invitations", hospitalId] });
            queryClient.invalidateQueries({ queryKey: ["doctor-invitation"] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal memperbarui undangan dokter");
        },
    });
}
