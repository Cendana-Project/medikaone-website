'use client';

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PinInput } from "@/components/ui/pin-input";
import { TermsModal } from "@/components/auth/TermsModal";
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
    const [pinValue, setPinValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [hasReadTerms, setHasReadTerms] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [termsModalTab, setTermsModalTab] = useState<"terms" | "privacy">("terms");

    const forgotPasswordMutation = useForgotPassword();
    const verifyPinMutation = useVerifyPin();
    const changePasswordMutation = useChangePassword();

    const openTermsModal = (tab: "terms" | "privacy" = "terms") => {
        setTermsModalTab(tab);
        setIsTermsModalOpen(true);
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        if (!hasReadTerms) {
            e.preventDefault();
            openTermsModal("terms");
        }
    };

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

    const handlePinChange = (newPin: string) => {
        setPinValue(newPin);
        formStep2.setValue("pin", newPin, { shouldValidate: true });
    };

    const onStep1Submit = (data: Step1Data) => {
        forgotPasswordMutation.mutate(data, {
            onSuccess: (res) => {
                const cId = res?.data?.challenge_id || res?.challenge_id || "";
                setEmail(data.email);
                setChallengeId(cId);
                formStep2.setValue("email", data.email);
                setPinValue("");
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
        <div className="w-full flex flex-col items-center justify-center gap-8">
            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                defaultTab={termsModalTab}
                onAccept={() => {
                    setHasReadTerms(true);
                    setAgreedTerms(true);
                }}
            />

            {/* Back button only for Step 2 and Step 3 */}
                {step !== 1 && (
                    <div className="w-full max-w-[558px] flex justify-start">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setStep(1)}
                            className="flex items-center gap-2 text-[#2F907F] hover:text-[#236C5F] font-semibold p-0 hover:bg-transparent"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Masukkan Email Reset
                        </Button>
                    </div>
                )}

                <div className="text-center space-y-4 max-w-[488px]">
                    <h1 className="text-[36px] leading-[49px] font-bold text-[#000000]">
                        {step === 1 && "Lupa Kata Sandi"}
                        {step === 2 && "Verifikasi PIN"}
                        {step === 3 && "Kata Sandi Baru"}
                    </h1>
                    <p className="text-[16px] leading-[24px] text-[#3B3B3B]">
                        {step === 1 && "Akses informasi medis, jadwal dokter, hasil pemeriksaan, dan layanan kesehatan Anda dengan aman."}
                        {step === 2 && `Masukkan 6 digit PIN yang telah dikirim ke email ${email}.`}
                        {step === 3 && "Buat kata sandi baru untuk akun Anda."}
                    </p>
                </div>

                {/* STEP 1: Request PIN / Reset Link */}
                {step === 1 && (
                    <form onSubmit={formStep1.handleSubmit(onStep1Submit)} className="flex flex-col w-full gap-6 max-w-[558px]">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="text-[14px] leading-[20px] font-semibold text-[#212121]">
                                Email
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Masukkan Email Kamu"
                                className="h-[52px] px-5 rounded-[10px] bg-[#F9FAFB] border border-[#D0D5DD] text-[16px] placeholder:text-[#667085] focus-visible:ring-[#2F907F]"
                                {...formStep1.register("email")}
                            />
                            <p className="text-[14px] leading-[20px] text-[#212121]">
                                Silakan masukkan email terdaftar Anda untuk menerima tautan pengaturan ulang kata sandi.
                            </p>
                            {formStep1.formState.errors.email && (
                                <p className="text-sm text-red-500 mt-1">{formStep1.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <div onClick={handleCheckboxClick} className="flex items-center">
                                <Checkbox
                                    id="terms"
                                    checked={agreedTerms}
                                    onCheckedChange={(checked) => {
                                        if (hasReadTerms) {
                                            setAgreedTerms(!!checked);
                                        } else {
                                            openTermsModal("terms");
                                        }
                                    }}
                                    className="w-5 h-5 rounded-[4px] border-[#236C5F] data-[state=checked]:bg-[#2F907F] data-[state=checked]:border-[#236C5F] cursor-pointer"
                                />
                            </div>
                            <label htmlFor="terms" className="text-[14px] leading-[20px] font-normal text-[#212121]">
                                Saya setuju dengan{" "}
                                <button
                                    type="button"
                                    onClick={() => openTermsModal("terms")}
                                    className="font-semibold text-[#2F907F] hover:underline cursor-pointer"
                                >
                                    Ketentuan Layanan
                                </button>{" "}
                                dan{" "}
                                <button
                                    type="button"
                                    onClick={() => openTermsModal("privacy")}
                                    className="font-semibold text-[#2F907F] hover:underline cursor-pointer"
                                >
                                    Kebijakan Privasi
                                </button>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            disabled={forgotPasswordMutation.isPending || !agreedTerms}
                            className="h-[52px] rounded-[10px] bg-[#2F907F] hover:bg-[#236C5F] text-[16px] font-semibold text-white transition-colors cursor-pointer"
                        >
                            {forgotPasswordMutation.isPending ? "Mengirim..." : "Send Reset Link"}
                        </Button>

                        <div className="text-center text-[16px] leading-[24px] text-[#212121]">
                            Sudah punya akun?{" "}
                            <Link href="/auth/login" className="font-bold text-[#000000] hover:underline">
                                Masuk
                            </Link>
                        </div>
                    </form>
                )}

                {/* STEP 2: Verify PIN */}
                {step === 2 && (
                    <form onSubmit={formStep2.handleSubmit(onStep2Submit)} className="flex flex-col w-full gap-6 max-w-[558px]">
                        <div className="flex flex-col items-center gap-3">
                            <PinInput
                                length={6}
                                value={pinValue}
                                onChange={handlePinChange}
                                disabled={verifyPinMutation.isPending}
                                error={!!formStep2.formState.errors.pin}
                            />

                            {formStep2.formState.errors.pin && (
                                <p className="text-sm text-red-500 mt-1 self-start">{formStep2.formState.errors.pin.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={verifyPinMutation.isPending || pinValue.length < 6}
                            className="h-[52px] rounded-[10px] bg-[#2F907F] hover:bg-[#236C5F] text-[16px] font-semibold text-white transition-colors cursor-pointer"
                        >
                            {verifyPinMutation.isPending ? "Memverifikasi..." : "Verifikasi PIN"}
                        </Button>
                    </form>
                )}

                {/* STEP 3: Reset Password */}
                {step === 3 && (
                    <form onSubmit={formStep3.handleSubmit(onStep3Submit)} className="flex flex-col w-full gap-6 max-w-[558px]">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="new_password" className="text-[14px] leading-[20px] font-semibold text-[#212121]">
                                Kata Sandi Baru <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="new_password"
                                    placeholder="Masukkan kata sandi baru"
                                    className="h-[52px] pl-5 pr-12 rounded-[10px] bg-[#F9FAFB] border border-[#D0D5DD] text-[16px] placeholder:text-[#667085] focus-visible:ring-[#2F907F]"
                                    {...formStep3.register("new_password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formStep3.formState.errors.new_password && (
                                <p className="text-sm text-red-500 mt-1">{formStep3.formState.errors.new_password.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="confirm_password" className="text-[14px] leading-[20px] font-semibold text-[#212121]">
                                Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm_password"
                                    placeholder="Ulangi kata sandi baru"
                                    className="h-[52px] pl-5 pr-12 rounded-[10px] bg-[#F9FAFB] border border-[#D0D5DD] text-[16px] placeholder:text-[#667085] focus-visible:ring-[#2F907F]"
                                    {...formStep3.register("confirm_password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formStep3.formState.errors.confirm_password && (
                                <p className="text-sm text-red-500 mt-1">{formStep3.formState.errors.confirm_password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={changePasswordMutation.isPending}
                            className="h-[52px] rounded-[10px] bg-[#2F907F] hover:bg-[#236C5F] text-[16px] font-semibold text-white transition-colors cursor-pointer"
                        >
                            {changePasswordMutation.isPending ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
                        </Button>
                    </form>
                )}
        </div>
    );
}

