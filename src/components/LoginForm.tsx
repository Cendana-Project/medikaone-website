// src/components/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PasswordInput } from './PasswordInput';
import Link from 'next/link';

const formSchema = yup.object().shape({
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  password: yup.string().min(6, 'Password minimal 6 karakter').required('Password wajib diisi'),
  rememberMe: yup.boolean().default(false),
});

export function LoginForm() {
  const router = useRouter();

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: yup.InferType<typeof formSchema>) => {
      // Simulasikan API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (data.email === 'user@medikaone.com' && data.password === 'rahasia123') {
            resolve({ message: 'Login Berhasil!' });
          } else {
            reject(new Error('Kredensial tidak valid.'));
          }
        }, 1500);
      });
    },
    onSuccess: () => {
      alert('Login Berhasil!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      alert(`Login Gagal: ${error.message || 'Terjadi kesalahan.'}`);
    },
  });

  const onSubmit = (data: yup.InferType<typeof formSchema>) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-16 flex items-center">
      <div className="w-full max-w-md p-20">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-24">
            <div className="text-center">
              <h1 className="text-[64px] sm:text-[96px] md:text-[120px] lg:text-[140px] font-extrabold text-gray-900 leading-tight mb-6">Masuk ke Akun Anda</h1>
              <p className="mt-6 text-lg text-gray-600 max-w-[600px] leading-relaxed mx-auto">Akses informasi medis, jadwal dokter, hasil pemeriksaan, dan layanan kesehatan Anda dengan aman.</p>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-700 mb-4">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Placeholder..." {...field} className="rounded-2xl h-16 px-6 shadow-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-700 mb-4">Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Placeholder..." {...field} className="rounded-2xl h-16 px-6 shadow-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between text-lg mt-8">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="rememberMe"
                        className="h-5 w-5 rounded-sm border-gray-300 focus:ring-primary data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:text-white"
                      />
                    </FormControl>
                    <FormLabel htmlFor="rememberMe" className="text-gray-700 !mt-0 font-normal cursor-pointer text-lg">
                      Ingat saya
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                Lupa Kata Sandi
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full text-white py-6 font-semibold text-base rounded-full hover:bg-teal-700 transition duration-200 mb-6"
              style={{ backgroundColor: '#0d9488' }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Loading...' : 'Login'}
            </Button>

            <p className="mt-8 text-center text-base text-gray-500">
              Belum memiliki akun?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Daftar Akun
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  )
}