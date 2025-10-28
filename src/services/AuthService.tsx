import api from "@/lib/api";
import { safeRequest } from "@/app/utils/safeRequest";
import Cookies from "js-cookie";
import { LoginHospitalRequest, LoginRequest, RegisterHospitalAdminRequest, RegisterStaffRequest } from "@/types/auth";

export const loginHospital = async (payload: LoginHospitalRequest) => {
    return safeRequest(async () => {
        const response = await api.post("auth/login/hospital", 
            payload
        );
        const { access_token, refresh_token } = response.data.data;

        Cookies.set("accessToken", access_token, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        Cookies.set("refreshToken", refresh_token, {
            expires: 30,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        return response.data;
    });
}

export const loginSuperAdmin = async (payload: LoginRequest) => {
    return safeRequest(async () => {
        const response = await api.post("auth/login", 
            payload
        );
        const { access_token, refresh_token } = response.data.data;

        Cookies.set("accessToken", access_token, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        Cookies.set("refreshToken", refresh_token, {
            expires: 30,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        return response.data;
    });
}

export const registerStaff = async (payload: RegisterStaffRequest, hospital_id: string) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospital_id}/staff`, 
            payload
        );

        console.log(response);

        return response.data;
    });
}

export const registerAdmin = async (payload: RegisterHospitalAdminRequest, hospital_id: string) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospital_id}/admins`, 
            payload,
            {
                headers: {
                    "X-Hospital-Code": hospital_id,
                },
            }
        );

        console.log(response);

        return response.data;
    });
}
