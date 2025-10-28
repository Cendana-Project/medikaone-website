'use client';

import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/AuthService";
import { changePasswordRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const useChangePassword = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: changePasswordRequest) => changePassword(payload),
        onSuccess: () => {
            toast.success("Ganti password berhasil!");
            router.push("/auth/login"); 
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Ganti password gagal");
        },
    });
};