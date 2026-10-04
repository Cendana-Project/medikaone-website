import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoctorAffiliation } from "@/services/DoctorRegistrationService";
import { handleApiError } from "@/lib/handleError";

export const useDeleteDoctorAffiliation = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => deleteDoctorAffiliation(hospitalId, doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
    },
    onError: (error) => {
      handleApiError(error, "Gagal menghapus penugasan dokter");
    },
  });
};
