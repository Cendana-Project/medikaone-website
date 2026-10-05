import api from "@/lib/api";
import { DoctorAffiliation, DoctorSchedule } from "@/types/doctorRegistration";
import {
  AppointmentQueueResponse,
  CheckInCandidate,
  CreateWalkInPayload,
  HospitalAppointment,
} from "@/types/operations";

const unwrap = <T>(response: { data?: { data?: T } | T }): T => {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
};

export const listAppointments = async (
  hospitalId: string,
  params: { date?: string; status?: string } = {}
): Promise<HospitalAppointment[]> => {
  const response = await api.get(`hospitals/${hospitalId}/appointments`, { params });
  return unwrap<HospitalAppointment[]>(response) || [];
};

export const getAppointment = async (hospitalId: string, appointmentId: string): Promise<HospitalAppointment> => {
  const response = await api.get(`hospitals/${hospitalId}/appointments/${appointmentId}`);
  return unwrap<HospitalAppointment>(response);
};

export const cancelAppointment = async (hospitalId: string, appointmentId: string, reason: string): Promise<void> => {
  await api.post(`hospitals/${hospitalId}/appointments/${appointmentId}/cancel`, { reason });
};

export const createWalkInAppointment = async (
  hospitalId: string,
  payload: CreateWalkInPayload,
  idempotencyKey: string
): Promise<HospitalAppointment> => {
  const response = await api.post(`hospitals/${hospitalId}/walk-in-appointments`, payload, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return unwrap<HospitalAppointment>(response);
};

export const lookupPatientForCheckIn = async (
  hospitalId: string,
  identity: Record<string, string>,
  appointmentDate?: string
): Promise<CheckInCandidate[]> => {
  const response = await api.post(`hospitals/${hospitalId}/appointments/check-in/lookup`, {
    appointment_date: appointmentDate || undefined,
    identity,
  });
  const data = unwrap<{ candidates?: CheckInCandidate[] }>(response);
  return data?.candidates || [];
};

export const confirmCheckIn = async (
  hospitalId: string,
  appointmentId: string,
  checkInToken: string,
  overrideReason?: string
): Promise<HospitalAppointment> => {
  const response = await api.post(`hospitals/${hospitalId}/appointments/${appointmentId}/check-in`, {
    check_in_token: checkInToken,
    override_reason: overrideReason || undefined,
  });
  return unwrap<HospitalAppointment>(response);
};

export const listAppointmentQueue = async (
  hospitalId: string,
  params: { date?: string; doctor_id?: string; department_id?: string; status?: string; reference?: string; page?: number; limit?: number } = {}
): Promise<AppointmentQueueResponse> => {
  const response = await api.get(`hospitals/${hospitalId}/appointment-queue`, { params });
  return unwrap<AppointmentQueueResponse>(response);
};

export const listHospitalDoctors = async (hospitalId: string): Promise<DoctorAffiliation[]> => {
  const response = await api.get(`hospitals/${hospitalId}/doctors`, { params: { status: "ACTIVE" } });
  return unwrap<DoctorAffiliation[]>(response) || [];
};

export const getDoctorSchedules = (doctor: DoctorAffiliation): DoctorSchedule[] =>
  doctor.schedule_groups?.flatMap((group) => group.schedules || []) || doctor.schedules || [];
