"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorSchedule } from "@/types/doctorRegistration";
import { Calendar, Clock, ChevronLeft, ChevronRight, User, Stethoscope, MapPin } from "lucide-react";

interface DoctorScheduleCalendarModalProps {
  doctorName?: string;
  specialty?: string;
  roomName?: string;
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

const DEFAULT_MOCK_SCHEDULES: DoctorSchedule[] = [
  { day_of_week: 1, start_time: "08:00", end_time: "12:00", timezone: "Asia/Jakarta", booking_mode: "FIXED_SLOT", capacity: 15 },
  { day_of_week: 3, start_time: "13:00", end_time: "17:00", timezone: "Asia/Jakarta", booking_mode: "SESSION_QUEUE", capacity: 20 },
  { day_of_week: 5, start_time: "09:00", end_time: "14:00", timezone: "Asia/Jakarta", booking_mode: "FIXED_SLOT", capacity: 10 },
];

export function DoctorScheduleCalendarModal({
  doctorName = "Dokter",
  specialty = "Spesialis Kandungan",
  roomName = "Ruang Bunga I",
  schedules,
  isOpen,
  onClose,
  onOpenEditModal,
}: DoctorScheduleCalendarModalProps) {
  const activeSchedules = schedules && schedules.length > 0 ? schedules : DEFAULT_MOCK_SCHEDULES;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-8 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Calendar className="h-6 w-6 text-[#3BB49F]" />
              <span>Kalender Jadwal Praktik Dokter</span>
            </DialogTitle>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-[#3BB49F]" /> {doctorName}
              </span>
              <span className="flex items-center gap-1">
                <Stethoscope className="h-3.5 w-3.5 text-gray-400" /> {specialty}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gray-400" /> {roomName}
              </span>
            </div>
          </div>

          {onOpenEditModal && (
            <Button
              onClick={() => {
                onClose();
                onOpenEditModal();
              }}
              className="bg-[#3BB49F] hover:bg-[#329a88] text-white text-xs font-semibold h-10 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>+ Pengajuan Ubah Jadwal</span>
            </Button>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-4">
          {/* Weekly Calendar Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
            {DAYS_OF_WEEK.map((day) => {
              const daySlots = activeSchedules.filter((s) => s.day_of_week === day.index);
              return (
                <div
                  key={day.index}
                  className={`flex flex-col rounded-xl border p-3 min-h-[220px] transition-colors ${
                    daySlots.length > 0
                      ? "bg-[#F8FAFC] border-[#C4E9E2]"
                      : "bg-gray-50/50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                    <span className="font-bold text-xs text-gray-900">{day.name}</span>
                    {daySlots.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#3BB49F]" />
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
                            <Clock className="h-3 w-3" />
                            <span>
                              {slot.start_time} - {slot.end_time}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-600 font-medium">
                            {slot.booking_mode || "FIXED_SLOT"}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Max {slot.capacity || 1} Pasien
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

          {/* Schedule List Details */}
          <div className="bg-[#F8FAFC] border border-gray-200 p-4 rounded-xl flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-gray-800">
              Rincian Jam Praktik Mingguan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSchedules.map((slot, idx) => {
                const dayName = DAYS_OF_WEEK.find((d) => d.index === slot.day_of_week)?.name || `Hari ${slot.day_of_week}`;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 p-3 rounded-lg flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#008A72] bg-[#EBF8F5] px-2.5 py-1 rounded-md border border-[#C4E9E2]">
                        {dayName}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>

                    <span className="text-gray-500 font-normal text-[11px]">
                      {slot.booking_mode} ({slot.slot_duration_minutes || 30} mnt)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="py-2.5 px-6 h-11 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
            >
              Tutup Kalender
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
