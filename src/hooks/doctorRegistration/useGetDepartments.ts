'use client';

import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/services/DoctorRegistrationService";
import { Department } from "@/types/doctorRegistration";

export const useGetDepartments = (hospitalId: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["departments", hospitalId],
        queryFn: async () => {
            const res = await getDepartments(hospitalId);
            return res.data || res;
        },
        enabled: Boolean(hospitalId),
    });

    const rawList = data?.data || (Array.isArray(data) ? data : []);
    const departments: Department[] = Array.isArray(rawList) ? rawList : [];

    return {
        departments,
        isLoading,
        isError,
        refetch,
    };
};
