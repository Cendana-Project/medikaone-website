'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "@/services/DoctorRegistrationService";
import { CreateDepartmentRequest } from "@/types/doctorRegistration";
import { handleApiError } from "@/lib/handleError";

export const useCreateDepartment = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: string | CreateDepartmentRequest) => createDepartment(hospitalId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["departments", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal membuat departemen");
        },
    });
};

