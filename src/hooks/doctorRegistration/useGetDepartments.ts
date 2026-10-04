'use client';

import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/services/DoctorRegistrationService";
import { Department } from "@/types/doctorRegistration";

export const useGetDepartments = (hospitalId: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["departments", hospitalId],
        queryFn: async () => {
            return getDepartments(hospitalId);
        },
        enabled: Boolean(hospitalId),
    });

    const departments: Department[] = Array.isArray(data) ? data : [];

    return {
        departments,
        isLoading,
        isError,
        refetch,
    };
};
