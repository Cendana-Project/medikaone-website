'use client';

import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/services/DoctorRegistrationService";
import { DoctorAffiliation } from "@/types/doctorRegistration";

export const useGetDoctors = (hospitalId: string, status?: string) => {
    return useQuery<DoctorAffiliation[]>({
        queryKey: ["doctors", hospitalId, status],
        queryFn: async () => {
            const res = await getDoctors(hospitalId, status);
            return res.data || [];
        },
        enabled: Boolean(hospitalId),
    });
};
