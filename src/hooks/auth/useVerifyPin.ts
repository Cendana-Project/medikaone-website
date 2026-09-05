'use client';

import { useMutation } from "@tanstack/react-query";
import { verifyPin } from "@/services/AuthService";
import { verifyPinRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

export const useVerifyPin = () => {
    return useMutation({
        mutationFn: (payload: verifyPinRequest) => verifyPin(payload),
        onSuccess: () => {
            toast.success("PIN berhasil diverifikasi!");
        },
        onError: (error) => {
            handleApiError(error, "Verifikasi PIN gagal");
        },
    });
};

