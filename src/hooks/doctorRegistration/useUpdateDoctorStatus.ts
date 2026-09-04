'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDoctorStatus } from "@/services/DoctorRegistrationService";
import { UpdateDoctorStatusRequest } from "@/types/doctorRegistration";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type MutationArgs = {
    doctorId: string;
    payload: UpdateDoctorStatusRequest;
};

export const useUpdateDoctorStatus = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ doctorId, payload }: MutationArgs) => updateDoctorStatus(hospitalId, doctorId, payload),
        onSuccess: () => {
            toast.success("Status dokter berhasil diperbarui!");
            queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal mengupdate status dokter");
        },
    });
};
