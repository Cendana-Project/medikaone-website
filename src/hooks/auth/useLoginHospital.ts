'use client';

import { useMutation } from "@tanstack/react-query";
import { loginHospital } from "@/services/AuthService";
import { LoginHospitalRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const useLoginHospital = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: LoginHospitalRequest) => loginHospital(payload),
        onSuccess: (res) => {
            const userName =
                res?.data?.user?.first_name ||
                res?.data?.first_name ||
                res?.data?.user?.username ||
                res?.data?.username ||
                "";
            const welcomeText = userName
                ? `Selamat datang kembali, ${userName}.`
                : "Selamat datang kembali.";
            toast.success(welcomeText);
            router.push("/dashboard"); 
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.");
        },
    });
};