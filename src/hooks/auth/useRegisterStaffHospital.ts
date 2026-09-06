'use client';

import { useMutation } from "@tanstack/react-query";
import { registerStaff } from "@/services/AuthService";
import { RegisterStaffRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

type RegisterStaffPayload = RegisterStaffRequest & { hospitalId: string };

export const useRegisterStaffHospital = () => {
    return useMutation({
        mutationFn: ({ hospitalId, ...payload }: RegisterStaffPayload) =>
            registerStaff(payload, hospitalId),

        onSuccess: () => {
            toast.success("Akun staff rumah sakit berhasil didaftarkan!");
        },

        onError: (error) => {
            handleApiError(error, "Gagal mendaftarkan staff rumah sakit");
        },
    });
};