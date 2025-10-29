'use client';

import { useMutation } from "@tanstack/react-query";
import { registerAdmin } from "@/services/AuthService";
import { RegisterHospitalAdminRequest } from "@/types/auth";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

type RegisterAdminPayload = RegisterHospitalAdminRequest & { hospitalId: string };

export const useRegisterAdmin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: ({ hospitalId, ...payload }: RegisterAdminPayload) =>
            registerAdmin(payload, hospitalId),

        onSuccess: () => {
            toast.success("Akun admin rumah sakit berhasil didaftarkan!");
            // router.push("/dashboard/admins");
        },

        onError: (error: AxiosError<{ message: string }>) => {
            const message =
                error.response?.data?.message || "Gagal mendaftarkan admin rumah sakit.";
            toast.error(message);
        },
    });
};
