import { useQuery } from "@tanstack/react-query";
import { getHospitalImages } from "@/services/HospitalService";
import { HospitalImage } from "@/types/hospital";

export function useGetHospitalImages(hospitalId?: string) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["hospital-images", hospitalId],
        queryFn: () => getHospitalImages(hospitalId || ""),
        enabled: Boolean(hospitalId),
    });

    const rawList = data?.data || data?.items || (Array.isArray(data) ? data : []);
    const images: HospitalImage[] = Array.isArray(rawList) ? rawList : [];

    return {
        images,
        isLoading,
        isError,
        refetch,
    };
}
