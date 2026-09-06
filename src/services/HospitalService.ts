import api from "@/lib/api";
import { safeRequest } from "@/app/utils/safeRequest";
import { CreateHospitalAdminRequest, CreateHospitalRequest, CreateHospitalStaffRequest } from "@/types/hospital";

/**
 * Super Admin: Create a new hospital in the system.
 * POST /v1/hospitals
 */
export const createHospital = async (payload: CreateHospitalRequest) => {
    return safeRequest(async () => {
        const response = await api.post("hospitals", payload);
        return response.data;
    });
};

/**
 * Super Admin: Create an admin account for a specific hospital.
 * POST /v1/hospitals/:hospitalId/admins
 */
export const createHospitalAdmin = async (hospitalId: string, payload: CreateHospitalAdminRequest) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospitalId}/admins`, payload);
        return response.data;
    });
};

/**
 * Super Admin: Create a staff account for a specific hospital.
 * POST /v1/hospitals/:hospitalId/staff
 */
export const createHospitalStaff = async (hospitalId: string, payload: CreateHospitalStaffRequest) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospitalId}/staff`, payload);
        return response.data;
    });
};
