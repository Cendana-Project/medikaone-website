'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "@/services/DoctorRegistrationService";
import { CreateDepartmentRequest } from "@/types/doctorRegistration";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useCreateDepartment = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateDepartmentRequest) => createDepartment(hospitalId, payload),
        onSuccess: () => {
            toast.success("Department berhasil dibuat!");
            queryClient.invalidateQueries({ queryKey: ["departments", hospitalId] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal membuat department");
        },
    });
};
