'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDoctorInvitation } from "@/services/DoctorRegistrationService";
import { CreateInvitationRequest } from "@/types/doctorRegistration";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

export const useCreateDoctorInvitation = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateInvitationRequest) => createDoctorInvitation(hospitalId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctor-invitations", hospitalId] });
            queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal mengirim undangan dokter");
        },
    });
};

