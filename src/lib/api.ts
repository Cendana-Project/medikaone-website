import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config/config";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: false,
});

// Separate axios instance for refresh token to avoid interceptor loop
const refreshApi = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: false,
});

const refreshToken = async (): Promise<void> => {
    const refresh_token = Cookies.get("refreshToken");
    
    if (!refresh_token) {
        throw new Error("No refresh token available");
    }

    try {
        const response = await refreshApi.post("/auth/refresh", {
            refresh_token,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data.data;

        Cookies.set("accessToken", access_token, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        if (newRefreshToken) {
            Cookies.set("refreshToken", newRefreshToken, {
                expires: 30,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            });
        }
    } catch (error) {
        throw error;
    }
};

api.interceptors.request.use( 
    (config) => {
        const token = Cookies.get("accessToken");
        const hospitalId = Cookies.get("hospitalId");
        config.headers = config.headers || {}; 
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (hospitalId) {
            config.headers["X-Hospital-ID"] = hospitalId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
    
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
          
            try {
                await refreshToken();
            
                const newToken = Cookies.get("accessToken");
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
            
                return api(originalRequest);
            } catch (err) {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                Cookies.remove("hospitalId");
                Cookies.remove("userId");

                toast.error("Session expired, please login again.");
                window.location.href = "/auth/login";
                return Promise.reject(err);
            }
        }          
        return Promise.reject(error);
    }
);
export default api;