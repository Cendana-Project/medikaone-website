'use client';

import { useMutation } from "@tanstack/react-query";
import { loginSuperAdmin } from "@/services/AuthService";
import { LoginRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const useLoginSuperAdmin = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: LoginRequest) => loginSuperAdmin(payload),
        onSuccess: (res) => {
            const userName =
                res?.data?.user?.first_name ||
                res?.data?.first_name ||
                res?.data?.user?.username ||
                res?.data?.username ||
                "Super Admin";
            toast.success(`Selamat datang kembali, ${userName}.`);
            router.push("/dashboard"); 
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.");
        },
    });
};