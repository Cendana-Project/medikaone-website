'use client';

import { useQuery } from "@tanstack/react-query";
import { getDoctorInvitationById } from "@/services/DoctorRegistrationService";
import { DoctorInvitation } from "@/types/doctorRegistration";

export const useGetDoctorInvitation = (hospitalId: string, invitationId: string) => {
    return useQuery<DoctorInvitation>({
        queryKey: ["doctor-invitation", hospitalId, invitationId],
        queryFn: async () => {
            return getDoctorInvitationById(hospitalId, invitationId);
        },
        enabled: Boolean(hospitalId) && Boolean(invitationId),
    });
};
