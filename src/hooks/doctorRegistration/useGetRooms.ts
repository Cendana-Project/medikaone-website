'use client';

import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/services/DoctorRegistrationService";
import { Room } from "@/types/doctorRegistration";

export const useGetRooms = (hospitalId: string, departmentId?: string) => {
    return useQuery<Room[]>({
        queryKey: ["rooms", hospitalId, departmentId],
        queryFn: async () => {
            const res = await getRooms(hospitalId, departmentId);
            return res.data || [];
        },
        enabled: Boolean(hospitalId),
    });
};
