'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHospitalStaff } from "@/services/HospitalService";
import { CreateHospitalStaffRequest } from "@/types/hospital";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleError";

type MutationArgs = {
    hospitalId: string;
    payload: CreateHospitalStaffRequest;
};

export const useCreateHospitalStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ hospitalId, payload }: MutationArgs) => createHospitalStaff(hospitalId, payload),
        onSuccess: () => {
            toast.success("Staff rumah sakit berhasil didaftarkan!");
            queryClient.invalidateQueries({ queryKey: ["hospital-staff"] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal mendaftarkan staff rumah sakit");
        },
    });
};

