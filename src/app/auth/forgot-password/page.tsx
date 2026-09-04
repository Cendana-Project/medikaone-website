'use client';

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCarousel from "@/components/auth/authCarousel";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { useVerifyPin } from "@/hooks/auth/useVerifyPin";
import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { forgotPasswordSchema, verifyPinSchema, resetPasswordSchema } from "@/validation/auth/passwordSchema";
import { z } from "zod";

type Step1Data = z.infer<typeof forgotPasswordSchema>;
type Step2Data = z.infer<typeof verifyPinSchema>;
type Step3Data = z.infer<typeof resetPasswordSchema>;

export default function ForgotPassword() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [challengeId, setChallengeId] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const forgotPasswordMutation = useForgotPassword();
    const verifyPinMutation = useVerifyPin();
    const changePasswordMutation = useChangePassword();

    // Step 1 Form
    const formStep1 = useForm<Step1Data>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    // Step 2 Form
    const formStep2 = useForm<Step2Data>({
        resolver: zodResolver(verifyPinSchema),
    });

    // Step 3 Form
    const formStep3 = useForm<Step3Data>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onStep1Submit = (data: Step1Data) => {
        forgotPasswordMutation.mutate(data, {
            onSuccess: (res) => {
                const cId = res?.data?.challenge_id || res?.challenge_id || "";
                setEmail(data.email);
                setChallengeId(cId);
                formStep2.setValue("email", data.email);
                setStep(2);
            },
        });
    };

    const onStep2Submit = (data: Step2Data) => {
        verifyPinMutation.mutate(
            { challenge_id: challengeId, email: data.email, pin: data.pin },
            {
                onSuccess: (res) => {
                    const token = res?.data?.reset_token || res?.reset_token || "";
                    setResetToken(token);
                    setStep(3);
                },
            }
        );
    };

    const onStep3Submit = (data: Step3Data) => {
        changePasswordMutation.mutate({
            challenge_id: challengeId,
            reset_token: resetToken,
            new_password: data.new_password,
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-14 gap-8">
                <Button type="button" className="bg-[#2F907F] py-6 text-base">
                    <Link href="/auth/login" className="flex items-center gap-2 text-white font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali Ke Login
                    </Link>
                </Button>
                <div className="text-center space-y-5 text-[#212121]">
                    <h1 className="text-4xl font-bold">
                        {step === 1 && "Lupa Kata Sandi"}
                        {step === 2 && "Verifikasi PIN"}
                        {step === 3 && "Kata Sandi Baru"}
                    </h1>
                    <p className="w-full text-lg max-w-lg">
                        {step === 1 && "Masukkan email terdaftar Anda untuk menerima PIN reset kata sandi."}
                        {step === 2 && `Masukkan 6 digit PIN yang telah dikirim ke email ${email}.`}
                        {step === 3 && "Buat kata sandi baru untuk akun Anda."}
                    </p>
                </div>

                {/* STEP 1: Request PIN */}
                {step === 1 && (
                    <form onSubmit={formStep1.handleSubmit(onStep1Submit)} className="flex flex-col w-full gap-6 px-6 max-w-lg">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="text-base font-semibold text-[#212121]">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Masukkan Email Kamu"
                                className="py-6 placeholder:text-[#616161]"
                                {...formStep1.register("email")}
                            />
                            {formStep1.formState.errors.email && (
                                <p className="text-sm text-red-500">{formStep1.formState.errors.email.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="bg-[#2F907F] py-6 text-base text-white" disabled={forgotPasswordMutation.isPending}>
                            {forgotPasswordMutation.isPending ? "Mengirim..." : "Kirim PIN"}
                        </Button>
                    </form>
                )}

                {/* STEP 2: Verify PIN */}
                {step === 2 && (
                    <form onSubmit={formStep2.handleSubmit(onStep2Submit)} className="flex flex-col w-full gap-6 px-6 max-w-lg">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="pin" className="text-base font-semibold text-[#212121]">
                                PIN Verifikasi (6 digit) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="pin"
                                maxLength={6}
                                placeholder="Masukkan 6 digit PIN"
                                className="py-6 placeholder:text-[#616161] tracking-widest text-center text-xl font-bold"
                                {...formStep2.register("pin")}
                            />
                            {formStep2.formState.errors.pin && (
                                <p className="text-sm text-red-500">{formStep2.formState.errors.pin.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="bg-[#2F907F] py-6 text-base text-white" disabled={verifyPinMutation.isPending}>
                            {verifyPinMutation.isPending ? "Memverifikasi..." : "Verifikasi PIN"}
                        </Button>
                    </form>
                )}

                {/* STEP 3: Reset Password */}
                {step === 3 && (
                    <form onSubmit={formStep3.handleSubmit(onStep3Submit)} className="flex flex-col w-full gap-6 px-6 max-w-lg">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="new_password" className="text-base font-semibold text-[#212121]">
                                Kata Sandi Baru <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="new_password"
                                    placeholder="Masukkan kata sandi baru"
                                    className="py-6 placeholder:text-[#616161]"
                                    {...formStep3.register("new_password")}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </Button>
                            </div>
                            {formStep3.formState.errors.new_password && (
                                <p className="text-sm text-red-500">{formStep3.formState.errors.new_password.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="confirm_password" className="text-base font-semibold text-[#212121]">
                                Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="confirm_password"
                                placeholder="Ulangi kata sandi baru"
                                className="py-6 placeholder:text-[#616161]"
                                {...formStep3.register("confirm_password")}
                            />
                            {formStep3.formState.errors.confirm_password && (
                                <p className="text-sm text-red-500">{formStep3.formState.errors.confirm_password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="bg-[#2F907F] py-6 text-base text-white" disabled={changePasswordMutation.isPending}>
                            {changePasswordMutation.isPending ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
                        </Button>
                    </form>
                )}
            </div>
            <AuthCarousel />
        </div>
    );
}
