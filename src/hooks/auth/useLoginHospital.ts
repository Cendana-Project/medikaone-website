'use client';

import { useMutation } from "@tanstack/react-query";
import { loginHospital } from "@/services/AuthService";
import { LoginHospitalRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useLoginHospital = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: LoginHospitalRequest) => loginHospital(payload),
        onSuccess: () => {
            toast.success("Login success!");
            router.push("/dashboard"); 
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });
};