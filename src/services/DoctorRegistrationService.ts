import api from "@/lib/api";
import {
  SearchDoctorParams,
  DoctorSearchResult,
  DoctorAffiliation,
  DoctorInvitation,
  CreateInvitationRequest,
  UpdateInvitationRequest,
  ScheduleChangeProposal,
  CreateScheduleChangePayload,
  CreateSpecificSchedulePayload,
  DeactivateSchedulePayload,
  MasterDepartment,
  Department,
  CreateDepartmentRequest,
  Room,
} from "@/types/doctorRegistration";

// ==========================================
// DOCTOR SEARCH & MASTER DATA
// ==========================================

export const searchDoctor = async (
  hospitalId: string,
  queryOrParams: string | SearchDoctorParams
): Promise<DoctorSearchResult[]> => {
  const paramsObj =
    typeof queryOrParams === "string"
      ? { identity: queryOrParams }
      : {
          identity:
            queryOrParams.identity ||
            queryOrParams.email ||
            queryOrParams.sip_number ||
            queryOrParams.medikaone_id ||
            queryOrParams.query ||
            "",
        };

  const response = await api.get(`/v1/hospitals/${hospitalId}/doctors/search`, {
    params: paramsObj,
  });
  const data = response.data?.data || response.data || [];
  return Array.isArray(data) ? data : [data];
};

export const getMasterDepartments = async (): Promise<MasterDepartment[]> => {
  const response = await api.get("/v1/departments");
  return response.data?.data || response.data || [];
};

export const getDepartments = async (hospitalId: string): Promise<Department[]> => {
  const response = await api.get(`/v1/hospitals/${hospitalId}/departments`);
  return response.data?.data || response.data || [];
};

export const createDepartment = async (
  hospitalId: string,
  payload: string | CreateDepartmentRequest
): Promise<Department> => {
  const body = typeof payload === "string" ? { master_department_id: payload } : payload;
  const response = await api.post(`/v1/hospitals/${hospitalId}/departments`, body);
  return response.data?.data || response.data;
};

export const updateDepartment = async (
  hospitalId: string,
  departmentId: string,
  payload: { master_department_id?: string; code?: string; name?: string; description?: string }
): Promise<Department> => {
  const response = await api.patch(`/v1/hospitals/${hospitalId}/departments/${departmentId}`, payload);
  return response.data?.data || response.data;
};

export const deleteDepartment = async (hospitalId: string, departmentId: string): Promise<void> => {
  await api.delete(`/v1/hospitals/${hospitalId}/departments/${departmentId}`);
};

export const getRooms = async (hospitalId: string, departmentId?: string): Promise<Room[]> => {
  const response = await api.get(`/v1/hospitals/${hospitalId}/rooms`, {
    params: departmentId ? { department_id: departmentId } : {},
  });
  return response.data?.data || response.data || [];
};

export const createRoom = async (
  hospitalId: string,
  payload: { department_id: string; code: string; name: string; description?: string }
): Promise<Room> => {
  const response = await api.post(`/v1/hospitals/${hospitalId}/rooms`, payload);
  return response.data?.data || response.data;
};

export const updateRoom = async (
  hospitalId: string,
  roomId: string,
  payload: { name?: string; description?: string }
): Promise<Room> => {
  const response = await api.patch(`/v1/hospitals/${hospitalId}/rooms/${roomId}`, payload);
  return response.data?.data || response.data;
};

export const deleteRoom = async (hospitalId: string, roomId: string): Promise<void> => {
  await api.delete(`/v1/hospitals/${hospitalId}/rooms/${roomId}`);
};

// ==========================================
// DOCTOR INVITATIONS & AFFILIATIONS
// ==========================================

export const getDoctorInvitations = async (hospitalId: string, status?: string): Promise<DoctorInvitation[]> => {
  const response = await api.get(`/v1/hospitals/${hospitalId}/doctor-invitations`, {
    params: status ? { status } : {},
  });
  return response.data?.data || response.data || [];
};

export const getDoctorInvitationById = async (hospitalId: string, invitationId: string): Promise<DoctorInvitation> => {
  const response = await api.get(`/v1/hospitals/${hospitalId}/doctor-invitations/${invitationId}`);
  return response.data?.data || response.data;
};

export const createDoctorInvitation = async (
  hospitalId: string,
  payload: CreateInvitationRequest
): Promise<DoctorInvitation> => {
  if (payload.contract && typeof payload.contract !== "string") {
    const formData = new FormData();
    formData.append("doctor_id", payload.doctor_id);
    formData.append("department_id", payload.department_id);
    if (payload.room_id) formData.append("room_id", payload.room_id);
    if (payload.message) formData.append("message", payload.message);
    if (payload.schedules && payload.schedules.length > 0) {
      formData.append("schedules", JSON.stringify(payload.schedules));
    }
    formData.append("contract", payload.contract);

    const response = await api.post(`/v1/hospitals/${hospitalId}/doctor-invitations`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data || response.data;
  }

  const response = await api.post(`/v1/hospitals/${hospitalId}/doctor-invitations`, payload);
  return response.data?.data || response.data;
};

export const updateDoctorInvitation = async (
  hospitalId: string,
  invitationId: string,
  payload: UpdateInvitationRequest
): Promise<DoctorInvitation> => {
  if (payload.contract && typeof payload.contract !== "string") {
    const formData = new FormData();
    if (payload.department_id) formData.append("department_id", payload.department_id);
    if (payload.room_id) formData.append("room_id", payload.room_id);
    if (payload.message) formData.append("message", payload.message);
    if (payload.schedules) formData.append("schedules", JSON.stringify(payload.schedules));
    formData.append("contract", payload.contract);

    const response = await api.patch(`/v1/hospitals/${hospitalId}/doctor-invitations/${invitationId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data || response.data;
  }

  const response = await api.patch(`/v1/hospitals/${hospitalId}/doctor-invitations/${invitationId}`, payload);
  return response.data?.data || response.data;
};

export const cancelDoctorInvitation = async (hospitalId: string, invitationId: string): Promise<void> => {
  await api.post(`/v1/hospitals/${hospitalId}/doctor-invitations/${invitationId}/cancel`);
};

export const resendDoctorInvitation = async (hospitalId: string, invitationId: string): Promise<DoctorInvitation> => {
  const response = await api.post(`/v1/hospitals/${hospitalId}/doctor-invitations/${invitationId}/resend`);
  return response.data?.data || response.data;
};

export const deleteDoctorInvitation = async (hospitalId: string, invitationId: string): Promise<void> => {
  await api.delete(`/v1/hospitals/${hospitalId}/doctor-invitations/${invitationId}`);
};

export const getDoctors = async (hospitalId: string, status?: string | Record<string, unknown>): Promise<DoctorAffiliation[]> => {
  const params = typeof status === "string" ? { status } : status || {};
  const response = await api.get(`/v1/hospitals/${hospitalId}/doctor-affiliations`, { params });
  return response.data?.data || response.data || [];
};

export const getGlobalDoctors = async (params?: Record<string, unknown>): Promise<{ data: DoctorAffiliation[] }> => {
  const hospitalId = (params?.hospital_id as string) || "";
  const response = await api.get(`/v1/hospitals/${hospitalId}/doctor-affiliations`, { params });
  const data = response.data?.data || response.data || [];
  return { data: Array.isArray(data) ? data : [data] };
};

export const getDoctorById = async (hospitalId: string, affiliationId: string): Promise<DoctorAffiliation> => {
  const response = await api.get(`/v1/hospitals/${hospitalId}/doctor-affiliations/${affiliationId}`);
  return response.data?.data || response.data;
};

export const deleteDoctorAffiliation = async (hospitalId: string, affiliationId: string): Promise<void> => {
  await api.delete(`/v1/hospitals/${hospitalId}/doctor-affiliations/${affiliationId}`);
};

export const updateDoctorStatus = async (
  hospitalId: string,
  doctorId: string,
  statusOrPayload: "ACTIVE" | "SUSPENDED" | "INACTIVE" | { status: "ACTIVE" | "SUSPENDED" | "INACTIVE" }
): Promise<void> => {
  const status = typeof statusOrPayload === "string" ? statusOrPayload : statusOrPayload.status;
  await api.patch(`/v1/hospitals/${hospitalId}/doctors/${doctorId}/status`, { status });
};

// ==========================================
// SCHEDULES & SCHEDULE CHANGES (ROUTINE vs SPECIFIC)
// ==========================================

export const getScheduleChanges = async (hospitalId: string, status?: string): Promise<ScheduleChangeProposal[]> => {
  const response = await api.get(`/v1/hospitals/${hospitalId}/doctor-affiliations/schedule-changes`, {
    params: status ? { status } : {},
  });
  return response.data?.data || response.data || [];
};
export const getScheduleChangeRequests = getScheduleChanges;

/**
 * 1. Create Routine Schedule Change (REPLACE operation)
 */
export const createScheduleChangeRequest = async (
  hospitalId: string,
  payload: CreateScheduleChangePayload
): Promise<ScheduleChangeProposal> => {
  const response = await api.post(
    `/v1/hospitals/${hospitalId}/doctor-affiliations/${payload.affiliation_id}/schedule-changes`,
    {
      reason: payload.reason,
      schedules: payload.schedules,
    }
  );
  return response.data?.data || response.data;
};
export const createScheduleChange = createScheduleChangeRequest;

/**
 * 2. Create Specific Schedule (ADD operation - Bertanggal YYYY-MM-DD)
 */
export const createSpecificScheduleRequest = async (
  hospitalId: string,
  payload: CreateSpecificSchedulePayload
): Promise<ScheduleChangeProposal> => {
  const response = await api.post(
    `/v1/hospitals/${hospitalId}/doctor-affiliations/${payload.affiliation_id}/schedules/specific`,
    {
      affiliation_id: payload.affiliation_id,
      reason: payload.reason,
      schedule: {
        schedule_date: payload.schedule.schedule_date,
        day_of_week: [],
        start_time: payload.schedule.start_time,
        end_time: payload.schedule.end_time,
        timezone: payload.schedule.timezone || "Asia/Jakarta",
        booking_mode: payload.schedule.booking_mode || "FIXED_SLOT",
        slot_duration_minutes: payload.schedule.booking_mode === "FIXED_SLOT" ? payload.schedule.slot_duration_minutes || 30 : undefined,
        capacity: payload.schedule.booking_mode === "SESSION_QUEUE" ? payload.schedule.capacity || 20 : undefined,
      },
    }
  );
  return response.data?.data || response.data;
};

/**
 * 3. Delete Schedule (REMOVE operation)
 */
export const deleteDoctorSchedule = async (
  hospitalId: string,
  affiliationId: string,
  scheduleId: string
): Promise<void> => {
  await api.delete(`/v1/hospitals/${hospitalId}/doctor-affiliations/${affiliationId}/schedules/${scheduleId}`);
};

/**
 * 4. Deactivate Schedules (DEACTIVATE operation - ALL or RECURRING_DAY)
 */
export const deactivateDoctorSchedule = async (
  hospitalId: string,
  payload: DeactivateSchedulePayload
): Promise<ScheduleChangeProposal> => {
  const response = await api.post(
    `/v1/hospitals/${hospitalId}/doctor-affiliations/${payload.affiliation_id}/schedules/deactivate`,
    {
      scope: payload.scope,
      day_of_week: payload.day_of_week,
      reason: payload.reason,
    }
  );
  return response.data?.data || response.data;
};

/**
 * 5. Approve Schedule Change Proposal
 */
export const approveScheduleChange = async (hospitalId: string, scheduleChangeId: string): Promise<void> => {
  await api.post(`/v1/hospitals/${hospitalId}/doctor-affiliations/schedule-changes/${scheduleChangeId}/approve`);
};
export const approveScheduleChangeRequest = approveScheduleChange;

/**
 * 6. Reject Schedule Change Proposal
 */
export const rejectScheduleChange = async (
  hospitalId: string,
  scheduleChangeId: string,
  payload?: { reason?: string } | string
): Promise<void> => {
  const reason = typeof payload === "string" ? payload : payload?.reason;
  await api.post(`/v1/hospitals/${hospitalId}/doctor-affiliations/schedule-changes/${scheduleChangeId}/reject`, {
    reason,
  });
};
export const rejectScheduleChangeRequest = rejectScheduleChange;

/**
 * 7. Get Signed PDF Contract URL
 */
export const getContractUrl = async (
  hospitalId: string,
  invitationOrAffiliationId: string,
  version: "original" | "signed" = "original"
): Promise<string> => {
  const response = await api.get(
    `/v1/hospitals/${hospitalId}/doctor-invitations/${invitationOrAffiliationId}/contract`,
    { params: { version } }
  );
  return response.data?.data?.url || response.data?.url || "";
};
