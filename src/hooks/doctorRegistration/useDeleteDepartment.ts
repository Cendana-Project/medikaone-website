import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "@/services/DoctorRegistrationService";
import { handleApiError } from "@/lib/handleError";

export const useDeleteDepartment = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) => deleteDepartment(hospitalId, departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", hospitalId] });
    },
    onError: (error) => {
      handleApiError(error, "Gagal menghapus departemen");
    },
  });
};
