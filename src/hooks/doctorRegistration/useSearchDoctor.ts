'use client';

import { useQuery } from "@tanstack/react-query";
import { searchDoctor } from "@/services/DoctorRegistrationService";
import { DoctorSearchResult, SearchDoctorParams } from "@/types/doctorRegistration";

export const useSearchDoctor = (hospitalId: string, params: SearchDoctorParams, enabled: boolean = true) => {
    const hasParam = Boolean(params.email || params.sip_number || params.medikaone_id);

    return useQuery<DoctorSearchResult>({
        queryKey: ["search-doctor", hospitalId, params],
        queryFn: async () => {
            const res = await searchDoctor(hospitalId, params);
            return res.data;
        },
        enabled: Boolean(hospitalId) && hasParam && enabled,
    });
};
