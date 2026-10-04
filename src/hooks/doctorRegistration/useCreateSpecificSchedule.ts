"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpecificScheduleRequest } from "@/services/DoctorRegistrationService";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import { CreateSpecificSchedulePayload } from "@/types/doctorRegistration";

export const useCreateSpecificSchedule = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSpecificSchedulePayload) =>
      createSpecificScheduleRequest(hospitalId, payload),
    onSuccess: (data) => {
      handleApiSuccess(data, "Jadwal Spesifik Diajukan", "Pengajuan jadwal spesifik bertanggal berhasil dikirim.");
      queryClient.invalidateQueries({ queryKey: ["scheduleChanges", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
    },
    onError: (error) => {
      handleApiError(error, "Gagal Mengajukan Jadwal Spesifik");
    },
  });
};
