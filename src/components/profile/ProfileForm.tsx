'use client';

import React, { useState, useEffect } from "react";
import { Edit3, Loader2, Building, ShieldCheck, CheckCircle2, User, Phone, MapPin, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo";
import EditProfileModal from "./EditProfileModal";

export default function ProfileForm() {
    const { userInfo, loading: isUserLoading, refetch } = useGetUserInfo();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    useEffect(() => {
        setAvatarError(false);
    }, [userInfo?.avatar]);

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

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#3BB49F] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-full p-6">
            {/* Header with single Edit Profil action button */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
                    <p className="text-sm text-gray-500">
                        Kelola data diri, informasi akun, dan foto profil Anda.
                    </p>
                </div>
                <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-lg px-5 py-2.5 flex items-center gap-2 font-semibold text-xs cursor-pointer shadow-sm"
                >
                    <Edit3 size={15} />
                    Edit Profil
                </Button>
            </div>

            {/* Profile Avatar & Primary Info Card */}
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
                    <h3 className="text-xl font-bold text-gray-900">
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
                </div>
            </div>

            {/* Read-Only Profile Detail Card */}
            <div className="bg-white rounded-lg border border-black/10 p-6 flex flex-col gap-6">
                <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-base font-bold text-gray-900">
                        Informasi Data Diri
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama Depan</span>
                        <p className="text-sm font-medium text-gray-900 bg-gray-50/70 border border-gray-100 rounded-lg p-3">
                            {userInfo?.first_name || "-"}
                        </p>
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama Belakang</span>
                        <p className="text-sm font-medium text-gray-900 bg-gray-50/70 border border-gray-100 rounded-lg p-3">
                            {userInfo?.last_name || "-"}
                        </p>
                    </div>

                    {/* Username */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Username</span>
                            <span className="text-[10px] text-gray-400 lowercase font-normal flex items-center gap-1">
                                <Lock size={10} /> lock
                            </span>
                        </span>
                        <p className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            {userInfo?.username || "-"}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Email</span>
                            <span className="text-[10px] text-gray-400 lowercase font-normal flex items-center gap-1">
                                <Lock size={10} /> lock
                            </span>
                        </span>
                        <p className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            {userInfo?.email || "-"}
                        </p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nomor Telepon</span>
                        <p className="text-sm font-medium text-gray-900 bg-gray-50/70 border border-gray-100 rounded-lg p-3 flex items-center gap-2">
                            <Phone size={14} className="text-[#3BB49F]" />
                            {userInfo?.phone || "-"}
                        </p>
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Role Akun</span>
                            <span className="text-[10px] text-gray-400 lowercase font-normal flex items-center gap-1">
                                <Lock size={10} /> system
                            </span>
                        </span>
                        <p className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3">
                            {getDisplayRole()}
                        </p>
                    </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alamat Domisili</span>
                    <p className="text-sm font-medium text-gray-900 bg-gray-50/70 border border-gray-100 rounded-lg p-3 flex items-start gap-2">
                        <MapPin size={16} className="text-[#3BB49F] shrink-0 mt-0.5" />
                        <span>{userInfo?.address || "Belum ada alamat terdaftar."}</span>
                    </p>
                </div>

                {/* Hospital Assignment Info */}
                {(() => {
                    const record = (userInfo || {}) as unknown as Record<string, unknown>;
                    const hospitalsList: Array<{ id?: string; name?: string; code?: string }> = 
                        Array.isArray(userInfo?.hospitals) && userInfo.hospitals.length > 0
                            ? userInfo.hospitals
                            : Array.isArray(record.hospital_list) && record.hospital_list.length > 0
                            ? (record.hospital_list as Array<{ id?: string; name?: string; code?: string }>)
                            : record.hospital && typeof record.hospital === "object"
                            ? [record.hospital as { id?: string; name?: string; code?: string }]
                            : record.hospital_name || record.hospital_code
                            ? [{ id: record.hospital_id as string, name: record.hospital_name as string, code: record.hospital_code as string }]
                            : [];

                    const isSuperAdmin = (userInfo?.role || "").toUpperCase().replace(/[-\s]+/g, "_") === "SUPER_ADMIN";

                    return (
                        <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Building size={14} className="text-[#3BB49F]" /> Rumah Sakit Terkait:
                            </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {hospitalsList.length > 0 ? (
                                    hospitalsList.map((hsp, idx) => (
                                        <span key={hsp.id || idx} className="text-xs bg-white text-slate-800 border border-slate-200 px-3 py-1.5 rounded-md font-medium shadow-xs flex items-center gap-1.5">
                                            <span>{hsp.name || "Rumah Sakit"}</span>
                                            {hsp.code && <span className="text-slate-400 font-mono text-[11px]">({hsp.code})</span>}
                                        </span>
                                    ))
                                ) : isSuperAdmin ? (
                                    <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-md font-medium">
                                        Super Admin (Akses Seluruh Sistem)
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-500 italic bg-white border border-slate-200 px-3 py-1.5 rounded-md">
                                        Belum terdaftar di rumah sakit mana pun.
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Popup Modal Edit Profile */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userInfo={userInfo}
                onSuccess={refetch}
            />
        </div>
    );
}
