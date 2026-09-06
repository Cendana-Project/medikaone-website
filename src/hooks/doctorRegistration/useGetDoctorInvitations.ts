'use client';

import { useQuery } from "@tanstack/react-query";
import { getDoctorInvitations } from "@/services/DoctorRegistrationService";
import { DoctorInvitation } from "@/types/doctorRegistration";

export const useGetDoctorInvitations = (hospitalId: string, status?: string) => {
    return useQuery<DoctorInvitation[]>({
        queryKey: ["doctor-invitations", hospitalId, status],
        queryFn: async () => {
            const res = await getDoctorInvitations(hospitalId, status);
            return res.data || [];
        },
        enabled: Boolean(hospitalId),
    });
};
