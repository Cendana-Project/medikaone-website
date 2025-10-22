import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email tidak valid')
    .required('Email wajib diisi'),
  
  password: yup
    .string()
    .min(8, 'Password minimal 8 karakter')
    .required('Password wajib diisi'),
    
  // PENTING: Validasi password harus sama
  retypePassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Password tidak cocok')
    .required('Ulangi Password wajib diisi'),

  employeeId: yup
    .string()
    .required('ID Pegawai wajib diisi'),

  role: yup
    .string()
    .oneOf(['Dokter', 'Perawat', 'Staf Medis', 'Admin']) // Daftar role yang valid
    .required('Role pegawai wajib dipilih'),

  // Checkbox persetujuan
  agreement: yup
    .boolean()
    .oneOf([true], 'Anda harus menyetujui ketentuan layanan')
    .required('Persetujuan wajib dicentang'),
});

export type RegisterFormFields = yup.InferType<typeof registerSchema>;

// Also export as default and re-export names to ensure compatibility with different module resolvers
export default registerSchema;