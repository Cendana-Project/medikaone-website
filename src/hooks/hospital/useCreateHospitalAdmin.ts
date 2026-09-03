'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHospitalAdmin } from "@/services/HospitalService";
import { CreateHospitalAdminRequest } from "@/types/hospital";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type MutationArgs = {
    hospitalId: string;
    payload: CreateHospitalAdminRequest;
};

export const useCreateHospitalAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ hospitalId, payload }: MutationArgs) => createHospitalAdmin(hospitalId, payload),
        onSuccess: () => {
            toast.success("Admin rumah sakit berhasil didaftarkan!");
            queryClient.invalidateQueries({ queryKey: ["hospital-admins"] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal mendaftarkan admin rumah sakit");
        },
    });
};
