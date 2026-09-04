'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom } from "@/services/DoctorRegistrationService";
import { CreateRoomRequest } from "@/types/doctorRegistration";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useCreateRoom = (hospitalId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateRoomRequest) => createRoom(hospitalId, payload),
        onSuccess: () => {
            toast.success("Ruangan berhasil dibuat!");
            queryClient.invalidateQueries({ queryKey: ["rooms", hospitalId] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal membuat ruangan");
        },
    });
};
