export type Department = {
    id: string;
    hospital_id: string;
    code: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type CreateDepartmentRequest = {
    code: string;
    name: string;
};

export type Room = {
    id: string;
    hospital_id: string;
    department_id: string;
    code: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type CreateRoomRequest = {
    department_id: string;
    code: string;
    name: string;
};

export type SearchDoctorParams = {
    email?: string;
    sip_number?: string;
    medikaone_id?: string;
};

export type DoctorSearchResult = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    sip_number: string;
    specialty: string;
};

export type DoctorSchedule = {
    id?: string;
    day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
    start_time: string; // HH:mm
    end_time: string; // HH:mm
    timezone: string; // e.g. "Asia/Jakarta"
};

export type CreateInvitationRequest = {
    doctor_id: string;
    department_id: string;
    room_id?: string;
    message?: string;
    schedules?: DoctorSchedule[];
    contract: File;
};

export type DoctorInvitation = {
    id: string;
    hospital_id: string;
    hospital_code: string;
    hospital_name: string;
    doctor_id: string;
    doctor_email: string;
    doctor_first_name: string;
    doctor_last_name: string;
    sip_number: string;
    specialty: string;
    department_id: string;
    department_name: string;
    room_id?: string;
    room_name?: string;
    invited_by: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "EXPIRED";
    message?: string;
    expires_at: string;
    created_at: string;
    contract_filename?: string;
    supersedes_invitation_id?: string;
    schedules?: DoctorSchedule[];
};

export type ContractUrlResponse = {
    url: string;
    expires_at: string;
};

export type DoctorAffiliation = {
    affiliation_id: string;
    hospital_id: string;
    doctor_id: string;
    email: string;
    first_name: string;
    last_name: string;
    sip_number: string;
    specialty: string;
    department_id: string;
    department: string;
    room_id?: string;
    room?: string;
    status: "ACTIVE" | "SUSPENDED";
    joined_at: string;
    schedules?: DoctorSchedule[];
};

export type UpdateDoctorStatusRequest = {
    status: "ACTIVE" | "SUSPENDED";
};
