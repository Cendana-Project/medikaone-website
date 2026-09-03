'use client';

import { useMutation } from "@tanstack/react-query";
import { verifyPin } from "@/services/AuthService";
import { verifyPinRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useVerifyPin = () => {
    return useMutation({
        mutationFn: (payload: verifyPinRequest) => verifyPin(payload),
        onSuccess: () => {
            toast.success("PIN berhasil diverifikasi!");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Verifikasi PIN gagal");
        },
    });
};
