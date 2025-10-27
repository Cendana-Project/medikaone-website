'use client';

import { useMutation } from "@tanstack/react-query";
import { loginHospital } from "@/services/AuthService";
import { LoginRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useLogin = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: LoginRequest) => loginHospital(payload),
        onSuccess: () => {
            toast.success("Login success!");
            router.push("/dashboard"); 
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });
};