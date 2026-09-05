'use client';

import React, { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Lock, Save, Loader2, Building, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo";
import { updateProfile, uploadProfilePhoto, deleteProfilePhoto } from "@/services/ProfileService";
import { handleApiError } from "@/lib/handleError";
import { queryClient } from "@/lib/queryClient";
import toast from "react-hot-toast";
import AvatarCropModal from "./AvatarCropModal";
import ConfirmModal from "@/components/ui/confirm-modal";

export default function ProfileForm() {
    const { userInfo, loading: isUserLoading, refetch } = useGetUserInfo();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);

    // Modal state for crop preview & confirmation
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
    const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
    const [isConfirmDeletePhotoOpen, setIsConfirmDeletePhotoOpen] = useState(false);

    const [avatarError, setAvatarError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setAvatarError(false);
    }, [userInfo?.avatar]);

    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (userInfo && !isInitializedRef.current) {
            setFirstName(userInfo.first_name || "");
            setLastName(userInfo.last_name || "");
            setUsername(userInfo.username || "");
            setEmail(userInfo.email || "");
            setPhone(userInfo.phone || "");
            setAddress(userInfo.address || "");
            isInitializedRef.current = true;
        }
    }, [userInfo]);

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

        // Reset file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSaveCroppedPhoto = async (croppedBlob: Blob) => {
        try {
            const result = await uploadProfilePhoto(croppedBlob);
            const successMsg = 
                result?.message_detail?.desc_idn || 
                result?.message_detail?.title_idn || 
                "Foto profil berhasil diperbarui.";
            
            toast.success(successMsg);
            await queryClient.invalidateQueries({ queryKey: ["profilePhoto"] });
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            await refetch();
        } catch (error) {
            handleApiError(error, "Gagal Mengunggah Foto Profil");
        }
    };

    const executeDeletePhoto = async () => {
        setIsDeletingPhoto(true);
        try {
            const result = await deleteProfilePhoto();
            const successMsg = 
                result?.message_detail?.desc_idn || 
                result?.message_detail?.title_idn || 
                "Foto profil berhasil dihapus.";
                
            toast.success(successMsg);
            await queryClient.invalidateQueries({ queryKey: ["profilePhoto"] });
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            await refetch();
            setIsConfirmDeletePhotoOpen(false);
        } catch (error) {
            handleApiError(error, "Gagal Menghapus Foto Profil");
        } finally {
            setIsDeletingPhoto(false);
        }
    };

    const handleOpenSaveConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmSaveOpen(true);
    };

    const executeSaveProfile = async () => {
        setIsSaving(true);
        try {
            const result = await updateProfile({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                address: address,
            });

            const successMsg = 
                result?.message_detail?.desc_idn || 
                result?.message_detail?.title_idn || 
                "Profil Anda berhasil diperbarui.";

            toast.success(successMsg);
            isInitializedRef.current = false;
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            await refetch();
            setIsConfirmSaveOpen(false);
        } catch (error) {
            handleApiError(error, "Gagal Memperbarui Profil");
        } finally {
            setIsSaving(false);
        }
    };

    const getSavedDisplayName = () => {
        if (!userInfo) return "Pengguna";
        if (userInfo.first_name || userInfo.last_name) {
            return `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim();
        }
        return userInfo.username || userInfo.email || "Pengguna";
    };

    const getSavedInitials = () => {
        if (userInfo?.first_name) {
            const f = userInfo.first_name.charAt(0).toUpperCase();
            const l = userInfo.last_name ? userInfo.last_name.charAt(0).toUpperCase() : "";
            return `${f}${l}`;
        }
        if (userInfo?.username) {
            return userInfo.username.charAt(0).toUpperCase();
        }
        return "U";
    };

    const getDisplayRole = () => {
        const rawRole = userInfo?.role || "ADMIN";
        return rawRole
            .replace(/[_-\s]+/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const hasFormChanges = Boolean(
        userInfo && (
            firstName !== (userInfo.first_name || "") ||
            lastName !== (userInfo.last_name || "") ||
            phone !== (userInfo.phone || "") ||
            address !== (userInfo.address || "")
        )
    );

    const handleResetForm = () => {
        if (userInfo) {
            setFirstName(userInfo.first_name || "");
            setLastName(userInfo.last_name || "");
            setPhone(userInfo.phone || "");
            setAddress(userInfo.address || "");
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#3BB49F] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-full p-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
                <p className="text-sm text-gray-500">
                    Kelola data diri, informasi akun, dan foto profil Anda.
                </p>
            </div>

            {/* Profile Avatar Card */}
            <div className="bg-white rounded-lg border border-black/10 p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-24 h-24 rounded-full bg-[#D8F0EC] border-2 border-[#3BB49F] overflow-hidden flex items-center justify-center shrink-0">
                    {userInfo?.avatar && !avatarError ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={userInfo.avatar}
                            alt="User Avatar"
                            onError={() => setAvatarError(true)}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-[#3BB49F] font-bold text-2xl select-none">
                            {getSavedInitials()}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                        {getSavedDisplayName()}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF8F5] text-[#3BB49F] border border-[#c5eee6]">
                            <ShieldCheck size={14} />
                            {getDisplayRole()}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 size={12} /> Status: {userInfo?.status || "Active"}
                        </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
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
                            className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-lg text-xs py-2 px-4 flex items-center gap-2 cursor-pointer"
                        >
                            <Upload size={14} />
                            Ubah Foto Profil
                        </Button>

                        {userInfo?.avatar && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsConfirmDeletePhotoOpen(true)}
                                disabled={isDeletingPhoto}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-lg text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                            >
                                {isDeletingPhoto ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Trash2 size={14} />
                                )}
                                Hapus Foto
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Form Card */}
            <form onSubmit={handleOpenSaveConfirm} className="bg-white rounded-lg border border-black/10 p-6 flex flex-col gap-6">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                    Informasi Data Diri
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="first_name" className="text-xs font-semibold text-gray-700">
                            Nama Depan
                        </Label>
                        <Input
                            id="first_name"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Masukkan nama depan"
                            className="rounded-lg border-gray-200 text-sm focus:ring-[#3BB49F] focus:border-[#3BB49F]"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="last_name" className="text-xs font-semibold text-gray-700">
                            Nama Belakang
                        </Label>
                        <Input
                            id="last_name"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Masukkan nama belakang"
                            className="rounded-lg border-gray-200 text-sm focus:ring-[#3BB49F] focus:border-[#3BB49F]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Username (Read Only) */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username" className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                            <span>Username</span>
                            <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1">
                                <Lock size={10} /> Tidak dapat diubah
                            </span>
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            disabled
                            className="rounded-lg border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
                        />
                    </div>

                    {/* Email (Read Only) */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                            <span>Email</span>
                            <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1">
                                <Lock size={10} /> Tidak dapat diubah
                            </span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            disabled
                            className="rounded-lg border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                            Nomor Telepon
                        </Label>
                        <Input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Contoh: 081234567890"
                            className="rounded-lg border-gray-200 text-sm focus:ring-[#3BB49F] focus:border-[#3BB49F]"
                        />
                    </div>

                    {/* Role Read-Only */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="role_display" className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                            <span>Role Akun</span>
                            <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1">
                                <Lock size={10} /> Diberikan System
                            </span>
                        </Label>
                        <Input
                            id="role_display"
                            type="text"
                            value={getDisplayRole()}
                            disabled
                            className="rounded-lg border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="address" className="text-xs font-semibold text-gray-700">
                        Alamat Alamat Lengkap
                    </Label>
                    <textarea
                        id="address"
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Masukkan alamat domisili lengkap..."
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3BB49F] focus:border-[#3BB49F]"
                    />
                </div>

                {/* Hospital Assignment Info */}
                {userInfo?.hospitals && userInfo.hospitals.length > 0 && (
                    <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Building size={14} className="text-[#3BB49F]" /> Rumah Sakit Terkait:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {userInfo.hospitals.map((hsp) => (
                                <span key={hsp.id} className="text-xs bg-white text-slate-800 border border-slate-200 px-3 py-1 rounded-md font-medium shadow-xs">
                                    {hsp.name} <span className="text-slate-400">({hsp.code})</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit button (Only visible when form has unsaved changes) */}
                {hasFormChanges && (
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 transition-all duration-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResetForm}
                            disabled={isSaving}
                            className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-lg px-6 py-2.5 flex items-center gap-2 font-semibold text-sm font-sans cursor-pointer shadow-sm"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </form>

            {/* Avatar Crop Preview Modal */}
            <AvatarCropModal
                isOpen={isCropModalOpen}
                onClose={() => setIsCropModalOpen(false)}
                imageSrc={selectedImageSrc}
                onSave={handleSaveCroppedPhoto}
            />

            {/* Confirm Save Profile Modal */}
            <ConfirmModal
                isOpen={isConfirmSaveOpen}
                onClose={() => setIsConfirmSaveOpen(false)}
                onConfirm={executeSaveProfile}
                isLoading={isSaving}
                title="Konfirmasi Perubahan Profil"
                description="Apakah Anda yakin ingin menyimpan perubahan informasi data diri Anda?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
            />

            {/* Confirm Delete Photo Modal */}
            <ConfirmModal
                isOpen={isConfirmDeletePhotoOpen}
                onClose={() => setIsConfirmDeletePhotoOpen(false)}
                onConfirm={executeDeletePhoto}
                isLoading={isDeletingPhoto}
                title="Konfirmasi Hapus Foto Profil"
                description="Apakah Anda yakin ingin menghapus foto profil Anda? Tindakan ini akan menghapus foto dari akun secara permanen."
                confirmText="Ya, Hapus Foto"
                cancelText="Batal"
                variant="destructive"
            />
        </div>
    );
}
