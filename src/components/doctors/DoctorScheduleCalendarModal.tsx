"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorSchedule } from "@/types/doctorRegistration";
import { Calendar, Clock, User, Stethoscope, MapPin, FileText, CheckCircle2 } from "lucide-react";

interface DoctorScheduleCalendarModalProps {
  doctorName?: string;
  specialty?: string;
  roomName?: string;
  departmentName?: string;
  sipNumber?: string;
  email?: string;
  schedules?: DoctorSchedule[];
  isOpen: boolean;
  onClose: () => void;
  onOpenEditModal?: () => void;
}

const DAYS_OF_WEEK = [
  { index: 1, name: "Senin", short: "Sen" },
  { index: 2, name: "Selasa", short: "Sel" },
  { index: 3, name: "Rabu", short: "Rab" },
  { index: 4, name: "Kamis", short: "Kam" },
  { index: 5, name: "Jumat", short: "Jum" },
  { index: 6, name: "Sabtu", short: "Sab" },
  { index: 0, name: "Minggu", short: "Min" },
];

const HOURS_24 = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

const DEFAULT_MOCK_SCHEDULES: DoctorSchedule[] = [
  { day_of_week: 1, start_time: "08:00", end_time: "12:00", timezone: "Asia/Jakarta", booking_mode: "FIXED_SLOT", capacity: 15 },
  { day_of_week: 3, start_time: "13:00", end_time: "17:00", timezone: "Asia/Jakarta", booking_mode: "SESSION_QUEUE", capacity: 20 },
  { day_of_week: 5, start_time: "09:00", end_time: "14:00", timezone: "Asia/Jakarta", booking_mode: "FIXED_SLOT", capacity: 10 },
];

export function DoctorScheduleCalendarModal({
  doctorName = "Dokter",
  specialty = "Spesialis Kandungan",
  roomName = "Ruang Bunga I",
  departmentName = "Poli Kandungan",
  sipNumber = "SIP-3174-2026-001",
  schedules,
  isOpen,
  onClose,
  onOpenEditModal,
}: DoctorScheduleCalendarModalProps) {
  const [viewMode, setViewMode] = useState<"24h-grid" | "cards">("24h-grid");
  const activeSchedules = schedules && schedules.length > 0 ? schedules : DEFAULT_MOCK_SCHEDULES;

  const parseHourInt = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":");
    return parseInt(parts[0], 10) || 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Section */}
        <div className="p-6 bg-linear-to-r from-[#008A72] to-[#3BB49F] text-white shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-emerald-200" />
                <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Informasi & Kalender Jadwal Praktik Dokter
                </DialogTitle>
              </div>
              <p className="text-emerald-100 text-xs md:text-sm mt-1">
                Jadwal praktik mingguan 24 Jam (00:00 - 24:00) yang terdaftar di MedikaOne
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenEditModal && (
                <Button
                  onClick={() => {
                    onClose();
                    onOpenEditModal();
                  }}
                  className="bg-white hover:bg-emerald-50 text-[#008A72] text-xs font-bold h-10 px-4 rounded-xl shadow-xs cursor-pointer border border-emerald-100"
                >
                  + Pengajuan Ubah Jadwal
                </Button>
              )}
            </div>
          </div>

          {/* Doctor Info Card */}
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-emerald-100 text-[10px] uppercase font-semibold">Nama Dokter</span>
              <span className="font-bold text-white flex items-center gap-1.5 text-sm">
                <User className="h-4 w-4 text-emerald-200 shrink-0" />
                {doctorName}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-emerald-100 text-[10px] uppercase font-semibold">Spesialisasi</span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-emerald-200 shrink-0" />
                {specialty}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-emerald-100 text-[10px] uppercase font-semibold">SIP Dokter</span>
              <span className="font-mono text-white flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-emerald-200 shrink-0" />
                {sipNumber}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-emerald-100 text-[10px] uppercase font-semibold">Ruangan & Dept</span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-200 shrink-0" />
                {departmentName} ({roomName})
              </span>
            </div>
          </div>
        </div>

        {/* Navigation & Mode Toggle */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#EBF8F5] text-[#008A72] border-[#C4E9E2] text-xs font-semibold px-2.5 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-[#3BB49F]" /> 24 Jam Google-Calendar View
            </Badge>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 text-xs">
            <button
              onClick={() => setViewMode("24h-grid")}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                viewMode === "24h-grid"
                  ? "bg-[#3BB49F] text-white shadow-2xs font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              24h Calendar Grid
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                viewMode === "cards"
                  ? "bg-[#3BB49F] text-white shadow-2xs font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Ringkasan Hari
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "24h-grid" ? (
            /* 24 Hours Weekly Timeline View */
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              {/* Header Days of Week */}
              <div className="grid grid-cols-8 bg-gray-100 border-b border-gray-200 sticky top-0 z-10 font-bold text-xs text-gray-700">
                <div className="p-2.5 text-center border-r border-gray-200 text-gray-500 font-mono">
                  Jam / Waktu
                </div>
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.index} className="p-2.5 text-center border-r border-gray-200 last:border-r-0">
                    <span className="block text-gray-900">{day.name}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-normal">{day.short}</span>
                  </div>
                ))}
              </div>

              {/* 24 Hour Rows */}
              <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
                {HOURS_24.map((hourLabel, hIdx) => {
                  const hourInt = hIdx;
                  return (
                    <div key={hourLabel} className="grid grid-cols-8 min-h-[44px]">
                      {/* Time Column */}
                      <div className="p-2 text-center text-xs text-gray-400 font-mono border-r border-gray-100 bg-gray-50/50 flex items-center justify-center font-medium">
                        {hourLabel}
                      </div>

                      {/* Days Slots */}
                      {DAYS_OF_WEEK.map((day) => {
                        const matchingSlots = activeSchedules.filter((s) => {
                          if (s.day_of_week !== day.index) return false;
                          const startH = parseHourInt(s.start_time);
                          const endH = parseHourInt(s.end_time);
                          return hourInt >= startH && hourInt < endH;
                        });

                        return (
                          <div
                            key={day.index}
                            className="p-1 border-r border-gray-100 last:border-r-0 relative hover:bg-gray-50/40 transition-colors"
                          >
                            {matchingSlots.map((slot, sIdx) => {
                              const startH = parseHourInt(slot.start_time);
                              const isFirstHour = hourInt === startH;

                              return (
                                <div
                                  key={sIdx}
                                  className={`w-full h-full rounded-md p-1.5 flex flex-col justify-center ${
                                    isFirstHour
                                      ? "bg-[#008A72] text-white shadow-2xs font-bold"
                                      : "bg-[#EBF8F5] text-[#008A72] border border-[#C4E9E2]"
                                  }`}
                                >
                                  {isFirstHour && (
                                    <div className="flex flex-col">
                                      <span className="text-[11px] leading-tight font-extrabold flex items-center gap-1">
                                        <Clock className="h-3 w-3 shrink-0" />
                                        {slot.start_time} - {slot.end_time}
                                      </span>
                                      <span className="text-[9px] opacity-90 font-medium">
                                        {slot.booking_mode || "FIXED_SLOT"} ({slot.capacity || 1} Px)
                                      </span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Card Grid Summary View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
              {DAYS_OF_WEEK.map((day) => {
                const daySlots = activeSchedules.filter((s) => s.day_of_week === day.index);
                return (
                  <div
                    key={day.index}
                    className={`flex flex-col rounded-xl border p-3.5 min-h-[200px] transition-colors ${
                      daySlots.length > 0
                        ? "bg-[#F8FAFC] border-[#C4E9E2]"
                        : "bg-gray-50/50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                      <span className="font-bold text-xs text-gray-900">{day.name}</span>
                      {daySlots.length > 0 && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3BB49F]" />
                      )}
                    </div>

                    {daySlots.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {daySlots.map((slot, idx) => (
                          <div
                            key={idx}
                            className="bg-[#EBF8F5] border border-[#C4E9E2] p-2.5 rounded-lg flex flex-col gap-1 shadow-2xs"
                          >
                            <div className="flex items-center gap-1 font-bold text-xs text-[#008A72]">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span>
                                {slot.start_time} - {slot.end_time}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-600 font-medium">
                              {slot.booking_mode || "FIXED_SLOT"}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              Kapasitas: {slot.capacity || 1} Pasien
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-[11px] text-gray-400 italic">
                        Tidak ada jadwal
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Schedule Detail Breakdown Footer */}
          <div className="mt-6 bg-[#F8FAFC] border border-gray-200 p-4 rounded-xl flex flex-col gap-3">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#3BB49F]" />
              Daftar Ringkasan Slot Praktik Dokter
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeSchedules.map((slot, idx) => {
                const dayName = DAYS_OF_WEEK.find((d) => d.index === slot.day_of_week)?.name || `Hari ${slot.day_of_week}`;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 p-3 rounded-xl flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#008A72] bg-[#EBF8F5] px-2.5 py-1 rounded-md border border-[#C4E9E2]">
                        {dayName}
                      </span>
                      <span className="font-bold text-gray-900">
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>

                    <span className="text-gray-500 font-medium text-[11px] bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                      {slot.booking_mode || "FIXED_SLOT"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="py-2 px-6 h-10 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
          >
            Tutup Kalender
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
