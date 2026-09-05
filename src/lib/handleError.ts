import toast from "react-hot-toast";
import React from "react";

export interface ApiErrorDetail {
    idn?: string;
    en?: string;
    description?: string;
    message?: string;
}

export interface ApiErrorResponseData {
    message?: string;
    desc?: string | ApiErrorDetail;
    description?: string | ApiErrorDetail;
    message_detail?: string | ApiErrorDetail;
    detail?: string | ApiErrorDetail;
    error_description?: string;
    errors?: Array<{ message?: string } | string> | Record<string, string[]>;
}

// Dictionary mapping raw backend error codes to human-readable Indonesian messages
const ERROR_CODE_MAP: Record<string, string> = {
    USER_NOT_LINKED_TO_HOSPITAL: "Akun Anda belum terhubung dengan rumah sakit mana pun. Silakan hubungi administrator.",
    INVALID_CREDENTIALS: "Email atau kata sandi yang Anda masukkan salah.",
    USER_NOT_FOUND: "Pengguna tidak ditemukan.",
    EMAIL_ALREADY_EXISTS: "Email ini sudah terdaftar di sistem.",
    USERNAME_ALREADY_EXISTS: "Username ini sudah digunakan.",
    PHONE_ALREADY_EXISTS: "Nomor telepon ini sudah terdaftar.",
    NIK_ALREADY_EXISTS: "NIK ini sudah terdaftar di sistem.",
    HOSPITAL_NOT_FOUND: "Data rumah sakit tidak ditemukan.",
    INVALID_PIN: "PIN verifikasi yang Anda masukkan tidak sesuai.",
    PIN_EXPIRED: "PIN verifikasi telah kedaluwarsa. Silakan minta PIN baru.",
    CHALLENGE_EXPIRED: "Sesi verifikasi telah kedaluwarsa. Silakan ulangi proses.",
    RESET_TOKEN_INVALID: "Token pengaturan ulang kata sandi tidak valid atau telah kedaluwarsa.",
    PASSWORD_TOO_WEAK: "Kata sandi yang dimasukkan tidak memenuhi kriteria keamanan.",
    UNAUTHORIZED: "Sesi Anda telah berakhir. Silakan masuk kembali.",
    FORBIDDEN: "Anda tidak memiliki akses untuk melakukan tindakan ini.",
    INTERNAL_SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.",
    TOO_MANY_REQUESTS: "Terlalu banyak percobaan. Silakan tunggu beberapa menit sebelum mencoba lagi.",
    HOSPITAL_CODE_REQUIRED: "Kode rumah sakit wajib diisi untuk login.",
    HOSPITAL_CODE_INVALID: "Kode rumah sakit tidak valid atau tidak aktif.",
    DOCTOR_NOT_FOUND: "Data dokter tidak ditemukan.",
    DEPARTMENT_NOT_FOUND: "Data departemen tidak ditemukan.",
    ROOM_NOT_FOUND: "Data ruangan tidak ditemukan.",
    INVITATION_EXPIRED: "Tautan atau undangan telah kedaluwarsa.",
    INVITATION_ALREADY_ACCEPTED: "Undangan ini sudah pernah diterima sebelumnya.",
    INVITATION_CANCELLED: "Undangan ini telah dibatalkan.",
    MESSAGE_ERROR: "Gagal memproses permintaan.",
    BAD_REQUEST: "Permintaan tidak valid. Silakan periksa kembali data Anda.",
};

function translateErrorString(input: string): string {
    if (!input) return "";

    const trimmed = input.trim();
    const upperKey = trimmed.toUpperCase().replace(/\s+/g, "_");

    if (ERROR_CODE_MAP[upperKey]) {
        return ERROR_CODE_MAP[upperKey];
    }

    // If string is a raw uppercase code (e.g. UNKNOWN_ERROR_CODE), hide raw code and return user-friendly message
    const isRawCode = /^[A-Z0-9_]+$/.test(trimmed);
    if (isRawCode) {
        return "Silakan periksa kembali data Anda atau hubungi dukungan teknis.";
    }

    return trimmed;
}

function extractDetailString(target: string | ApiErrorDetail | undefined): string {
    if (!target) return "";
    if (typeof target === "object") {
        return (
            target.idn ||
            target.description ||
            target.message ||
            target.en ||
            ""
        );
    }
    return String(target);
}

export function handleApiError(error: unknown, fallbackTitle: string = "Terjadi Kesalahan"): void {
    const axiosError = error as { response?: { data?: ApiErrorResponseData } };
    const data = axiosError?.response?.data;

    let mainTitle = fallbackTitle;
    let detailMessage = "";

    if (data) {
        // 1. Extract detail description (checking desc, message_detail, detail, description, etc.)
        const rawDetail =
            extractDetailString(data.desc) ||
            extractDetailString(data.message_detail) ||
            extractDetailString(data.detail) ||
            extractDetailString(data.description) ||
            extractDetailString(data.error_description);

        if (rawDetail) {
            detailMessage = translateErrorString(rawDetail);
        } else if (data.errors) {
            if (Array.isArray(data.errors)) {
                detailMessage = data.errors
                    .map((err) => (typeof err === "object" ? err?.message : err))
                    .filter(Boolean)
                    .map((err) => translateErrorString(String(err)))
                    .join(", ");
            } else if (typeof data.errors === "object") {
                detailMessage = Object.values(data.errors)
                    .flat()
                    .map((err) => translateErrorString(String(err)))
                    .join(", ");
            }
        }

        // 2. Handle title or raw uppercase error code in data.message
        if (data.message) {
            const translatedMessage = translateErrorString(data.message);
            const isErrorCode =
                data.message.includes("_") ||
                data.message === data.message.toUpperCase() ||
                /^[A-Z0-9_]+$/.test(data.message);

            if (!isErrorCode) {
                mainTitle = translatedMessage;
            } else if (!detailMessage) {
                detailMessage = translatedMessage;
            }
        }
    }

    // Display formatted toast with title and description underneath
    if (detailMessage && detailMessage !== mainTitle) {
        toast.error(
            React.createElement(
                "div",
                { className: "flex flex-col gap-0.5 text-left" },
                React.createElement("span", { className: "font-semibold text-sm" }, mainTitle),
                React.createElement("span", { className: "text-xs text-gray-600 font-normal" }, detailMessage)
            )
        );
    } else {
        toast.error(mainTitle || detailMessage || "Terjadi kesalahan saat memproses permintaan.");
    }
}
