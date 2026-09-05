import api from "@/lib/api";
import { safeRequest } from "@/app/utils/safeRequest";

export type UpdateProfilePayload = {
    username?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
};

export const getProfile = async () => {
    return safeRequest(async () => {
        const response = await api.get("profile");
        return response.data;
    });
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
    return safeRequest(async () => {
        const response = await api.patch("profile", payload);
        return response.data;
    });
};

export const uploadProfilePhoto = async (file: File | Blob) => {
    return safeRequest(async () => {
        const formData = new FormData();
        formData.append("file", file, "profile-photo.png");

        const response = await api.put("profile/photo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    });
};

export const getProfilePhotoUrl = async () => {
    return safeRequest(async () => {
        const response = await api.get("profile/photo");
        return response.data;
    });
};

export const deleteProfilePhoto = async () => {
    return safeRequest(async () => {
        const response = await api.delete("profile/photo");
        return response.data;
    });
};
