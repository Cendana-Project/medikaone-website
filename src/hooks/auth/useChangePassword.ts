'use client';

import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/AuthService";
import { changePasswordRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/lib/handleError";

export const useChangePassword = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: changePasswordRequest) => changePassword(payload),
        onSuccess: () => {
            toast.success("Ganti password berhasil!");
            router.push("/auth/login"); 
        },
        onError: (error) => {
            handleApiError(error, "Ganti password gagal");
        },
    });
};