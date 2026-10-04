"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorSchedule } from "@/types/doctorRegistration";
import { Clock, Calendar, Users, Globe, CheckCircle2, AlertCircle, MapPin, User, Edit3 } from "lucide-react";

interface SlotDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: DoctorSchedule | null;
  doctorName?: string;
  specialty?: string;
  roomName?: string;
  departmentName?: string;
  onOpenEditModal?: () => void;
}

const DAYS = [
  { index: 0, name: "Minggu" },
  { index: 1, name: "Senin" },
  { index: 2, name: "Selasa" },
  { index: 3, name: "Rabu" },
  { index: 4, name: "Kamis" },
  { index: 5, name: "Jumat" },
  { index: 6, name: "Sabtu" },
];

export function SlotDetailModal({
  isOpen,
  onClose,
  slot,
  doctorName = "Dokter Spesialis",
  specialty = "-",
  roomName = "-",
  departmentName = "-",
  onOpenEditModal,
}: SlotDetailModalProps) {
  if (!slot) return null;

  const dayIndex = Array.isArray(slot.day_of_week)
    ? slot.day_of_week[0] ?? 1
    : typeof slot.day_of_week === "number"
    ? slot.day_of_week
    : 1;

  const dayObj = DAYS.find((d) => d.index === dayIndex) || { name: `Hari ${dayIndex}` };
  const isFixedSlot = slot.booking_mode === "FIXED_SLOT";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-xl md:max-w-2xl p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="p-6 bg-linear-to-r from-[#008A72] to-[#3BB49F] text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-emerald-100" />
              </div>
              <div>
                <DialogTitle className="text-lg md:text-xl font-bold text-white tracking-tight">
                  Detail Slot Jadwal Praktik
                </DialogTitle>
                <p className="text-emerald-100 text-xs mt-0.5 font-normal">
                  Rincian durasi, kapasitas, dan status slot jam kerja dokter
                </p>
              </div>
            </div>

            <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs px-3 py-1 font-semibold backdrop-blur-xs">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-200" />
              {slot.status || "AKTIF"}
            </Badge>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Dokter & Lokasi Bar */}
          <div className="p-3.5 bg-[#F8FAFC] border border-gray-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 text-[#008A72] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Dokter</span>
                <span className="font-bold text-gray-900">{doctorName} ({specialty})</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-[#008A72] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Poli / Ruangan</span>
                <span className="font-bold text-gray-900">{departmentName} - {roomName}</span>
              </div>
            </div>
          </div>

          {/* Rincian Grid 2 Col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hari & Jam */}
            <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#008A72]" /> Hari & Tanggal
              </span>
              <span className="text-base font-bold text-gray-900">
                {slot.schedule_date ? slot.schedule_date : dayObj.name}
              </span>
              <span className="text-xs font-semibold text-[#008A72] bg-[#EBF8F5] px-2.5 py-1 rounded-md border border-[#C4E9E2] w-fit">
                {slot.start_time} - {slot.end_time}
              </span>
            </div>

            {/* Mode Booking */}
            <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#008A72]" /> Mode Layanan
              </span>
              <span className="text-sm font-bold text-gray-900">
                {isFixedSlot ? "FIXED SLOT (Per Pasien)" : "SESSION QUEUE (Antrean Sesi)"}
              </span>
              <span className="text-xs text-gray-600 font-medium">
                {isFixedSlot
                  ? `Durasi: ${slot.slot_duration_minutes || 30} Menit / Pasien`
                  : `Kapasitas: ${slot.capacity || 20} Pasien / Sesi`}
              </span>
            </div>

            {/* Zona Waktu */}
            <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#008A72]" /> Zona Waktu
              </span>
              <span className="text-sm font-bold text-gray-900">
                {slot.timezone || "Asia/Jakarta"}
              </span>
            </div>

            {/* Status Penugasan */}
            <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col gap-1.5 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-[#008A72]" /> Status Operasional
              </span>
              <span className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-[#3BB49F]" /> Terhubung ke SIMRS / HIS
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="py-2.5 px-6 h-10 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
          >
            Tutup
          </Button>

          {onOpenEditModal && (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onOpenEditModal();
              }}
              className="py-2.5 px-6 h-10 text-xs font-semibold bg-[#008A72] hover:bg-[#007661] text-white rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Ajukan Perubahan Jadwal</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
