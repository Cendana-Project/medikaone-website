'use client';

import { useQuery } from "@tanstack/react-query";
import { getContractUrl } from "@/services/DoctorRegistrationService";
import { ContractUrlResponse } from "@/types/doctorRegistration";

export const useGetContractUrl = (hospitalId: string, invitationId: string, version: "original" | "signed" = "original") => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["contract-url", hospitalId, invitationId, version],
        queryFn: async () => {
            const res = await getContractUrl(hospitalId, invitationId, version);
            return typeof res === "string" ? { url: res } : (res as ContractUrlResponse);
        },
        enabled: Boolean(hospitalId) && Boolean(invitationId),
    });

    const contractData: ContractUrlResponse | null = data || null;

    return {
        contractData,
        isLoading,
        isError,
        refetch,
    };
};
