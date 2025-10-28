'use client';

import { useMutation } from "@tanstack/react-query";
import { registerStaff } from "@/services/AuthService";
import { RegisterStaffRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type RegisterStaffPayload = RegisterStaffRequest & { hospitalId: string };

export const useRegisterStaffHospital = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: ({ hospitalId, ...payload }: RegisterStaffPayload) =>
            registerStaff(payload, hospitalId),

        onSuccess: () => {
            toast.success("Akun staff rumah sakit berhasil didaftarkan!");
            // router.push("/dashboard/staff");
        },

        onError: (error: any) => {
            const message =
                error.response?.data?.message || "Gagal mendaftarkan staff rumah sakit.";
            toast.error(message);
        },
    });
};