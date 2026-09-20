"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorSchedule } from "@/types/doctorRegistration";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  FileText,
  CheckCircle2,
  Building2,
} from "lucide-react";

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

export default function DoctorSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = (params?.id as string) || "doc-1";

  const [viewMode, setViewMode] = useState<"24h-grid" | "cards">("24h-grid");

  // In production, fetch doctor detail by doctorId
  const doctorData = {
    doctorName: doctorId === "doc-2" ? "Phoenix Baker" : doctorId === "doc-3" ? "Lana Steiner" : "Olivia Rhye",
    specialty: doctorId === "doc-3" ? "Spesialis Penyakit Dalam" : "Spesialis Kandungan",
    sipNumber: doctorId === "doc-2" ? "SIP-3174-2026-002" : doctorId === "doc-3" ? "SIP-3174-2026-003" : "SIP-3174-2026-001",
    departmentName: doctorId === "doc-3" ? "Poli Penyakit Dalam" : "Poli Kandungan",
    roomName: doctorId === "doc-2" ? "Ruang Bunga II" : doctorId === "doc-3" ? "Ruang Anggrek I" : "Ruang Bunga I",
    schedules: DEFAULT_MOCK_SCHEDULES,
  };

  const parseHourInt = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":");
    return parseInt(parts[0], 10) || 0;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/doctors")}
          className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-white bg-white/80 rounded-xl cursor-pointer text-xs font-semibold h-10 px-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Kelola Dokter</span>
        </Button>

        <Button
          onClick={() => router.push("/doctors/schedule-changes")}
          className="bg-[#008A72] hover:bg-[#007661] text-white text-xs font-semibold h-10 px-5 rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <Clock className="h-4 w-4" />
          <span>Pengajuan Ubah Jadwal</span>
        </Button>
      </div>

      {/* Main Banner Profile Card */}
      <div className="p-6 md:p-8 bg-linear-to-r from-[#008A72] to-[#3BB49F] rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/30 shadow-md">
              <User className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  {doctorData.doctorName}
                </h1>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs font-semibold px-3 py-1">
                  • Aktif
                </Badge>
              </div>
              <p className="text-emerald-100 text-xs md:text-sm mt-1 flex items-center gap-2">
                <span>{doctorData.specialty}</span>
                <span>•</span>
                <span className="font-mono">ID: {doctorId}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-xs shrink-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-emerald-100 text-[10px] uppercase font-semibold">SIP Dokter</span>
              <span className="font-mono font-bold text-white flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-emerald-200 shrink-0" />
                {doctorData.sipNumber}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-emerald-100 text-[10px] uppercase font-semibold">Departemen</span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-200 shrink-0" />
                {doctorData.departmentName}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 col-span-2 sm:col-span-1">
              <span className="text-emerald-100 text-[10px] uppercase font-semibold">Ruangan</span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-200 shrink-0" />
                {doctorData.roomName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Navigation & Mode Toggle Bar */}
        <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#3BB49F]" />
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Jadwal Praktik Dokter (24 Jam)
              </h2>
              <p className="text-xs text-gray-500">
                Slot waktu praktik aktif dokter per minggu dari pukul 00:00 hingga 24:00
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 text-xs self-start sm:self-auto">
            <button
              onClick={() => setViewMode("24h-grid")}
              className={`px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                viewMode === "24h-grid"
                  ? "bg-[#3BB49F] text-white shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              24h Calendar Grid
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                viewMode === "cards"
                  ? "bg-[#3BB49F] text-white shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Ringkasan Hari
            </button>
          </div>
        </div>

        {/* View Content */}
        <div className="p-6">
          {viewMode === "24h-grid" ? (
            <div className="border border-gray-200 rounded-xl overflow-x-auto bg-white shadow-2xs">
              <table className="w-full min-w-[700px] border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-gray-200 text-gray-700">
                    <th className="w-20 py-3 px-3 border-r border-gray-200 text-center font-bold">
                      Jam
                    </th>
                    {DAYS_OF_WEEK.map((day) => (
                      <th
                        key={day.index}
                        className="py-3 px-3 border-r border-gray-200 last:border-r-0 text-center font-bold"
                      >
                        {day.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {HOURS_24.map((hourStr, hourIdx) => {
                    const currentHourInt = parseHourInt(hourStr);

                    return (
                      <tr
                        key={hourStr}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Hour Column */}
                        <td className="py-2 px-2 border-r border-gray-200 text-center font-mono text-gray-500 font-medium bg-[#F8FAFC]/50 select-none">
                          {hourStr}
                        </td>

                        {/* Day Columns */}
                        {DAYS_OF_WEEK.map((day) => {
                          const matchingSlots = doctorData.schedules.filter((slot) => {
                            if (slot.day_of_week !== day.index) return false;
                            const startH = parseHourInt(slot.start_time);
                            const endH = parseHourInt(slot.end_time);
                            return currentHourInt >= startH && currentHourInt < endH;
                          });

                          return (
                            <td
                              key={day.index}
                              className="p-1 border-r border-gray-100 last:border-r-0 h-11 align-top relative"
                            >
                              {matchingSlots.map((slot, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="w-full h-full bg-[#EBF8F5] border border-[#3BB49F] rounded-lg p-2 flex flex-col justify-between shadow-2xs transition-all hover:shadow-xs"
                                >
                                  <div className="flex items-center justify-between text-[#008A72] font-bold text-[11px]">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {slot.start_time} - {slot.end_time}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-[10px] text-gray-600 mt-1 font-medium">
                                    <span className="bg-white/80 px-1.5 py-0.5 rounded border border-[#C4E9E2]">
                                      {slot.booking_mode || "FIXED_SLOT"}
                                    </span>
                                    <span>Max {slot.capacity || 1} Pasien</span>
                                  </div>
                                </div>
                              ))}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DAYS_OF_WEEK.map((day) => {
                const daySlots = doctorData.schedules.filter((s) => s.day_of_week === day.index);
                return (
                  <div
                    key={day.index}
                    className="border border-gray-200 p-4 rounded-xl bg-white shadow-2xs flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-900 text-sm">{day.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          daySlots.length > 0
                            ? "bg-[#EBF8F5] text-[#008A72] border-[#C4E9E2]"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }
                      >
                        {daySlots.length} Slot
                      </Badge>
                    </div>

                    {daySlots.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {daySlots.map((slot, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 bg-[#F8FAFC] border border-gray-200 rounded-lg flex flex-col gap-1 text-xs"
                          >
                            <div className="flex items-center justify-between text-gray-900 font-semibold">
                              <span className="flex items-center gap-1 text-[#008A72]">
                                <Clock className="h-3.5 w-3.5" />
                                {slot.start_time} - {slot.end_time}
                              </span>
                              <span className="text-[11px] font-mono text-gray-500">
                                {slot.timezone || "Asia/Jakarta"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-gray-600 mt-1">
                              <span>Mode: {slot.booking_mode || "FIXED_SLOT"}</span>
                              <span>Kapasitas: {slot.capacity} Pasien</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-gray-400 text-xs italic">
                        Tidak ada jadwal praktik
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 p-4 bg-[#EBF8F5] border border-[#C4E9E2] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#008A72] font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Semua slot waktu disinkronkan secara otomatis ke HIS / SIMRS</span>
            </div>
            <span className="text-gray-500 font-mono text-[11px]">MedikaOne Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}
