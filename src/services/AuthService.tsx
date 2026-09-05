import api from "@/lib/api";
import { safeRequest } from "@/app/utils/safeRequest";
import Cookies from "js-cookie";
import { 
    changePasswordRequest, 
    forgetPasswordRequest, 
    LoginHospitalRequest, 
    LoginRequest, 
    RegisterHospitalAdminRequest, 
    RegisterStaffRequest, 
    verifyPinRequest 
} from "@/types/auth";
import { queryClient } from "@/lib/queryClient"; 

export const loginHospital = async (payload: LoginHospitalRequest, rememberMe: boolean = true) => {
    return safeRequest(async () => {
        const response = await api.post("auth/login/hospital", 
            payload
        );
        const { access_token, refresh_token, hospital_id } = response.data.data;

        const accessExpiry = rememberMe ? 7 : undefined;
        const refreshExpiry = rememberMe ? 30 : undefined;

        Cookies.set("accessToken", access_token, {
            expires: accessExpiry,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        Cookies.set("refreshToken", refresh_token, {
            expires: refreshExpiry,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        if (hospital_id) {
            Cookies.set("hospitalId", hospital_id, {
                expires: refreshExpiry,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            });
        }

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

export const verifyPin = async (payload: verifyPinRequest) => {
    return safeRequest(async () => {
        const response = await api.post("auth/password/verify-pin",
            payload
        );
        
        return response.data;
    });
};

export const changePassword = async (payload: changePasswordRequest) => {
    return safeRequest(async () => {
        const response = await api.post("auth/password/reset", 
            payload
        );
            
        return response.data;
    });
};

export const getUserInfo = async () => {
    return safeRequest(async () => {
        const response = await api.get("tenant/me");
        return response.data;
    })
}

export const logout = async () => {
    return safeRequest(async () => {
        const refresh_token = Cookies.get("refreshToken");
        if (refresh_token) {
            try {
                await api.post("auth/logout", { refresh_token });
            } catch {
                // Ignore backend error during logout cleanup
            }
        }
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("hospitalId");

        queryClient.clear();
        return { success: true, message: "Logout successful" };
    });
};
