import api from "@/lib/api";
import { safeRequest } from "@/app/utils/safeRequest";
import { 
    CreateDepartmentRequest, 
    CreateInvitationRequest, 
    CreateRoomRequest, 
    SearchDoctorParams, 
    UpdateDoctorStatusRequest 
} from "@/types/doctorRegistration";

// --- DEPARTMENTS ---

export const getDepartments = async (hospitalId: string) => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}/departments`);
        return response.data;
    });
};

export const createDepartment = async (hospitalId: string, payload: CreateDepartmentRequest) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospitalId}/departments`, payload);
        return response.data;
    });
};

// --- ROOMS ---

export const getRooms = async (hospitalId: string, departmentId?: string) => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}/rooms`, {
            params: departmentId ? { department_id: departmentId } : undefined,
        });
        return response.data;
    });
};

export const createRoom = async (hospitalId: string, payload: CreateRoomRequest) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospitalId}/rooms`, payload);
        return response.data;
    });
};

// --- SEARCH DOCTOR ---

export const searchDoctor = async (hospitalId: string, params: SearchDoctorParams) => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}/doctors/search`, { params });
        return response.data;
    });
};

// --- DOCTOR INVITATIONS ---

export const createDoctorInvitation = async (hospitalId: string, payload: CreateInvitationRequest) => {
    return safeRequest(async () => {
        const formData = new FormData();
        formData.append("doctor_id", payload.doctor_id);
        formData.append("department_id", payload.department_id);
        if (payload.room_id) formData.append("room_id", payload.room_id);
        if (payload.message) formData.append("message", payload.message);
        if (payload.schedules && payload.schedules.length > 0) {
            formData.append("schedules", JSON.stringify(payload.schedules));
        }
        formData.append("contract", payload.contract);

        const response = await api.post(`hospitals/${hospitalId}/doctor-invitations`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    });
};

export const getDoctorInvitations = async (hospitalId: string, status?: string) => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}/doctor-invitations`, {
            params: status ? { status } : undefined,
        });
        return response.data;
    });
};

export const getDoctorInvitation = async (hospitalId: string, invitationId: string) => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}/doctor-invitations/${invitationId}`);
        return response.data;
    });
};

export const getContractUrl = async (hospitalId: string, invitationId: string, version: string = "original") => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}/doctor-invitations/${invitationId}/contract`, {
            params: { version },
        });
        return response.data;
    });
};

export const cancelDoctorInvitation = async (hospitalId: string, invitationId: string) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospitalId}/doctor-invitations/${invitationId}/cancel`);
        return response.data;
    });
};

export const resendDoctorInvitation = async (hospitalId: string, invitationId: string) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospitalId}/doctor-invitations/${invitationId}/resend`);
        return response.data;
    });
};

// --- DOCTOR MANAGEMENT & AFFILIATIONS ---

export const getDoctors = async (hospitalId: string, status?: string) => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}/doctors`, {
            params: status ? { status } : undefined,
        });
        return response.data;
    });
};

export const updateDoctorStatus = async (hospitalId: string, doctorId: string, payload: UpdateDoctorStatusRequest) => {
    return safeRequest(async () => {
        const response = await api.patch(`hospitals/${hospitalId}/doctors/${doctorId}/status`, payload);
        return response.data;
    });
};
