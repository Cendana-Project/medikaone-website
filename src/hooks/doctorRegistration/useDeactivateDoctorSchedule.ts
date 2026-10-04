"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateDoctorSchedule } from "@/services/DoctorRegistrationService";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import { DeactivateSchedulePayload } from "@/types/doctorRegistration";

export const useDeactivateDoctorSchedule = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeactivateSchedulePayload) =>
      deactivateDoctorSchedule(hospitalId, payload),
    onSuccess: (data) => {
      handleApiSuccess(data, "Pengajuan Penonaktifan Dikirim", "Permintaan penonaktifan jadwal dokter berhasil diajukan.");
      queryClient.invalidateQueries({ queryKey: ["scheduleChanges", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
    },
    onError: (error) => {
      handleApiError(error, "Gagal Mengajukan Penonaktifan Jadwal");
    },
  });
};
