import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
    email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
});

export const changePasswordSchema = yup.object({
    email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
    pin: yup.string().required("Pin wajib diisi").length(6, "Pin harus terdiri dari 6 karakter"),
    new_password: yup.string().required("Password wajib diisi"),
});
