import { z } from "zod";

/**
 * Helper to check 4 sequential digits (ascending or descending, e.g. 1234 or 9876)
 */
export const has4SequentialDigits = (str: string): boolean => {
    for (let i = 0; i <= str.length - 4; i++) {
        const c1 = str.charCodeAt(i);
        const c2 = str.charCodeAt(i + 1);
        const c3 = str.charCodeAt(i + 2);
        const c4 = str.charCodeAt(i + 3);
        if (c1 >= 48 && c1 <= 57 && c2 >= 48 && c2 <= 57 && c3 >= 48 && c3 <= 57 && c4 >= 48 && c4 <= 57) {
            if ((c2 === c1 + 1 && c3 === c2 + 1 && c4 === c3 + 1) || (c2 === c1 - 1 && c3 === c2 - 1 && c4 === c3 - 1)) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Base password security schema according to security requirements:
 * 1. Length 8-128 characters
 * 2. Min 1 uppercase
 * 3. Min 1 lowercase
 * 4. Min 1 number
 * 5. Min 1 symbol/punctuation
 * 6. No 4 sequential numbers (e.g. 1234 or 9876)
 * 7. No 4 identical consecutive characters (e.g. aaaa or 1111)
 */
export const passwordSecuritySchema = z.string()
    .min(8, "Password harus 8 - 128 karakter")
    .max(128, "Password harus 8 - 128 karakter")
    .regex(/[A-Z]/, "Password harus mengandung minimal satu huruf besar")
    .regex(/[a-z]/, "Password harus mengandung minimal satu huruf kecil")
    .regex(/\d/, "Password harus mengandung minimal satu angka")
    .regex(/[^A-Za-z0-9]/, "Password harus mengandung minimal satu simbol/tanda baca")
    .refine((val) => !has4SequentialDigits(val), {
        message: "Password tidak boleh mengandung 4 angka berurutan (misal: 1234 atau 9876)",
    })
    .refine((val) => !/(.)\1{3}/.test(val), {
        message: "Password tidak boleh memiliki 4 karakter sama berturut-turut (misal: aaaa, 1111, atau !!!!)",
    });

/**
 * Helper to validate if password contains username, full email, or local part of email before @
 */
export const validatePasswordContainsUserData = (
    password: string,
    email?: string,
    username?: string
): string | null => {
    if (!password) return null;
    const lowerPass = password.toLowerCase();

    if (username && username.trim().length > 0) {
        const lowerUser = username.trim().toLowerCase();
        if (lowerPass.includes(lowerUser)) {
            return "Password tidak boleh mengandung username";
        }
    }

    if (email && email.trim().length > 0) {
        const lowerEmail = email.trim().toLowerCase();
        if (lowerPass.includes(lowerEmail)) {
            return "Password tidak boleh mengandung email lengkap";
        }

        const localPart = lowerEmail.split("@")[0];
        if (localPart && localPart.length > 0 && lowerPass.includes(localPart)) {
            return "Password tidak boleh mengandung bagian email sebelum @";
        }
    }

    return null;
};

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
});

export const verifyPinSchema = z.object({
    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
    pin: z.string().min(1, "PIN wajib diisi").length(6, "PIN harus 6 digit angka"),
});

export const resetPasswordSchema = z.object({
    email: z.string().optional(),
    new_password: passwordSecuritySchema,
    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm_password"],
}).superRefine((data, ctx) => {
    const errorMsg = validatePasswordContainsUserData(data.new_password, data.email);
    if (errorMsg) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMsg,
            path: ["new_password"],
        });
    }
});
