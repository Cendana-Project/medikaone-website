// src/components/RegisterForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { registerSchema, RegisterFormFields } from '@/schemas/registerSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from './PasswordInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Import komponen Select (Pastikan sudah diinstal dari Shadcn)
// Note: project doesn't include a custom Select implementation at `@/components/ui/select`.
// Use a native <select> here to avoid a missing-module error and keep the form working.


// Fungsi Mutasi Registrasi (Simulasi)
const registerUser = async (data: RegisterFormFields) => {
  console.log('Registering user:', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Registrasi Berhasil!' });
    }, 1500);
  });
};

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterFormFields>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      retypePassword: '',
      employeeId: '',
      role: 'Dokter',
      agreement: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert('Registrasi Berhasil! Silakan Masuk.');
      router.push('/login'); 
    },
    onError: (error: any) => {
      alert(`Registrasi Gagal: ${error.message || 'Terjadi kesalahan.'}`);
    },
  });

  const onSubmit = (data: RegisterFormFields) => {
    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Daftarkan Akun</h1>
          <p className="mt-2 text-sm text-gray-500">Akses informasi medis, jadwal dokter, hasil pemeriksaan, dan layanan kesehatan Anda dengan aman.</p>
        </div>

        {/* 1. Field Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="Placeholder..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Field Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><PasswordInput placeholder="Placeholder..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* 3. Field Retype Password */}
        <FormField
          control={form.control}
          name="retypePassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retype Password</FormLabel>
              <FormControl><PasswordInput placeholder="Placeholder..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* 4. Field ID Pegawai */}
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Pegawai</FormLabel>
              <FormControl><Input placeholder="Placeholder..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 5. Field Role Pegawai (Menggunakan Select) */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role pegawai</FormLabel>
              <FormControl>
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                >
                  {['Dokter', 'Perawat', 'Staf Medis', 'Admin'].map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 6. Checkbox Persetujuan */}
        <FormField
          control={form.control}
          name="agreement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="agreement"
                  className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary !mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="agreement" className="text-sm font-normal cursor-pointer">
                  Saya setuju dengan <span className='font-semibold text-primary hover:underline'>Ketentuan Layanan dan Kebijakan Privasi</span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />


        {/* Tombol Daftar Akun */}
        <Button type="submit" className="w-full bg-primary text-white py-3 text-base font-semibold" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Loading...' : 'Daftar Akun'}
        </Button>

        {/* Link Masuk */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link href="/" className="font-semibold text-gray-900 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </Form>
  );
}

export default RegisterForm;