import * as yup from 'yup';

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email tidak valid')
    .required('Email wajib diisi'),
    
  // Checkbox persetujuan
  agreement: yup
    .boolean()
    .oneOf([true], 'Anda harus menyetujui ketentuan layanan')
    .required('Persetujuan wajib dicentang'),
});

export type ForgotPasswordFormFields = yup.InferType<typeof forgotPasswordSchema>;

export default forgotPasswordSchema;
