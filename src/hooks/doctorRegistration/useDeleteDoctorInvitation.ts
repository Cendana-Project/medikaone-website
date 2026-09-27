import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoctorInvitation } from "@/services/DoctorRegistrationService";

export const useDeleteDoctorInvitation = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => deleteDoctorInvitation(hospitalId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-invitations", hospitalId] });
    },
  });
};
