'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom } from "@/services/DoctorRegistrationService";
import { CreateRoomRequest } from "@/types/doctorRegistration";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

export const useCreateRoom = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateRoomRequest) => createRoom(hospitalId, payload),
        onSuccess: () => {
            toast.success("Ruangan berhasil dibuat!");
            queryClient.invalidateQueries({ queryKey: ["rooms", hospitalId] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal membuat ruangan");
        },
    });
};

