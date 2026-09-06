'use client';

import { useQuery } from "@tanstack/react-query";
import { getContractUrl } from "@/services/DoctorRegistrationService";
import { ContractUrlResponse } from "@/types/doctorRegistration";

export const useGetContractUrl = (hospitalId: string, invitationId: string, version: string = "original") => {
    return useQuery<ContractUrlResponse>({
        queryKey: ["contract-url", hospitalId, invitationId, version],
        queryFn: async () => {
            const res = await getContractUrl(hospitalId, invitationId, version);
            return res.data;
        },
        enabled: Boolean(hospitalId) && Boolean(invitationId),
    });
};
