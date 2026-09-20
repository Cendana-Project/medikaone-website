'use client';

import { useQuery } from "@tanstack/react-query";
import { getContractUrl } from "@/services/DoctorRegistrationService";
import { ContractUrlResponse } from "@/types/doctorRegistration";

export const useGetContractUrl = (hospitalId: string, invitationId: string, version: string = "original") => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["contract-url", hospitalId, invitationId, version],
        queryFn: async () => {
            const res = await getContractUrl(hospitalId, invitationId, version);
            return res.data || res;
        },
        enabled: Boolean(hospitalId) && Boolean(invitationId),
    });

    const contractData: ContractUrlResponse | null = data ? (data.url ? data : data.data || null) : null;

    return {
        contractData,
        isLoading,
        isError,
        refetch,
    };
};
