"use client";

import { useState } from "react";
import { DoctorSchedule } from "@/types/doctorRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Clock, Calendar, Users } from "lucide-react";

interface SchedulePickerProps {
  schedules: DoctorSchedule[];
  onChange: (schedules: DoctorSchedule[]) => void;
}

const DAYS = [
  { value: 0, label: "Minggu" },
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
];

export function SchedulePicker({ schedules, onChange }: SchedulePickerProps) {
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Monday
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("12:00");
  const [timezone, setTimezone] = useState<string>("Asia/Jakarta");
  const [bookingMode, setBookingMode] = useState<"FIXED_SLOT" | "SESSION_QUEUE">("FIXED_SLOT");
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [capacity, setCapacity] = useState<number>(1);

  const handleAddSlot = () => {
    if (!startTime || !endTime) return;
    const newSlot: DoctorSchedule = {
      day_of_week: Number(dayOfWeek),
      start_time: startTime,
      end_time: endTime,
      timezone: timezone || "Asia/Jakarta",
      booking_mode: bookingMode,
      slot_duration_minutes: Number(slotDuration),
      capacity: Number(capacity),
    };

    onChange([...schedules, newSlot]);
  };

  const handleRemoveSlot = (index: number) => {
    const updated = schedules.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-[#3BB49F]" />
          <span>Jadwal Praktik Mingguan</span>
        </Label>
        <span className="text-xs text-gray-500 font-normal">
          {schedules.length} slot Ditambahkan
        </span>
      </div>

      {/* Input Slot Baru */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Hari</Label>
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value))}
            className="w-full h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
          >
            {DAYS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Jam Mulai</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="h-9 px-2.5 text-xs bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-[#3BB49F]"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Jam Selesai</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="h-9 px-2.5 text-xs bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-[#3BB49F]"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Mode Booking</Label>
          <select
            value={bookingMode}
            onChange={(e) => setBookingMode(e.target.value as "FIXED_SLOT" | "SESSION_QUEUE")}
            className="w-full h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
          >
            <option value="FIXED_SLOT">Fixed Slot</option>
            <option value="SESSION_QUEUE">Session Queue</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Durasi (Menit)</Label>
          <Input
            type="number"
            min={5}
            max={240}
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
            className="h-9 px-2.5 text-xs bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-[#3BB49F]"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Kapasitas Pasien</Label>
          <Input
            type="number"
            min={1}
            max={500}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="h-9 px-2.5 text-xs bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-[#3BB49F]"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Zona Waktu</Label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
          >
            <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
            <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
            <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleAddSlot}
            className="w-full h-9 bg-[#3BB49F] hover:bg-[#329a88] text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Slot</span>
          </Button>
        </div>
      </div>

      {/* Daftar Slot Terpilih */}
      {schedules.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {schedules.map((slot, idx) => {
            const dayLabel = DAYS.find((d) => d.value === slot.day_of_week)?.label || `Hari ${slot.day_of_week}`;
            return (
              <div
                key={idx}
                className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-2xs"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-[#008A72] bg-[#EBF8F5] px-2.5 py-1 rounded-md border border-[#C4E9E2]">
                    {dayLabel}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {slot.start_time} - {slot.end_time}
                  </span>
                  <span className="text-gray-500 font-normal">
                    • Mode: {slot.booking_mode || "FIXED_SLOT"}
                  </span>
                  <span className="text-gray-500 font-normal">
                    • Durasi: {slot.slot_duration_minutes || 30} menit
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 font-normal">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    Max {slot.capacity || 1} Pasien
                  </span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSlot(idx)}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
