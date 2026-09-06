'use client';

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    defaultTab?: "terms" | "privacy";
}

export function TermsModal({
    isOpen,
    onClose,
    onAccept,
    defaultTab = "terms",
}: TermsModalProps) {
    const [activeTab, setActiveTab] = useState<"terms" | "privacy">(defaultTab);

    React.useEffect(() => {
        if (isOpen) {
            setActiveTab(defaultTab);
        }
    }, [isOpen, defaultTab]);

    const handleAgree = () => {
        onAccept();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 sm:p-7 max-h-[88vh] flex flex-col gap-0 shadow-xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <DialogHeader className="pb-4 border-b border-slate-100 text-left space-y-3">
                    <div>
                        <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                            Syarat Ketentuan & Kebijakan Privasi
                        </DialogTitle>
                        <p className="text-xs text-slate-500 mt-1 leading-normal">
                            Pahami aturan penggunaan layanan dan komitmen perlindungan data medis di MedikaOne.
                        </p>
                    </div>

                    {/* Segmented Control */}
                    <div className="flex items-center bg-slate-100/80 p-1 rounded-xl gap-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab("terms")}
                            className={`flex-1 flex items-center justify-center py-2 px-3 text-xs sm:text-sm rounded-lg transition-all cursor-pointer ${
                                activeTab === "terms"
                                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold"
                                    : "text-slate-500 hover:text-slate-800 font-medium"
                            }`}
                        >
                            Ketentuan Layanan
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("privacy")}
                            className={`flex-1 flex items-center justify-center py-2 px-3 text-xs sm:text-sm rounded-lg transition-all cursor-pointer ${
                                activeTab === "privacy"
                                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold"
                                    : "text-slate-500 hover:text-slate-800 font-medium"
                            }`}
                        >
                            Kebijakan Privasi
                        </button>
                    </div>
                </DialogHeader>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[46vh] pr-2 scrollbar-thin">
                    {activeTab === "terms" ? (
                        <div className="space-y-4">
                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                <div className="flex items-center font-bold text-slate-900 text-sm">
                                    <span className="w-5 h-5 rounded bg-[#2F907F]/10 text-[#2F907F] text-xs flex items-center justify-center font-bold mr-2">01</span>
                                    Penggunaan Sistem Resmi
                                </div>
                                <p className="text-slate-600 pl-7 text-xs">
                                    Layanan ini disediakan khusus untuk operasional rumah sakit, tenaga medis, dan pasien terdaftar. Setiap aktivitas medis dan administratif wajib dilaksanakan sesuai etika profesi serta hukum berlaku.
                                </p>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                <div className="flex items-center font-bold text-slate-900 text-sm">
                                    <span className="w-5 h-5 rounded bg-[#2F907F]/10 text-[#2F907F] text-xs flex items-center justify-center font-bold mr-2">02</span>
                                    Kerahasiaan Rekam Medis
                                </div>
                                <p className="text-slate-600 pl-7 text-xs">
                                    Seluruh data medis pasien bersifat rahasia dan dilindungi oleh Undang-Undang Kesehatan serta Permenkes tentang Rekam Medis. Pengunggahan atau pengunduhan tanpa otorisasi dilarang keras.
                                </p>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                <div className="flex items-center font-bold text-slate-900 text-sm">
                                    <span className="w-5 h-5 rounded bg-[#2F907F]/10 text-[#2F907F] text-xs flex items-center justify-center font-bold mr-2">03</span>
                                    Tanggung Jawab Akun & Akses
                                </div>
                                <p className="text-slate-600 pl-7 text-xs">
                                    Pengguna wajib menjaga kerahasiaan username, kata sandi, dan kode PIN. Tindakan yang dilakukan melalui kredensial Anda sepenuhnya menjadi tanggung jawab pemilik akun terdaftar.
                                </p>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                <div className="flex items-center font-bold text-slate-900 text-sm">
                                    <span className="w-5 h-5 rounded bg-[#2F907F]/10 text-[#2F907F] text-xs flex items-center justify-center font-bold mr-2">04</span>
                                    Otorisasi Pembatasan Akses
                                </div>
                                <p className="text-slate-600 pl-7 text-xs">
                                    MedikaOne berhak menonaktifkan atau membatasi hak akses akun yang terdeteksi melakukan aktivitas mencurigakan atau pelanggaran prosedur keamanan sistem.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                <div className="flex items-center font-bold text-slate-900 text-sm">
                                    <span className="w-5 h-5 rounded bg-[#2F907F]/10 text-[#2F907F] text-xs flex items-center justify-center font-bold mr-2">01</span>
                                    Pengumpulan Identitas & Data Pribadi
                                </div>
                                <p className="text-slate-600 pl-7 text-xs">
                                    Kami mengumpulkan nama, alamat email, nomor telepon, dan identitas rumah sakit semata-mata untuk verifikasi autentikasi pengguna dan pemrosesan layanan kesehatan.
                                </p>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                <div className="flex items-center font-bold text-slate-900 text-sm">
                                    <span className="w-5 h-5 rounded bg-[#2F907F]/10 text-[#2F907F] text-xs flex items-center justify-center font-bold mr-2">02</span>
                                    Standar Enkripsi Medis
                                </div>
                                <p className="text-slate-600 pl-7 text-xs">
                                    Seluruh lalu lintas data dienkripsi dengan enkripsi TLS 1.3/AES-256. Sistem kami dirancang untuk mematuhi regulasi perlindungan data pribadi.
                                </p>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                <div className="flex items-center font-bold text-slate-900 text-sm">
                                    <span className="w-5 h-5 rounded bg-[#2F907F]/10 text-[#2F907F] text-xs flex items-center justify-center font-bold mr-2">03</span>
                                    Tanpa Penjualan Data Pihak Ketiga
                                </div>
                                <p className="text-slate-600 pl-7 text-xs">
                                    Data pribadi dan informasi kesehatan Anda tidak akan pernah dijual, disewakan, atau dibagikan ke pihak ketiga tanpa persetujuan eksplisit atau kewajiban hukum resmi.
                                </p>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                <div className="flex items-center font-bold text-slate-900 text-sm">
                                    <span className="w-5 h-5 rounded bg-[#2F907F]/10 text-[#2F907F] text-xs flex items-center justify-center font-bold mr-2">04</span>
                                    Hak Pengelolaan Profil & Data
                                </div>
                                <p className="text-slate-600 pl-7 text-xs">
                                    Anda dapat memperbarui informasi pribadi melalui halaman profil atau meminta bantuan administrator sistem untuk penghapusan akun.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer text-xs font-semibold px-4"
                    >
                        Tutup
                    </Button>
                    <Button
                        type="button"
                        onClick={handleAgree}
                        className="bg-[#2F907F] hover:bg-[#267869] text-white rounded-xl px-5 font-semibold text-xs shadow-sm cursor-pointer"
                    >
                        Setuju & Lanjutkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
