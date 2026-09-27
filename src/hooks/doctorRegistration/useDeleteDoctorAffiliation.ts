import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoctorAffiliation } from "@/services/DoctorRegistrationService";

export const useDeleteDoctorAffiliation = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => deleteDoctorAffiliation(hospitalId, doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
    },
  });
};
