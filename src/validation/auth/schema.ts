import * as yup from "yup";

export const loginSchema = yup.object({
    identifier: yup.string().email("Email tidak valid").required("Email wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
    hospital_code:  yup.string().required("Hospital Code wajib diisi")
});

export const registerSchema = yup.object({
    role: yup
        .string()
        .oneOf(["nurse", "receptionist", "bod", "doctor"], "Role tidak valid")
        .required("Role wajib diisi"),

    email: yup
        .string()
        .email("Email tidak valid")
        .required("Email wajib diisi"),

    phone: yup
        .string()
        .matches(/^\+62\d{8,15}$/, "Nomor telepon harus format +62 dan minimal 10 digit")
        .required("Nomor telepon wajib diisi"),

    password: yup
        .string()
        .min(8, "Password minimal 8 karakter")
        .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
        "Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial tanpa spasi"
        )
        .required("Password wajib diisi"),

    first_name: yup
        .string()
        .min(2, "Nama depan minimal 2 huruf")
        .matches(/^[A-Za-z]+$/, "Nama depan hanya boleh huruf")
        .required("Nama depan wajib diisi"),

    last_name: yup
        .string()
        .min(2, "Nama belakang minimal 2 huruf")
        .matches(/^[A-Za-z]+$/, "Nama belakang hanya boleh huruf")
        .required("Nama belakang wajib diisi"),
});