'use client';

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/AuthService";
import { forgetPasswordRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (payload: forgetPasswordRequest) => forgotPassword(payload),
        onSuccess: () => {
            toast.success("PIN telah dikirim ke email Anda.");
        },
        onError: (error) => {
            handleApiError(error, "Gagal menguji email reset password");
        },
    });
};