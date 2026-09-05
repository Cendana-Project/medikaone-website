'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHospital } from "@/services/HospitalService";
import { CreateHospitalRequest } from "@/types/hospital";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

export const useCreateHospital = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateHospitalRequest) => createHospital(payload),
        onSuccess: () => {
            toast.success("Rumah sakit berhasil dibuat!");
            queryClient.invalidateQueries({ queryKey: ["hospitals"] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal membuat rumah sakit");
        },
    });
};

