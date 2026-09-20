import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "@/services/DoctorRegistrationService";
import toast from "react-hot-toast";

export const useDeleteDepartment = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) => deleteDepartment(hospitalId, departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", hospitalId] });
    },
  });
};
