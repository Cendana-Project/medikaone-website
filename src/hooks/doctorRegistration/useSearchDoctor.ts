'use client';

import { useQuery } from "@tanstack/react-query";
import { searchDoctor } from "@/services/DoctorRegistrationService";
import { DoctorSearchResult, SearchDoctorParams } from "@/types/doctorRegistration";

export const useSearchDoctor = (hospitalId: string, params: SearchDoctorParams, enabled: boolean = true) => {
    const hasParam = Boolean(params.identity || params.email || params.sip_number || params.medikaone_id || params.query);

    return useQuery<DoctorSearchResult[]>({
        queryKey: ["search-doctor", hospitalId, params],
        queryFn: async () => {
            return await searchDoctor(hospitalId, params);
        },
        enabled: Boolean(hospitalId) && hasParam && enabled,
    });
};
