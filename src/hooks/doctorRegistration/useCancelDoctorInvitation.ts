'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelDoctorInvitation } from "@/services/DoctorRegistrationService";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useCancelDoctorInvitation = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) => cancelDoctorInvitation(hospitalId, invitationId),
        onSuccess: () => {
            toast.success("Undangan berhasil dibatalkan!");
            queryClient.invalidateQueries({ queryKey: ["doctor-invitations", hospitalId] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal membatalkan undangan");
        },
    });
};
