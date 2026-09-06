'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelDoctorInvitation } from "@/services/DoctorRegistrationService";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

export const useCancelDoctorInvitation = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) => cancelDoctorInvitation(hospitalId, invitationId),
        onSuccess: () => {
            toast.success("Undangan berhasil dibatalkan!");
            queryClient.invalidateQueries({ queryKey: ["doctor-invitations", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal membatalkan undangan");
        },
    });
};

