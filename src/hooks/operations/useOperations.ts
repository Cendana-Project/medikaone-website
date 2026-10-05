"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import {
  cancelAppointment,
  confirmCheckIn,
  createWalkInAppointment,
  listAppointmentQueue,
  listAppointments,
  listHospitalDoctors,
  lookupPatientForCheckIn,
} from "@/services/OperationsService";
import { CreateWalkInPayload } from "@/types/operations";

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
