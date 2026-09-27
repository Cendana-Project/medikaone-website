import { useQuery } from "@tanstack/react-query";
import { getHospitals } from "@/services/HospitalService";
import { HospitalFacility, HospitalOpeningHour } from "@/types/hospital";

export interface HospitalItem {
    id: string;
    code: string;
    name: string;
    city?: string;
    province?: string;
    country?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    established_year?: number;
    timezone?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    facilities?: HospitalFacility[] | string;
    opening_hours?: HospitalOpeningHour[];
    rating_average?: number;
    rating_count?: number;
    is_active?: boolean;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
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
