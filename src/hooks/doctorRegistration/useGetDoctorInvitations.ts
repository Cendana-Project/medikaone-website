'use client';

import { useQuery } from "@tanstack/react-query";
import { getDoctorInvitations } from "@/services/DoctorRegistrationService";
import { DoctorInvitation } from "@/types/doctorRegistration";

export const useGetDoctorInvitations = (hospitalId: string, status?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["doctor-invitations", hospitalId, status],
        queryFn: async () => {
            const res = await getDoctorInvitations(hospitalId, status);
            return res.data || res;
        },
        enabled: Boolean(hospitalId),
    });

    const rawList = data?.data || (Array.isArray(data) ? data : []);
    const invitations: DoctorInvitation[] = Array.isArray(rawList) ? rawList : [];

    return {
        invitations,
        isLoading,
        isError,
        refetch,
    };
};
