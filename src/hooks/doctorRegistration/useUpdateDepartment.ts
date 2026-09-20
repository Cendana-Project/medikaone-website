import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartment } from "@/services/DoctorRegistrationService";
import { CreateDepartmentRequest } from "@/types/doctorRegistration";
import toast from "react-hot-toast";

export const useUpdateDepartment = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, payload }: { departmentId: string; payload: Partial<CreateDepartmentRequest> }) =>
      updateDepartment(hospitalId, departmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", hospitalId] });
    },
  });
};
