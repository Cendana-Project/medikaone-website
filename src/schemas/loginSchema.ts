import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email tidak valid')
    .required('Email wajib diisi'),
  password: yup
    .string()
    .min(6, 'Password minimal 6 karakter')
    .required('Password wajib diisi'),
  rememberMe: yup.boolean().optional().default(false),
});

export type LoginFormFields = yup.InferType<typeof loginSchema>;