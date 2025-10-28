'use client';

import { useMutation } from "@tanstack/react-query";
import { loginSuperAdmin } from "@/services/AuthService";
import { LoginRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useLoginSuperAdmin = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: LoginRequest) => loginSuperAdmin(payload),
        onSuccess: () => {
            toast.success("Login success!");
            router.push("/dashboard"); 
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message_detail.desc_idn || "Login Gagal");
        },
    });
};