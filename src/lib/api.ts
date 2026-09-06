import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
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

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const isTokenExpired = (token: string): boolean => {
    try {
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) return true;
        const decodedJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const decoded = JSON.parse(decodedJson);
        if (!decoded.exp) return false;
        // Buffer of 10 seconds before actual exp
        return Date.now() / 1000 >= decoded.exp - 10;
    } catch {
        return true;
    }
};

const refreshToken = async (): Promise<string> => {
    const refresh_token = Cookies.get("refreshToken");
    
    if (!refresh_token) {
        throw new Error("No refresh token available");
    }

    try {
        const idempotency_key = typeof crypto !== "undefined" && crypto.randomUUID 
            ? crypto.randomUUID() 
            : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const response = await refreshApi.post("auth/refresh", {
            refresh_token,
            idempotency_key,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data.data;

        if (!access_token) {
            throw new Error("Invalid access token returned from refresh API");
        }

        const rememberPref = typeof window !== "undefined" ? localStorage.getItem("remember_me_preference") : null;
        const isRemembered = rememberPref !== "false";

        const accessExpiry = isRemembered ? 7 : undefined;
        const refreshExpiry = isRemembered ? 30 : undefined;

        Cookies.set("accessToken", access_token, {
            expires: accessExpiry,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        if (newRefreshToken) {
            Cookies.set("refreshToken", newRefreshToken, {
                expires: refreshExpiry,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            });
        }

        return access_token;
    } catch (error) {
        throw error;
    }
};

api.interceptors.request.use( 
    async (config) => {
        const isAuthEndpoint = config.url?.includes("auth/login") || 
                               config.url?.includes("auth/password") || 
                               config.url?.includes("auth/refresh") ||
                               config.url?.includes("auth/logout");

        if (!isAuthEndpoint) {
            let token = Cookies.get("accessToken");
            const refreshTokenCookie = Cookies.get("refreshToken");

            // Prioritize Refresh Token: If access token is missing or expired, refresh FIRST before sending request
            if ((!token || isTokenExpired(token)) && refreshTokenCookie) {
                if (isRefreshing) {
                    await new Promise<string>((resolve, reject) => {
                        failedQueue.push({
                            resolve: (newToken: string) => {
                                token = newToken;
                                resolve(newToken);
                            },
                            reject: (err: unknown) => {
                                reject(err);
                            },
                        });
                    });
                } else {
                    isRefreshing = true;
                    try {
                        token = await refreshToken();
                        processQueue(null, token);
                    } catch (err) {
                        processQueue(err, null);
                        Cookies.remove("accessToken");
                        Cookies.remove("refreshToken");
                        Cookies.remove("hospitalId");
                        Cookies.remove("userId");

                        if (typeof window !== "undefined" && window.location.pathname !== "/auth/login") {
                            toast.error("Session expired, please login again.");
                            window.location.href = "/auth/login";
                        }
                        return Promise.reject(err);
                    } finally {
                        isRefreshing = false;
                    }
                }
            }

            config.headers = config.headers || {};
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        const hospitalId = Cookies.get("hospitalId");
        if (hospitalId) {
            config.headers = config.headers || {};
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
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const isAuthEndpoint = originalRequest?.url?.includes("auth/login") || 
                               originalRequest?.url?.includes("auth/password") || 
                               originalRequest?.url?.includes("auth/logout");
    
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(api(originalRequest));
                        },
                        reject: (err) => {
                            reject(err);
                        },
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await refreshToken();
                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);

                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                Cookies.remove("hospitalId");
                Cookies.remove("userId");

                if (typeof window !== "undefined" && window.location.pathname !== "/auth/login") {
                    toast.error("Session expired, please login again.");
                    window.location.href = "/auth/login";
                }
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }          
        return Promise.reject(error);
    }
);
export default api;