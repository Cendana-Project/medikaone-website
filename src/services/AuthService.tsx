import api from "@/lib/api";
import { safeRequest } from "@/app/utils/safeRequest";
import Cookies from "js-cookie";
import { forgetPasswordRequest, LoginHospitalRequest, LoginRequest, RegisterHospitalAdminRequest, RegisterStaffRequest } from "@/types/auth";
import { queryClient } from "@/lib/queryClient"; 

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

        queryClient.invalidateQueries({ queryKey: ["me"] });

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

        queryClient.invalidateQueries({ queryKey: ["me"] });

        return response.data;
    });
}

export const registerStaff = async (payload: RegisterStaffRequest, hospital_id: string) => {
    return safeRequest(async () => {
        const response = await api.post(`hospitals/${hospital_id}/staff`, 
            payload
        );

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

        return response.data;
    });
}

export const forgotPassword = async (payload: forgetPasswordRequest) => {
    return safeRequest(async () => {
        const response = await api.post("auth/password/forgot",
            payload
        );
        
        return response.data;
    });
};

export const changePassword = async (payload: forgetPasswordRequest) => {
    return safeRequest(async () => {
        const response = await api.post("auth/password/reset", 
            payload
        );
            
        return response.data;
    });
};

export const getUserInfo = async () => {
    return safeRequest(async () => {
        const response = await api.get("me");
        return response.data;
    })
}

export const logout = async () => {
    return safeRequest(async () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        queryClient.clear();
        return { success: true, message: "Logout successful" };
    });
};
