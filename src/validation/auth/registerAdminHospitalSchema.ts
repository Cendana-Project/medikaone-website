import * as yup from "yup";

export const registerAdminSchema = yup.object({
    hospitalId: yup
        .string()
        .required("Kode rumah sakit wajib diisi"),

    email: yup
        .string()
        .email("Email tidak valid")
        .required("Email wajib diisi"),

    username: yup
        .string()
        .min(3, "Username minimal 3 karakter")
        .required("Username wajib diisi"),

    phone: yup
        .string()
        .matches(/^(?:\+62|0)\d{9,15}$/, "Nomor telepon harus format +62 atau 0 dan minimal 10 digit")
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
        .matches(/^[A-Za-z\s]+$/, "Nama depan hanya boleh huruf")
        .required("Nama depan wajib diisi"),

    last_name: yup
        .string()
        .min(2, "Nama belakang minimal 2 huruf")
        .matches(/^[A-Za-z\s]+$/, "Nama belakang hanya boleh huruf")
        .required("Nama belakang wajib diisi"),

    dob: yup
        .string()
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
        .matches(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka")
        .required("NIK wajib diisi"),
});
