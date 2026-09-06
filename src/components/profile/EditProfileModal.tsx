'use client';

import React, { useState, useEffect, useRef } from "react";
import { X, User, Phone, MapPin, Loader2, Save, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/types/auth";
import { 
    useUpdateProfile, 
    useUploadProfilePhoto, 
    useDeleteProfilePhoto 
} from "@/hooks/profile/useProfileMutations";
import ConfirmModal from "@/components/ui/confirm-modal";
import AvatarCropModal from "./AvatarCropModal";
import toast from "react-hot-toast";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userInfo?: UserData & { avatar?: string | null };
    onSuccess?: () => void;
}

export default function EditProfileModal({
    isOpen,
    onClose,
    userInfo,
    onSuccess,
}: EditProfileModalProps) {
    const updateProfileMutation = useUpdateProfile();
    const uploadPhotoMutation = useUploadProfilePhoto();
    const deletePhotoMutation = useDeleteProfilePhoto();

    // Form inputs state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    // Photo modification state (Pending save)
    const [pendingPhotoBlob, setPendingPhotoBlob] = useState<Blob | null>(null);
    const [pendingPhotoPreview, setPendingPhotoPreview] = useState<string | null>(null);
    const [shouldDeletePhoto, setShouldDeletePhoto] = useState(false);

    // Modal state for Crop & Confirm & Submitting
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Reset modal state when opened
    useEffect(() => {
        if (userInfo && isOpen) {
            setFirstName(userInfo.first_name || "");
            setLastName(userInfo.last_name || "");
            setPhone(userInfo.phone || "");
            setAddress(userInfo.address || "");
            setFormError(null);
            setPendingPhotoBlob(null);
            setPendingPhotoPreview(null);
            setShouldDeletePhoto(false);
            setIsConfirmOpen(false);
            setIsSubmitting(false);
            setAvatarError(false);
        }
    }, [userInfo, isOpen]);

    // Clean up preview object URL on unmount or reset
    useEffect(() => {
        return () => {
            if (pendingPhotoPreview) {
                URL.revokeObjectURL(pendingPhotoPreview);
            }
        };
    }, [pendingPhotoPreview]);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Format file harus berupa gambar.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImageSrc(reader.result as string);
            setIsCropModalOpen(true);
        };
        reader.readAsDataURL(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCropDone = (croppedBlob: Blob) => {
        if (pendingPhotoPreview) {
            URL.revokeObjectURL(pendingPhotoPreview);
        }
        const previewUrl = URL.createObjectURL(croppedBlob);
        setPendingPhotoBlob(croppedBlob);
        setPendingPhotoPreview(previewUrl);
        setShouldDeletePhoto(false);
        setAvatarError(false);
    };

    const handleMarkPhotoForDeletion = () => {
        if (pendingPhotoPreview) {
            URL.revokeObjectURL(pendingPhotoPreview);
        }
        setPendingPhotoBlob(null);
        setPendingPhotoPreview(null);
        setShouldDeletePhoto(true);
    };

    const handleOpenConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Strict phone format validation if provided
        if (phone && !/^(?:\+62|0)[2-9]\d{7,12}$/.test(phone.trim())) {
            setFormError("Nomor telepon tidak valid. Gunakan format +628... atau 08... (minimal 10 digit, tanpa angka 1 di depan +62).");
            return;
        }

        setIsConfirmOpen(true);
    };

    const executeSaveAll = async () => {
        setIsSubmitting(true);
        setIsConfirmOpen(false); // Close confirm modal immediately

        try {
            // 1. Process photo changes silently (without showing separate toast)
            if (pendingPhotoBlob) {
                await uploadPhotoMutation.mutateAsync({
                    file: pendingPhotoBlob,
                    options: { silent: true },
                });
            } else if (shouldDeletePhoto && userInfo?.avatar) {
                await deletePhotoMutation.mutateAsync({
                    options: { silent: true },
                });
            }

            // 2. Process text profile updates with single unified toast
            await updateProfileMutation.mutateAsync({
                payload: {
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    phone: phone.trim(),
                    address: address.trim(),
                },
                options: { silent: false },
            });

            if (onSuccess) await onSuccess();
            onClose();
        } catch {
            // Error toast handled in mutation
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDisplayAvatar = () => {
        if (shouldDeletePhoto) return null;
        if (pendingPhotoPreview) return pendingPhotoPreview;
        return userInfo?.avatar || null;
    };

    const getSavedInitials = () => {
        if (firstName) {
            const f = firstName.charAt(0).toUpperCase();
            const l = lastName ? lastName.charAt(0).toUpperCase() : "";
            return `${f}${l}`;
        }
        if (userInfo?.username) {
            return userInfo.username.charAt(0).toUpperCase();
        }
        return "U";
    };

    const currentAvatar = getDisplayAvatar();

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#EBF8F5] text-[#3BB49F] flex items-center justify-center font-bold">
                                <User size={18} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Edit Profil</h2>
                                <p className="text-xs text-gray-500">Perbarui foto dan informasi data diri Anda</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Modal Form Content */}
                    <form onSubmit={handleOpenConfirm} className="p-6 flex flex-col gap-5 overflow-y-auto">
                        {formError && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                                {formError}
                            </div>
                        )}

                        {/* Photo Section in Modal */}
                        <div className="flex items-center gap-4 bg-gray-50/80 border border-gray-200/80 rounded-xl p-4">
                            <div className="relative w-16 h-16 rounded-full bg-[#D8F0EC] border-2 border-[#3BB49F] overflow-hidden flex items-center justify-center shrink-0">
                                {currentAvatar && !avatarError ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={currentAvatar}
                                        alt="Avatar Preview"
                                        onError={() => setAvatarError(true)}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-[#3BB49F] font-bold text-lg select-none">
                                        {getSavedInitials()}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5 flex-1">
                                <span className="text-xs font-semibold text-gray-800">Foto Profil</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSubmitting}
                                        className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-lg text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Upload size={13} />
                                        Pilih Foto
                                    </Button>

                                    {(currentAvatar || pendingPhotoPreview) && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleMarkPhotoForDeletion}
                                            disabled={isSubmitting}
                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-lg text-xs py-1.5 px-2.5 flex items-center gap-1 cursor-pointer"
                                        >
                                            <Trash2 size={13} />
                                            Hapus
                                        </Button>
                                    )}
                                </div>
                                {pendingPhotoBlob && (
                                    <span className="text-[10px] text-amber-600 font-medium">
                                        *Foto baru akan diunggah saat disimpan
                                    </span>
                                )}
                                {shouldDeletePhoto && (
                                    <span className="text-[10px] text-red-500 font-medium">
                                        *Foto profil akan dihapus saat disimpan
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="edit_first_name" className="text-xs font-semibold text-gray-700">
                                    Nama Depan
                                </Label>
                                <Input
                                    id="edit_first_name"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Nama depan"
                                    className="rounded-lg text-sm border-gray-200 focus:ring-[#3BB49F] focus:border-[#3BB49F]"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="edit_last_name" className="text-xs font-semibold text-gray-700">
                                    Nama Belakang
                                </Label>
                                <Input
                                    id="edit_last_name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Nama belakang"
                                    className="rounded-lg text-sm border-gray-200 focus:ring-[#3BB49F] focus:border-[#3BB49F]"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit_phone" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <Phone size={12} className="text-gray-500" /> Nomor Telepon
                            </Label>
                            <Input
                                id="edit_phone"
                                type="text"
                                value={phone}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    const cleaned = raw.replace(/^1+(\+62|0)/, "$1").replace(/^1+(?=\+62)/, "");
                                    setPhone(cleaned);
                                }}
                                placeholder="Contoh: 081234567890"
                                className="rounded-lg text-sm border-gray-200 focus:ring-[#3BB49F] focus:border-[#3BB49F]"
                            />
                        </div>

                        {/* Address */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit_address" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <MapPin size={12} className="text-gray-500" /> Alamat Lengkap
                            </Label>
                            <textarea
                                id="edit_address"
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Masukkan alamat domisili Anda..."
                                className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3BB49F] focus:border-[#3BB49F]"
                            />
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="rounded-lg px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-lg px-5 py-2 flex items-center gap-2 font-semibold text-xs cursor-pointer shadow-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save size={14} />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Avatar Crop Preview Modal */}
            <AvatarCropModal
                isOpen={isCropModalOpen}
                onClose={() => setIsCropModalOpen(false)}
                imageSrc={selectedImageSrc}
                onSave={async (blob) => {
                    handleCropDone(blob);
                }}
            />

            {/* Confirmation Popup Modal before saving */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={executeSaveAll}
                isLoading={isSubmitting}
                title="Konfirmasi Perubahan Profil"
                description="Apakah Anda yakin ingin menyimpan perubahan informasi data diri Anda?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
            />
        </>
    );
}
