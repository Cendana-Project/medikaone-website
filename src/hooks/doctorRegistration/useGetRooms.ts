'use client';

import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/services/DoctorRegistrationService";
import { Room } from "@/types/doctorRegistration";

export const useGetRooms = (hospitalId: string, departmentId?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["rooms", hospitalId, departmentId],
        queryFn: async () => {
            return getRooms(hospitalId, departmentId);
        },
        enabled: Boolean(hospitalId),
    });

    const rooms: Room[] = Array.isArray(data) ? data : [];

    return {
        rooms,
        isLoading,
        isError,
        refetch,
    };
};
