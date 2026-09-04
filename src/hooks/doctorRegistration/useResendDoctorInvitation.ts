'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resendDoctorInvitation } from "@/services/DoctorRegistrationService";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useResendDoctorInvitation = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) => resendDoctorInvitation(hospitalId, invitationId),
        onSuccess: () => {
            toast.success("Undangan berhasil dikirim ulang!");
            queryClient.invalidateQueries({ queryKey: ["doctor-invitations", hospitalId] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal mengirim ulang undangan");
        },
    });
};
