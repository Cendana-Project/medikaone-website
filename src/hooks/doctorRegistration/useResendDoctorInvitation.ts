'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resendDoctorInvitation } from "@/services/DoctorRegistrationService";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

export const useResendDoctorInvitation = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) => resendDoctorInvitation(hospitalId, invitationId),
        onSuccess: () => {
            toast.success("Undangan berhasil dikirim ulang!");
            queryClient.invalidateQueries({ queryKey: ["doctor-invitations", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal mengirim ulang undangan");
        },
    });
};

