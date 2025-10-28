import * as yup from "yup";

export const registerStaffSchema = yup.object({
    hospitalId: yup.string().required("Hospital wajib diisi"),

    role: yup
        .string()
        .oneOf(["nurse", "receptionist", "bod", "doctor"], "Role tidak valid")
        .required("Role wajib diisi"),

    username: yup
        .string()
        .min(3, "Username minimal 3 karakter")
        .matches(/^[a-zA-Z0-9._-]+$/, "Username hanya boleh huruf, angka, titik, underscore atau minus")
        .required("Username wajib diisi"),

    email: yup
        .string()
        .email("Email tidak valid")
        .required("Email wajib diisi"),

    phone: yup
        .string()
        .matches(
            /^\+62\d{8,14}$/,
            "Nomor telepon harus format +62 dan 10-15 digit"
        )
        .required("Nomor telepon wajib diisi"),

    password: yup
        .string()
        .min(8, "Password minimal 8 karakter")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
            "Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial tanpa spasi"
        )
        .required("Password wajib diisi"),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Konfirmasi password tidak cocok")
        .required("Konfirmasi password wajib diisi"),

    first_name: yup
        .string()
        .min(2, "Nama depan minimal 2 huruf")
        .matches(/^[A-Za-z\s'-]+$/, "Nama depan hanya boleh huruf, spasi, tanda - atau '")
        .required("Nama depan wajib diisi"),

    last_name: yup
        .string()
        .min(2, "Nama belakang minimal 2 huruf")
        .matches(/^[A-Za-z\s'-]+$/, "Nama belakang hanya boleh huruf, spasi, tanda - atau '")
        .required("Nama belakang wajib diisi"),

    dob: yup
        .string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Tanggal lahir harus format YYYY-MM-DD")
        .required("Tanggal lahir wajib diisi"),

    address: yup
        .string()
        .min(5, "Alamat minimal 5 karakter")
        .required("Alamat wajib diisi"),

    gender: yup
        .mixed<"L" | "P">()
        .oneOf(["L", "P"], "Gender tidak valid")
        .required("Gender wajib diisi"),

    nik: yup
        .string()
        .matches(/^\d{16}$/, "NIK harus 16 digit angka")
        .required("NIK wajib diisi"),
});