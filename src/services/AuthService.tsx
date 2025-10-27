import api from "@/lib/api";
import { safeRequest } from "@/app/utils/safeRequest";
import Cookies from "js-cookie";
import { LoginRequest } from "@/types/auth";

export const loginHospital = async (payload: LoginRequest) => {
    return safeRequest(async () => {
        const response = await api.post("auth/login/hospital", 
            payload
        );
        console.log(response);
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
