export type AppointmentStatus =
  | "CONFIRMED"
  | "CHECKED_IN"
  | "WAITING_VITALS"
  | "WAITING_DOCTOR"
  | "IN_CONSULTATION"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED";

export type HospitalAppointment = {
  id: string;
  appointment_number?: string;
  appointment_date?: string;
  patient_id?: string;
  patient_record_id?: string;
  patient_name?: string;
  doctor_id?: string;
  doctor_medikaone_id?: string;
  doctor_name?: string;
  department_name?: string;
  room_name?: string;
  queue_number?: string;
  queue_active?: boolean;
  scheduled_start_at?: string;
  scheduled_end_at?: string;
  timezone?: string;
  booking_mode?: "FIXED_SLOT" | "SESSION_QUEUE";
  status?: AppointmentStatus;
  attendance_status?: string;
  source?: string;
  checked_in_at?: string;
};

export type AppointmentQueueResponse = {
  items: HospitalAppointment[];
  page: number;
  limit: number;
  total: number;
};

export type CheckInCandidate = {
  appointment: HospitalAppointment;
  patient: {
    patient_record_id?: string;
    full_name?: string;
    date_of_birth?: string;
    gender?: string;
    identity_number_masked?: string;
    phone_masked?: string;
  };
  check_in_token: string;
  token_expires_at?: string;
  late_override_required?: boolean;
  lookup_method?: string;
};

export type WalkInPatient =
  | { medikaone_id: string }
  | { patient_record_id: string }
  | {
      first_name: string;
      last_name?: string;
      email?: string;
      phone: string;
      date_of_birth: string;
      gender: "L" | "P";
      identity_type: "NIK" | "PASSPORT" | "OTHER" | "MEDIKAONE_ID";
      identity_number: string;
    };

export type CreateWalkInPayload = {
  schedule_id: string;
  start_time?: string;
  patient: WalkInPatient;
  reason_for_visit: string;
  note?: string;
  consent_version: string;
  capacity_override?: boolean;
  capacity_override_reason?: string;
};
