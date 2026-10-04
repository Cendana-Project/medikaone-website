"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoctorSchedule } from "@/services/DoctorRegistrationService";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";

interface DeleteDoctorScheduleParams {
  affiliationId: string;
  scheduleId: string;
}

export const useDeleteDoctorSchedule = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ affiliationId, scheduleId }: DeleteDoctorScheduleParams) =>
      deleteDoctorSchedule(hospitalId, affiliationId, scheduleId),
    onSuccess: (data) => {
      handleApiSuccess(data, "Pengajuan Hapus Jadwal Dikirim", "Permintaan penghapusan slot jadwal berhasil dikirim untuk diajukan.");
      queryClient.invalidateQueries({ queryKey: ["scheduleChanges", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["doctors", hospitalId] });
    },
    onError: (error) => {
      handleApiError(error, "Gagal Mengajukan Hapus Jadwal");
    },
  });
};
