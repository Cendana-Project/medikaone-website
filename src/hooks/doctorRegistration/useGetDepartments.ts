'use client';

import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/services/DoctorRegistrationService";
import { Department } from "@/types/doctorRegistration";

export const useGetDepartments = (hospitalId: string) => {
    return useQuery<Department[]>({
        queryKey: ["departments", hospitalId],
        queryFn: async () => {
            const res = await getDepartments(hospitalId);
            return res.data || [];
        },
        enabled: Boolean(hospitalId),
    });
};
