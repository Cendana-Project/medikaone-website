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
import api from '@/lib/api';
import { LoginFormFields, loginSchema } from '@/schemas/loginSchema'; 
import { useRouter } from 'next/navigation';
import { PasswordInput } from './PasswordInput';
import Link from 'next/link';

const loginUser = async (data: LoginFormFields) => {
  const response = await api.post('/login', data); 
  return response.data;
};

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormFields>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormFields) => loginUser(data),
    onSuccess: (data: any) => {
      const token = (data && (data as any).token) || null;
      alert(token ? `Login Berhasil! Token: ${token}` : 'Login Berhasil!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = (error as any).response?.data?.error || error.message || 'Kredensial tidak valid.';
      alert(`Login Gagal: ${errorMessage}`);
    },
  });

  const onSubmit = (data: LoginFormFields) => {
    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"> Masuk ke Akun Anda </h1> 
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          Akses informasi medis, jadwal dokter, hasil pemeriksaan, dan layanan kesehatan Anda dengan aman.</p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base text-gray-700">Email</FormLabel>
              <FormControl>

                <Input placeholder="Placeholder..." {...field} className="rounded-xl h-12 px-4 shadow-sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base text-gray-700">Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Placeholder..." {...field} className="rounded-xl h-12 px-4 shadow-sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between text-sm pt-2">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="rememberMe"
                    className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </FormControl>
                <FormLabel htmlFor="rememberMe" className="text-gray-700 !mt-0 font-normal cursor-pointer">
                  Ingat saya
                </FormLabel>
              </FormItem>
            )}
          />

          <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
            Lupa Kata Sandi
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-white py-3 font-semibold text-base rounded-xl 
                     hover:bg-emerald-700 transition duration-200"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Mengirim...' : 'Login'}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum memiliki akun?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Daftar Akun
          </Link>
        </p>
      </form>
    </Form>
  );
}