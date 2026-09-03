'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHospital } from "@/services/HospitalService";
import { CreateHospitalRequest } from "@/types/hospital";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useCreateHospital = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateHospitalRequest) => createHospital(payload),
        onSuccess: () => {
            toast.success("Rumah sakit berhasil dibuat!");
            queryClient.invalidateQueries({ queryKey: ["hospitals"] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal membuat rumah sakit");
        },
    });
};
