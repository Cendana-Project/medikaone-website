"use client";

import { useState } from "react";
import { DoctorSchedule } from "@/types/doctorRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Clock, Calendar, Users, ChevronDown, ChevronUp, Edit2, Check, X } from "lucide-react";

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

const getDayIndex = (dayOfWeek: number | number[]): number => {
  if (Array.isArray(dayOfWeek)) return dayOfWeek[0] ?? 1;
  return dayOfWeek;
};

export function SchedulePicker({ schedules, onChange }: SchedulePickerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Monday
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("12:00");
  const [timezone, setTimezone] = useState<string>("Asia/Jakarta");
  const [bookingMode, setBookingMode] = useState<"FIXED_SLOT" | "SESSION_QUEUE">("FIXED_SLOT");
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [capacity, setCapacity] = useState<number>(1);

  const handleSaveSlot = () => {
    if (!startTime || !endTime) return;

    // Maximum time check: max is 23:59
    const cappedStart = startTime > "23:59" ? "23:59" : startTime;
    const cappedEnd = endTime > "23:59" ? "23:59" : endTime;

    const newSlot: DoctorSchedule = {
      day_of_week: Number(dayOfWeek),
      start_time: cappedStart,
      end_time: cappedEnd,
      timezone: timezone || "Asia/Jakarta",
      booking_mode: bookingMode,
      slot_duration_minutes: Number(slotDuration),
      capacity: Number(capacity),
    };

    if (editingIndex !== null) {
      const updated = [...schedules];
      updated[editingIndex] = newSlot;
      onChange(updated);
      setEditingIndex(null);
    } else {
      onChange([...schedules, newSlot]);
    }
  };

  const handleStartEdit = (index: number) => {
    const target = schedules[index];
    if (!target) return;
    setEditingIndex(index);
    setDayOfWeek(getDayIndex(target.day_of_week));
    setStartTime(target.start_time || "08:00");
    setEndTime(target.end_time || "12:00");
    setTimezone(target.timezone || "Asia/Jakarta");
    setBookingMode(target.booking_mode || "FIXED_SLOT");
    setSlotDuration(target.slot_duration_minutes || 30);
    setCapacity(target.capacity || 1);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleRemoveSlot = (index: number) => {
    if (editingIndex === index) {
      setEditingIndex(null);
    }
    const updated = schedules.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
      {/* Collapsible Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/80 cursor-pointer transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#3BB49F]" />
          <span className="text-xs sm:text-sm font-semibold text-gray-800">
            Jadwal Praktik Mingguan Dokter
          </span>
          <span className="text-[11px] sm:text-xs bg-[#EBF8F5] text-[#008A72] border border-[#C4E9E2] px-2.5 py-0.5 rounded-full font-medium ml-1">
            {schedules.length} Slot Ditambahkan
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{isOpen ? "Sembunyikan" : "Tampilkan"}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Collapsible Body Content */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200/60 flex flex-col gap-5 bg-white">
          {/* 1. DAFTAR JADWAL PER HARI (DITAMPILKAN TERLEBIH DAHULU) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#3BB49F]" />
                <span>Daftar Slot Praktik per Hari ({schedules.length} Slot):</span>
              </Label>
              <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">
                *Klik &quot;Edit Jadwal&quot; untuk merubah jam/kapasitas slot
              </span>
            </div>

            {schedules.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/70 text-center">
                <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600 font-medium">Belum ada slot jadwal praktik yang ditambahkan.</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Gunakan form di bawah ini untuk menambahkan slot jadwal per hari.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {schedules.map((slot, idx) => {
                  const dVal = getDayIndex(slot.day_of_week);
                  const dayLabel = DAYS.find((d) => d.value === dVal)?.label || `Hari ${dVal}`;
                  const isEditing = editingIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs text-gray-800 transition-all ${
                        isEditing
                          ? "bg-amber-50/90 border-amber-300 ring-2 ring-amber-200/60 shadow-sm"
                          : "bg-white border-gray-200 hover:border-gray-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                        <span className="font-bold text-[#008A72] bg-[#EBF8F5] px-3 py-1 rounded-lg border border-[#C4E9E2] text-xs shrink-0">
                          {dayLabel}
                        </span>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 flex items-center gap-1 text-xs">
                            <Clock className="h-3.5 w-3.5 text-[#3BB49F]" />
                            {slot.start_time} - {slot.end_time}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 font-medium">
                            {slot.booking_mode || "FIXED_SLOT"}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 font-normal">
                            Durasi: {slot.slot_duration_minutes || 30}m
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 font-normal flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            Max {slot.capacity || 1} Pasien
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartEdit(idx)}
                          className={`h-8 px-2.5 text-xs rounded-lg flex items-center gap-1.5 cursor-pointer ${
                            isEditing
                              ? "border-amber-400 bg-amber-100 text-amber-900 font-bold"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                          title="Edit Slot Jadwal Ini"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-[#3BB49F]" />
                          <span>{isEditing ? "Mengedit..." : "Edit Jadwal"}</span>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveSlot(idx)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 border-gray-200 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Hapus Slot Ini"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. FORM TAMBAH / EDIT SLOT JADWAL (DITARUH DI BAWAH DAFTAR JADWAL) */}
          <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                {editingIndex !== null ? (
                  <>
                    <Edit2 className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-900">Form Edit Slot Jadwal (Hari {DAYS.find(d => d.value === dayOfWeek)?.label})</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 text-[#3BB49F]" />
                    <span>Form Tambah Slot Jadwal Praktik</span>
                  </>
                )}
              </Label>
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-amber-700 hover:text-amber-900 underline font-medium cursor-pointer"
                >
                  Batal Edit (Tambah Baru)
                </button>
              )}
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-xl border transition-colors ${
              editingIndex !== null ? "bg-amber-50/50 border-amber-200" : "bg-[#F8FAFC] border-gray-200"
            }`}>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">Hari</Label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(Number(e.target.value))}
                  className="w-full h-9 px-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
                >
                  {DAYS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Jam Mulai (Format 24 Jam, Max 23:59)
                </Label>
                <Input
                  type="time"
                  step="60"
                  max="23:59"
                  value={startTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStartTime(val > "23:59" ? "23:59" : val);
                  }}
                  className="h-9 px-2.5 text-xs bg-white border-gray-200 rounded-lg focus-visible:ring-[#3BB49F]"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Jam Selesai (Format 24 Jam, Max 23:59)
                </Label>
                <Input
                  type="time"
                  step="60"
                  max="23:59"
                  value={endTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEndTime(val > "23:59" ? "23:59" : val);
                  }}
                  className="h-9 px-2.5 text-xs bg-white border-gray-200 rounded-lg focus-visible:ring-[#3BB49F]"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">Mode Booking</Label>
                <select
                  value={bookingMode}
                  onChange={(e) => setBookingMode(e.target.value as "FIXED_SLOT" | "SESSION_QUEUE")}
                  className="w-full h-9 px-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
                >
                  <option value="FIXED_SLOT">Fixed Slot</option>
                  <option value="SESSION_QUEUE">Session Queue</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">Durasi (Menit)</Label>
                <Input
                  type="number"
                  min={5}
                  max={240}
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="h-9 px-2.5 text-xs bg-white border-gray-200 rounded-lg focus-visible:ring-[#3BB49F]"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">Kapasitas Pasien</Label>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="h-9 px-2.5 text-xs bg-white border-gray-200 rounded-lg focus-visible:ring-[#3BB49F]"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">Zona Waktu</Label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-9 px-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
                >
                  <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
                  <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
                  <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  type="button"
                  onClick={handleSaveSlot}
                  className={`w-full h-9 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    editingIndex !== null
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-[#3BB49F] hover:bg-[#329a88]"
                  }`}
                >
                  {editingIndex !== null ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Tambah Slot Jadwal</span>
                    </>
                  )}
                </Button>

                {editingIndex !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="h-9 px-2.5 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs"
                    title="Batal Edit"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

