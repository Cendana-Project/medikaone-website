import { useQuery } from "@tanstack/react-query";
import { getScheduleChangeRequests } from "@/services/DoctorRegistrationService";
import { ScheduleChangeRequestItem } from "@/types/doctorRegistration";

export const useGetScheduleChanges = (hospitalId: string, status?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["scheduleChanges", hospitalId, status],
        queryFn: () => getScheduleChangeRequests(hospitalId, status),
        enabled: Boolean(hospitalId),
    });

    const rawList = data?.data || data?.items || (Array.isArray(data) ? data : []);
    const scheduleChanges: ScheduleChangeRequestItem[] = Array.isArray(rawList) ? rawList : [];

    return {
        scheduleChanges,
        isLoading,
        isError,
        refetch,
    };
};
