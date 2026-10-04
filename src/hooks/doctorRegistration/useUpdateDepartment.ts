import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartment } from "@/services/DoctorRegistrationService";

export const useUpdateDepartment = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, payload }: { departmentId: string; payload: { master_department_id?: string; code?: string; name?: string; description?: string } }) =>
      updateDepartment(hospitalId, departmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", hospitalId] });
    },
  });
};
