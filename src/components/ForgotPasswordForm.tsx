// src/components/ForgotPasswordForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { forgotPasswordSchema, ForgotPasswordFormFields } from '../schemas/forgotPasswordSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';


// Fungsi Mutasi untuk Mengirim Link Reset (Simulasi)
const sendResetLink = async (data: ForgotPasswordFormFields) => {
  console.log('Sending reset link to:', data.email);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Link reset telah dikirim!' });
    }, 2000);
  });
};

export function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<ForgotPasswordFormFields>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      agreement: false,
    },
  });

  const resetMutation = useMutation({
    mutationFn: sendResetLink,
    onSuccess: () => {
      alert('Link reset telah dikirim ke email Anda!');
      // Setelah sukses, mungkin kembali ke halaman login
      router.push('/login'); 
    },
    onError: (error: any) => {
      alert(`Gagal mengirim link: ${error.message || 'Terjadi kesalahan.'}`);
    },
  });

  const onSubmit = (data: ForgotPasswordFormFields) => {
    resetMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Header */}
        <div className="text-center mb-10 w-full max-w-sm mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Lupa Kata Sandi</h1>
          <p className="mt-6 text-base text-gray-700 leading-relaxed">Akses informasi medis, jadwal dokter, hasil pemeriksaan, dan layanan kesehatan Anda dengan aman.</p>
        </div>

        {/* 1. Field Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="Placeholder..." {...field} className="rounded-xl" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <p className="text-xs text-gray-500 mt-2">
            Silakan masukkan email terdaftar Anda untuk menerima tautan pengaturan ulang kata sandi.
        </p>

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
                  Saya setuju dengan Ketentuan Layanan dan Kebijakan Privasi
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />


        {/* Tombol Send Reset Link */}
        <Button type="submit" className="w-full bg-primary text-white py-3 text-base font-semibold rounded-xl" disabled={resetMutation.isPending}>
          {resetMutation.isPending ? 'Mengirim...' : 'Send Reset Link'}
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

export default ForgotPasswordForm;