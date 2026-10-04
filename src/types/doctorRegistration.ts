export type SearchDoctorParams = {
  identity?: string;
  email?: string;
  sip_number?: string;
  medikaone_id?: string;
  query?: string;
};

export type DoctorSearchResult = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  sip_number: string;
  specialty: string;
  doctor_medikaone_id?: string;
};

export type DoctorSchedule = {
  id?: string;
  target_schedule_id?: string;
  day_of_week: number | number[]; // e.g. [1] or 1 (0=Minggu, 1=Senin, ..., 6=Sabtu)
  schedule_date?: string; // YYYY-MM-DD for specific schedules
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  timezone?: string; // e.g. "Asia/Jakarta"
  booking_mode?: "FIXED_SLOT" | "SESSION_QUEUE";
  slot_duration_minutes?: number;
  capacity?: number;
  status?: string;
};

export type ScheduleGroup = {
  type: "RECURRING" | "SPECIFIC";
  status?: string;
  item_ids?: string[];
  schedules: DoctorSchedule[];
  day_of_week?: number[];
  schedule_date?: string;
  day_label?: string;
  time_label?: string;
  display_label?: string;
  start_time?: string;
  end_time?: string;
  timezone?: string;
  booking_mode?: "FIXED_SLOT" | "SESSION_QUEUE";
  slot_duration_minutes?: number;
  capacity?: number;
};

export type DoctorAffiliation = {
  id: string;
  affiliation_id?: string;
  hospital_id: string;
  doctor_id: string;
  doctor_medikaone_id?: string;
  doctor_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  specialty?: string;
  sip_number?: string;
  department_id?: string;
  department_name?: string;
  department?: string;
  room_id?: string;
  room_name?: string;
  room?: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  schedule_groups?: ScheduleGroup[];
  schedules?: DoctorSchedule[];
  pending_schedule_changes?: ScheduleChangeProposal[];
  contract_url?: string;
  created_at?: string;
  updated_at?: string;
};

export type DoctorInvitation = {
  id: string;
  hospital_id: string;
  doctor_id: string;
  doctor_name?: string;
  doctor_first_name?: string;
  doctor_last_name?: string;
  doctor_email?: string;
  specialty?: string;
  sip_number?: string;
  department_id?: string;
  department_name?: string;
  room_id?: string;
  room_name?: string;
  message?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "EXPIRED";
  schedules?: DoctorSchedule[];
  schedule_groups?: ScheduleGroup[];
  rejection_reason?: string;
  contract_url?: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateInvitationRequest = {
  doctor_id: string;
  department_id: string;
  room_id?: string;
  message?: string;
  schedules?: DoctorSchedule[];
  contract?: File | string;
};

export type UpdateInvitationRequest = {
  department_id?: string;
  room_id?: string;
  message?: string;
  schedules?: DoctorSchedule[];
  contract?: File | string;
};

export type ScheduleChangeProposal = {
  id: string;
  affiliation_id: string;
  doctor_id?: string;
  doctor_name?: string;
  specialty?: string;
  department_name?: string;
  operation: "ADD" | "REPLACE" | "REMOVE" | "DEACTIVATE";
  deactivation_scope?: "ALL" | "RECURRING_DAY";
  deactivation_day_of_week?: number;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  schedule_groups?: ScheduleGroup[];
  schedules?: DoctorSchedule[];
  created_at?: string;
  updated_at?: string;
};

export type ScheduleChangeRequestItem = ScheduleChangeProposal;

export type CreateScheduleChangePayload = {
  affiliation_id: string;
  reason?: string;
  schedules: DoctorSchedule[];
};

export type CreateSpecificSchedulePayload = {
  affiliation_id: string;
  reason?: string;
  schedule: DoctorSchedule;
};

export type DeactivateSchedulePayload = {
  affiliation_id: string;
  scope: "ALL" | "RECURRING_DAY";
  day_of_week?: number;
  reason?: string;
};

export type MasterDepartment = {
  id: string;
  code: string;
  name: string;
  category?: string;
  hospital_count?: number;
  doctor_count?: number;
};

export type Department = {
  id: string;
  hospital_id: string;
  master_department_id?: string;
  code: string;
  name: string;
  description?: string;
};

export type CreateDepartmentRequest = {
  master_department_id?: string;
  code?: string;
  name?: string;
};

export type UpdateDepartmentRequest = {
  master_department_id?: string;
  code?: string;
  name?: string;
  description?: string;
};

export type Room = {
  id: string;
  hospital_id: string;
  department_id: string;
  code: string;
  name: string;
  description?: string;
};

export type CreateRoomRequest = {
  department_id: string;
  code: string;
  name: string;
  description?: string;
};

export type UpdateRoomRequest = {
  name?: string;
  description?: string;
};

export type UpdateDoctorStatusRequest = {
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
};

export type ContractUrlResponse = {
  url: string;
  version?: string;
  expires_at?: string;
};
