import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoctorInvitation } from "@/services/DoctorRegistrationService";
import { handleApiError } from "@/lib/handleError";

export const useDeleteDoctorInvitation = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => deleteDoctorInvitation(hospitalId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-invitations", hospitalId] });
    },
    onError: (error) => {
      handleApiError(error, "Gagal menghapus undangan dokter");
    },
  });
};
