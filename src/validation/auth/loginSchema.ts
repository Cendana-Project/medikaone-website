import * as yup from "yup";

export const loginHospitalSchema = yup.object({
    identifier: yup.string().email("Email tidak valid").required("Email wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
    hospital_code:  yup.string().required("Hospital Code wajib diisi")
});

export const loginSuperAdmin = yup.object({
    identity: yup.string().email("Email tidak valid").required("Email wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
});
