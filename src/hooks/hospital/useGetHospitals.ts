import { useQuery } from "@tanstack/react-query";
import { getHospitals } from "@/services/HospitalService";

export interface HospitalItem {
    id: string;
    code: string;
    name: string;
    city?: string;
    province?: string;
}

export const useGetHospitals = (search?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["hospitals", search],
        queryFn: () => getHospitals({ search }),
    });

    const rawList = data?.data || data?.items || (Array.isArray(data) ? data : []);
    const hospitals: HospitalItem[] = Array.isArray(rawList) ? rawList : [];

    return {
        hospitals,
        isLoading,
        isError,
        refetch,
    };
};
