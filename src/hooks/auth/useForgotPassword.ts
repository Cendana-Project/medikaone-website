'use client';

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/AuthService";
import { forgetPasswordRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const useForgotPassword = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: forgetPasswordRequest) => forgotPassword(payload),
        onSuccess: () => {
            toast.success("Pin telah dikirim ke email anda!");
            router.push("/auth/change-password"); 
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Forgot password gagal");
        },
    });
};