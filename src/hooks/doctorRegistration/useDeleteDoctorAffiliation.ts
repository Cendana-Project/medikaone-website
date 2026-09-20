import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoctorAffiliation } from "@/services/DoctorRegistrationService";
import toast from "react-hot-toast";

export const useDeleteDoctorAffiliation = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => deleteDoctorAffiliation(hospitalId, doctorId),
    onSuccess: () => {
      toast.success("Afiliasi dokter berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
    },
  });
};
