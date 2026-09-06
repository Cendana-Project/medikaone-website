'use client';

import { useQuery } from "@tanstack/react-query";
import { getDoctorInvitation } from "@/services/DoctorRegistrationService";
import { DoctorInvitation } from "@/types/doctorRegistration";

export const useGetDoctorInvitation = (hospitalId: string, invitationId: string) => {
    return useQuery<DoctorInvitation>({
        queryKey: ["doctor-invitation", hospitalId, invitationId],
        queryFn: async () => {
            const res = await getDoctorInvitation(hospitalId, invitationId);
            return res.data;
        },
        enabled: Boolean(hospitalId) && Boolean(invitationId),
    });
};
