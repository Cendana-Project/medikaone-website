'use client';

import { useQuery } from "@tanstack/react-query";
import { getDoctorInvitations } from "@/services/DoctorRegistrationService";
import { DoctorInvitation } from "@/types/doctorRegistration";

export const useGetDoctorInvitations = (hospitalId: string, status?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["doctor-invitations", hospitalId, status],
        queryFn: async () => {
            return getDoctorInvitations(hospitalId, status);
        },
        enabled: Boolean(hospitalId),
    });

    const invitations: DoctorInvitation[] = Array.isArray(data) ? data : [];

    return {
        invitations,
        isLoading,
        isError,
        refetch,
    };
};
