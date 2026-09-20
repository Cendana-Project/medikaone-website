"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Phone, Mail, Globe, CheckCircle2, FileText } from "lucide-react";
import { HospitalItem } from "@/hooks/hospital/useGetHospitals";

interface HospitalDetailModalProps {
  hospital: HospitalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEdit?: () => void;
}

export function HospitalDetailModal({
  hospital,
  isOpen,
  onClose,
  onOpenEdit,
}: HospitalDetailModalProps) {
  if (!hospital) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-[#008A72] to-[#3BB49F] text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/30">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">
                  {hospital.name}
                </DialogTitle>
                <div className="flex items-center gap-2 text-xs text-emerald-100 mt-1 font-mono">
                  <span>Kode: {hospital.code || "HSP-MO"}</span>
                  <span>•</span>
                  <span>ID: {hospital.id?.slice(0, 8)}...</span>
                </div>
              </div>
            </div>

            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs font-semibold px-3 py-1">
              • Active & Integrated
            </Badge>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Main Info Card */}
          <div className="bg-[#F8FAFC] border border-gray-200 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" /> Alamat Lokasi
              </span>
              <span className="font-semibold text-gray-900 leading-normal">
                {hospital.address || "Alamat belum diatur"}, {hospital.city || "Kota"}
                {hospital.province ? `, ${hospital.province}` : ""}, {hospital.country || "Indonesia"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" /> Kontak RS
              </span>
              <span className="font-semibold text-gray-900">{hospital.phone || "-"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" /> Email Resmi
              </span>
              <span className="font-semibold text-gray-900">{hospital.email || "info@medikaone.id"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-gray-400" /> Website
              </span>
              <span className="font-semibold text-gray-900">{hospital.website || "www.medikaone.id"}</span>
            </div>
          </div>

          {/* Additional Info */}
          {hospital.description && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-[#3BB49F]" /> Deskripsi Fasilitas
              </span>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-relaxed">
                {hospital.description}
              </p>
            </div>
          )}

          {/* System Status Banner */}
          <div className="p-3.5 bg-[#EBF8F5] border border-[#C4E9E2] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#008A72] font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Sistem Integrasi HIS / SIMRS</span>
            </div>
            <span className="text-gray-600 text-[11px]">Terhubung ke MedikaOne Network</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="py-2 px-6 h-10 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
          >
            Tutup
          </Button>

          {onOpenEdit && (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onOpenEdit();
              }}
              className="py-2 px-6 h-10 text-xs font-semibold bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-xl cursor-pointer shadow-xs"
            >
              Ubah Data RS
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
