import api from "@/lib/api";
import { safeRequest } from "@/app/utils/safeRequest";
import { 
    CreateDepartmentRequest, 
    CreateInvitationRequest, 
    CreateRoomRequest, 
    CreateScheduleChangePayload,
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

export const updateDepartment = async (hospitalId: string, departmentId: string, payload: Partial<CreateDepartmentRequest>) => {
    return safeRequest(async () => {
        const response = await api.put(`hospitals/${hospitalId}/departments/${departmentId}`, payload);
        return response.data;
    });
};

export const deleteDepartment = async (hospitalId: string, departmentId: string) => {
    return safeRequest(async () => {
        const response = await api.delete(`hospitals/${hospitalId}/departments/${departmentId}`);
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

export const updateRoom = async (hospitalId: string, roomId: string, payload: Partial<CreateRoomRequest>) => {
    return safeRequest(async () => {
        const response = await api.put(`hospitals/${hospitalId}/rooms/${roomId}`, payload);
        return response.data;
    });
};

export const deleteRoom = async (hospitalId: string, roomId: string) => {
    return safeRequest(async () => {
        const response = await api.delete(`hospitals/${hospitalId}/rooms/${roomId}`);
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

// Helper function to create a valid minimal PDF 1.4 File object for contract uploads
export const createValidMinimalPdfFile = (filename: string = "kontrak-dokter.pdf"): File => {
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 55 >>
stream
BT
/F1 12 Tf
100 700 Td
(Dokumen Kontrak Kerjasama Dokter - MedikaOne) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000202 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
306
%%EOF`;
    return new File([pdfContent], filename, { type: "application/pdf" });
};

// --- DOCTOR INVITATIONS ---

export const createDoctorInvitation = async (hospitalId: string, payload: CreateInvitationRequest) => {
    return safeRequest(async () => {
        const formData = new FormData();
        formData.append("doctor_id", payload.doctor_id);
        formData.append("department_id", payload.department_id);
        if (payload.room_id) formData.append("room_id", payload.room_id);
        if (payload.message) formData.append("message", payload.message);

        const formattedSchedules = (payload.schedules || []).map((slot) => {
            const dayArr = Array.isArray(slot.day_of_week)
                ? slot.day_of_week.map(Number)
                : [Number(slot.day_of_week)];

            const mode = slot.booking_mode || "FIXED_SLOT";
            const item: Record<string, unknown> = {
                booking_mode: mode,
                day_of_week: dayArr,
                start_time: slot.start_time,
                end_time: slot.end_time,
                timezone: slot.timezone || "Asia/Jakarta",
            };

            if (mode === "SESSION_QUEUE") {
                item.capacity = Number(slot.capacity || 20);
            } else {
                item.slot_duration_minutes = Number(slot.slot_duration_minutes || 30);
            }

            return item;
        });

        formData.append("schedules", JSON.stringify(formattedSchedules));

        const contractFile = (payload.contract instanceof File)
            ? payload.contract
            : createValidMinimalPdfFile();

        formData.append("contract", contractFile, contractFile.name || "kontrak-dokter.pdf");

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

export const getGlobalDoctors = async (params?: { page?: number; limit?: number; q?: string; specialty?: string; hospital_id?: string }) => {
    return safeRequest(async () => {
        const response = await api.get("doctors", { params });
        return response.data;
    });
};

export const getDoctorById = async (doctorId: string) => {
    return safeRequest(async () => {
        const response = await api.get(`doctors/${doctorId}`);
        return response.data;
    });
};

export const updateDoctorStatus = async (hospitalId: string, doctorId: string, payload: UpdateDoctorStatusRequest) => {
    return safeRequest(async () => {
        const response = await api.patch(`hospitals/${hospitalId}/doctors/${doctorId}/status`, payload);
        return response.data;
    });
};

// --- SCHEDULE CHANGE REQUESTS ---

export const createScheduleChangeRequest = async (hospitalId: string, payload: CreateScheduleChangePayload) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospitalId}/schedule-change-requests`, payload);
        return response.data;
    });
};

export const getScheduleChangeRequests = async (hospitalId: string, status?: string) => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}/schedule-change-requests`, {
            params: status ? { status } : undefined,
        });
        return response.data;
    });
};

export const approveScheduleChangeRequest = async (hospitalId: string, scheduleChangeId: string) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospitalId}/schedule-change-requests/${scheduleChangeId}/approve`);
        return response.data;
    });
};

export const rejectScheduleChangeRequest = async (hospitalId: string, scheduleChangeId: string, payload?: { reason?: string }) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospitalId}/schedule-change-requests/${scheduleChangeId}/reject`, payload || {});
        return response.data;
    });
};

