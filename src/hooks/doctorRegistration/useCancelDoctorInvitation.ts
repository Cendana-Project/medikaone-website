'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelDoctorInvitation } from "@/services/DoctorRegistrationService";
import { handleApiError } from "@/lib/handleError";

export const useCancelDoctorInvitation = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) => cancelDoctorInvitation(hospitalId, invitationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctor-invitations", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal membatalkan undangan");
        },
    });
};

