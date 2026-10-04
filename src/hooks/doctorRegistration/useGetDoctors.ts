'use client';

import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/services/DoctorRegistrationService";
import { DoctorAffiliation } from "@/types/doctorRegistration";

export const useGetDoctors = (hospitalId: string, status?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["doctors", hospitalId, status],
        queryFn: async () => {
            return getDoctors(hospitalId, status);
        },
        enabled: Boolean(hospitalId),
    });

    const doctors: DoctorAffiliation[] = Array.isArray(data) ? data : [];

    return {
        doctors,
        isLoading,
        isError,
        refetch,
    };
};
