'use client';

import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/services/DoctorRegistrationService";
import { Room } from "@/types/doctorRegistration";

export const useGetRooms = (hospitalId: string, departmentId?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["rooms", hospitalId, departmentId],
        queryFn: async () => {
            const res = await getRooms(hospitalId, departmentId);
            return res.data || res;
        },
        enabled: Boolean(hospitalId),
    });

    const rawList = data?.data || (Array.isArray(data) ? data : []);
    const rooms: Room[] = Array.isArray(rawList) ? rawList : [];

    return {
        rooms,
        isLoading,
        isError,
        refetch,
    };
};
