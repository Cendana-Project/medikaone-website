'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "@/services/DoctorRegistrationService";
import { CreateDepartmentRequest } from "@/types/doctorRegistration";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

export const useCreateDepartment = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateDepartmentRequest) => createDepartment(hospitalId, payload),
        onSuccess: () => {
            toast.success("Department berhasil dibuat!");
            queryClient.invalidateQueries({ queryKey: ["departments", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal membuat departemen");
        },
    });
};

