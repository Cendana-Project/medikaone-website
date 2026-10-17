"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import {
  cancelAppointment,
  confirmCheckIn,
  correctVitals,
  createWalkInAppointment,
  finalizeVitals,
  getExamination,
  getPrescription,
  getPrescriptionDocumentUrl,
  listAppointmentQueue,
  listAppointments,
  listHospitalDoctors,
  lookupPatientForCheckIn,
  saveVitalsDraft,
} from "@/services/OperationsService";
import { CreateWalkInPayload, VitalsInput } from "@/types/operations";

export const useAppointments = (hospitalId: string, date?: string, status?: string) => {
  const query = useQuery({
    queryKey: ["appointments", hospitalId, date, status],
    queryFn: () => listAppointments(hospitalId, { date, status }),
    enabled: Boolean(hospitalId),
  });
  return { appointments: query.data || [], ...query };
};

export const useHospitalDoctors = (hospitalId: string) => {
  const query = useQuery({
    queryKey: ["hospitalDoctors", hospitalId],
    queryFn: () => listHospitalDoctors(hospitalId),
    enabled: Boolean(hospitalId),
  });
  return { doctors: query.data || [], ...query };
};

export const useAppointmentQueue = (hospitalId: string, params: { date?: string; doctor_id?: string; department_id?: string; status?: string; reference?: string; page?: number; limit?: number }) => {
  const query = useQuery({
    queryKey: ["appointmentQueue", hospitalId, params],
    queryFn: () => listAppointmentQueue(hospitalId, params),
    enabled: Boolean(hospitalId),
  });
  return { queue: query.data || { items: [], total: 0, page: 1, limit: 20 }, ...query };
};

export const useLookupPatient = (hospitalId: string) => useMutation({
  mutationFn: (input: { identity: Record<string, string>; appointmentDate?: string }) =>
    lookupPatientForCheckIn(hospitalId, input.identity, input.appointmentDate),
  onError: (error) => handleApiError(error, "Gagal mencari pasien"),
});

export const useConfirmCheckIn = (hospitalId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { appointmentId: string; token: string; overrideReason?: string }) =>
      confirmCheckIn(hospitalId, input.appointmentId, input.token, input.overrideReason),
    onSuccess: (data) => {
      handleApiSuccess(data, "Check-in berhasil", "Pasien masuk ke antrean aktif.");
      client.invalidateQueries({ queryKey: ["appointments", hospitalId] });
      client.invalidateQueries({ queryKey: ["appointmentQueue", hospitalId] });
    },
    onError: (error) => handleApiError(error, "Gagal mengonfirmasi check-in"),
  });
};

export const useCancelAppointment = (hospitalId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { appointmentId: string; reason: string }) =>
      cancelAppointment(hospitalId, input.appointmentId, input.reason),
    onSuccess: () => {
      handleApiSuccess(undefined, "Appointment dibatalkan");
      client.invalidateQueries({ queryKey: ["appointments", hospitalId] });
      client.invalidateQueries({ queryKey: ["appointmentQueue", hospitalId] });
    },
    onError: (error) => handleApiError(error, "Gagal membatalkan appointment"),
  });
};

export const useCreateWalkInAppointment = (hospitalId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { payload: CreateWalkInPayload; idempotencyKey: string }) =>
      createWalkInAppointment(hospitalId, input.payload, input.idempotencyKey),
    onSuccess: (data) => {
      handleApiSuccess(data, "Appointment berhasil dibuat", "Pasien sudah masuk ke antrean aktif.");
      client.invalidateQueries({ queryKey: ["appointments", hospitalId] });
      client.invalidateQueries({ queryKey: ["appointmentQueue", hospitalId] });
    },
    onError: (error) => handleApiError(error, "Gagal membuat appointment walk-in"),
  });
};

export const useExamination = (hospitalId: string, appointmentId?: string) => {
  const query = useQuery({
    queryKey: ["examination", hospitalId, appointmentId],
    queryFn: () => getExamination(hospitalId, appointmentId as string),
    enabled: Boolean(hospitalId && appointmentId),
  });
  return { examination: query.data, ...query };
};

export const useSaveVitalsDraft = (hospitalId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { appointmentId: string; vitals: VitalsInput }) =>
      saveVitalsDraft(hospitalId, input.appointmentId, input.vitals),
    onSuccess: (_data, input) => {
      handleApiSuccess(undefined, "Draft tanda vital tersimpan");
      client.invalidateQueries({ queryKey: ["examination", hospitalId, input.appointmentId] });
    },
    onError: (error) => handleApiError(error, "Gagal menyimpan draft tanda vital"),
  });
};

export const useFinalizeVitals = (hospitalId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { appointmentId: string; vitals: VitalsInput }) =>
      saveVitalsDraft(hospitalId, input.appointmentId, input.vitals).then(() => finalizeVitals(hospitalId, input.appointmentId)),
    onSuccess: (_data, input) => {
      handleApiSuccess(undefined, "Tanda vital difinalisasi", "Pasien diteruskan ke antrean dokter.");
      client.invalidateQueries({ queryKey: ["examination", hospitalId, input.appointmentId] });
      client.invalidateQueries({ queryKey: ["appointments", hospitalId] });
      client.invalidateQueries({ queryKey: ["appointmentQueue", hospitalId] });
    },
    onError: (error) => handleApiError(error, "Gagal memfinalisasi tanda vital"),
  });
};

export const useCorrectVitals = (hospitalId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { appointmentId: string; vitals: VitalsInput; reason: string }) =>
      correctVitals(hospitalId, input.appointmentId, input.vitals, input.reason),
    onSuccess: (_data, input) => {
      handleApiSuccess(undefined, "Koreksi tanda vital tercatat");
      client.invalidateQueries({ queryKey: ["examination", hospitalId, input.appointmentId] });
    },
    onError: (error) => handleApiError(error, "Gagal mengoreksi tanda vital"),
  });
};

export const usePrescription = (hospitalId: string, appointmentId?: string) => {
  const query = useQuery({
    queryKey: ["prescription", hospitalId, appointmentId],
    queryFn: () => getPrescription(hospitalId, appointmentId as string),
    enabled: Boolean(hospitalId && appointmentId),
    retry: false,
  });
  return { prescription: query.data, ...query };
};

export const usePrescriptionDocumentUrl = (hospitalId: string) => useMutation({
  mutationFn: (appointmentId: string) => getPrescriptionDocumentUrl(hospitalId, appointmentId),
  onSuccess: (data) => window.open(data.url, "_blank", "noopener,noreferrer"),
  onError: (error) => handleApiError(error, "Gagal membuka PDF resep"),
});
