'use client';

import { useMutation } from "@tanstack/react-query";
import { registerAdmin } from "@/services/AuthService";
import { RegisterHospitalAdminRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

type RegisterAdminPayload = RegisterHospitalAdminRequest & { hospitalId: string };

export const useRegisterAdmin = () => {
    return useMutation({
        mutationFn: ({ hospitalId, ...payload }: RegisterAdminPayload) =>
            registerAdmin(payload, hospitalId),

        onSuccess: () => {
            toast.success("Akun admin rumah sakit berhasil didaftarkan!");
        },

        onError: (error) => {
            handleApiError(error, "Gagal mendaftarkan admin rumah sakit");
        },
    });
};

