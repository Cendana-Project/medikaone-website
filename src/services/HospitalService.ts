import api from "@/lib/api";
import { safeRequest } from "@/app/utils/safeRequest";
import { 
    CreateHospitalAdminRequest, 
    CreateHospitalRequest, 
    CreateHospitalStaffRequest,
    UploadHospitalImagePayload,
    UpdateHospitalImagePayload 
} from "@/types/hospital";

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
 * Super Admin / Hospital Admin: Update hospital profile data.
 * PATCH /v1/hospitals/:hospitalId
 */
export const updateHospital = async (hospitalId: string, payload: Partial<CreateHospitalRequest>) => {
    return safeRequest(async () => {
        const response = await api.patch(`hospitals/${hospitalId}`, payload);
        return response.data;
    });
};

/**
 * Get single hospital detail by ID.
 * GET /v1/hospitals/:hospitalId
 */
export const getHospitalById = async (hospitalId: string) => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}`);
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

/**
 * Get list of hospitals in system.
 * GET /v1/hospitals
 */
export const getHospitals = async (params?: { search?: string; limit?: number }) => {
    return safeRequest(async () => {
        const response = await api.get("hospitals", { params });
        return response.data;
    });
};

// --- HOSPITAL IMAGES & GALLERY ---

/**
 * Public / Admin: Get list of hospital images.
 * GET /v1/hospitals/:hospitalId/images
 */
export const getHospitalImages = async (hospitalId: string) => {
    return safeRequest(async () => {
        const response = await api.get(`hospitals/${hospitalId}/images`);
        return response.data;
    });
};

/**
 * Hospital Admin / Super Admin: Upload hospital image.
 * POST /v1/hospitals/:hospitalId/images (multipart/form-data)
 */
export const uploadHospitalImage = async (hospitalId: string, payload: UploadHospitalImagePayload) => {
    return safeRequest(async () => {
        const formData = new FormData();
        formData.append("image", payload.image);
        if (payload.caption !== undefined) formData.append("caption", payload.caption);
        if (payload.sort_order !== undefined) formData.append("sort_order", String(payload.sort_order));
        if (payload.is_cover !== undefined) formData.append("is_cover", String(payload.is_cover));

        const response = await api.post(`hospitals/${hospitalId}/images`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    });
};

/**
 * Hospital Admin / Super Admin: Update hospital image metadata.
 * PATCH /v1/hospitals/:hospitalId/images/:imageId
 */
export const updateHospitalImage = async (hospitalId: string, imageId: string, payload: UpdateHospitalImagePayload) => {
    return safeRequest(async () => {
        const response = await api.patch(`hospitals/${hospitalId}/images/${imageId}`, payload);
        return response.data;
    });
};

/**
 * Hospital Admin / Super Admin: Delete hospital image.
 * DELETE /v1/hospitals/:hospitalId/images/:imageId
 */
export const deleteHospitalImage = async (hospitalId: string, imageId: string) => {
    return safeRequest(async () => {
        const response = await api.delete(`hospitals/${hospitalId}/images/${imageId}`);
        return response.data;
    });
};
