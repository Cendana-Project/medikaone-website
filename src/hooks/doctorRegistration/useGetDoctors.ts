'use client';

import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/services/DoctorRegistrationService";
import { DoctorAffiliation } from "@/types/doctorRegistration";

export const useGetDoctors = (hospitalId: string, status?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["doctors", hospitalId, status],
        queryFn: async () => {
            const res = await getDoctors(hospitalId, status);
            return res.data || res;
        },
        enabled: Boolean(hospitalId),
    });

    const rawList = data?.data || (Array.isArray(data) ? data : []);
    const doctors: DoctorAffiliation[] = Array.isArray(rawList) ? rawList : [];

    return {
        doctors,
        isLoading,
        isError,
        refetch,
    };
};
