"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DoctorSchedule } from "@/types/doctorRegistration";
import { SchedulePicker } from "./SchedulePicker";
import { useCreateScheduleChange } from "@/hooks/doctorRegistration/useCreateScheduleChange";
import { useCreateSpecificSchedule } from "@/hooks/doctorRegistration/useCreateSpecificSchedule";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import { useGetDoctors } from "@/hooks/doctorRegistration/useGetDoctors";
import { ChevronDown, Edit3, Calendar, Clock, Sparkles } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface ScheduleChangeModalProps {
  affiliationId?: string;
  doctorName?: string;
  initialSchedules?: DoctorSchedule[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function ScheduleChangeModal({
  affiliationId: propAffiliationId,
  doctorName: propDoctorName,
  initialSchedules,
  isOpen,
  onClose,
  onSubmitSuccess,
}: ScheduleChangeModalProps) {
  const hospitalId = Cookies.get("hospitalId") || "";
  const { doctors, isLoading: isLoadingDoctors } = useGetDoctors(hospitalId);

  const [changeType, setChangeType] = useState<"ROUTINE" | "SPECIFIC">("ROUTINE");
  const [selectedAffiliationId, setSelectedAffiliationId] = useState<string>(propAffiliationId || "");
  const [reason, setReason] = useState("");
  const [schedules, setSchedules] = useState<DoctorSchedule[]>(initialSchedules || []);

  // Specific Schedule Form State
  const [specificDate, setSpecificDate] = useState<string>("");
  const [specificStartTime, setSpecificStartTime] = useState<string>("08:00");
  const [specificEndTime, setSpecificEndTime] = useState<string>("12:00");
  const [specificBookingMode, setSpecificBookingMode] = useState<"FIXED_SLOT" | "SESSION_QUEUE">("FIXED_SLOT");
  const [specificDuration, setSpecificDuration] = useState<number | string>(30);
  const [specificCapacity, setSpecificCapacity] = useState<number | string>(20);
  const [specificTimezone, setSpecificTimezone] = useState<string>("Asia/Jakarta");

  useEffect(() => {
    if (isOpen) {
      setSelectedAffiliationId(propAffiliationId || "");
      setSchedules(initialSchedules || []);
      setChangeType("ROUTINE");
      setReason("");
      setSpecificDate("");
    }
  }, [isOpen, propAffiliationId, initialSchedules]);

  const activeAffiliationId = propAffiliationId || selectedAffiliationId;

  const createScheduleChangeMutation = useCreateScheduleChange(hospitalId);
  const createSpecificScheduleMutation = useCreateSpecificSchedule(hospitalId);

  const isPending = createScheduleChangeMutation.isPending || createSpecificScheduleMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAffiliationId) {
      toast.error("Pilih dokter terlebih dahulu.");
      return;
    }

    try {
      if (changeType === "ROUTINE") {
        if (schedules.length === 0) {
          toast.error("Tambahkan minimal 1 slot jadwal praktik usulan.");
          return;
        }

        const res = await createScheduleChangeMutation.mutateAsync({
          affiliation_id: activeAffiliationId,
          reason: reason || undefined,
          schedules,
        });

        handleApiSuccess(res, "Pengajuan Perubahan Rutin Berhasil", "Permintaan perubahan jadwal rutin telah dikirimkan ke sistem RS.");
      } else {
        if (!specificDate) {
          toast.error("Tanggal spesifik praktik wajib diisi.");
          return;
        }
        if (!specificStartTime || !specificEndTime) {
          toast.error("Jam mulai dan jam selesai wajib diisi.");
          return;
        }
        if (specificEndTime <= specificStartTime) {
          toast.error("Jam selesai harus lebih dari jam mulai.");
          return;
        }

        await createSpecificScheduleMutation.mutateAsync({
          affiliation_id: activeAffiliationId,
          reason: reason || undefined,
          schedule: {
            schedule_date: specificDate,
            day_of_week: [],
            start_time: specificStartTime,
            end_time: specificEndTime,
            timezone: specificTimezone,
            booking_mode: specificBookingMode,
            slot_duration_minutes: specificBookingMode === "FIXED_SLOT" ? Number(specificDuration || 30) : undefined,
            capacity: specificBookingMode === "SESSION_QUEUE" ? Number(specificCapacity || 20) : undefined,
          },
        });
      }

      onSubmitSuccess?.();
      onClose();

      // Reset
      setReason("");
      setSchedules([]);
      setSelectedAffiliationId("");
      setSpecificDate("");
    } catch (err) {
      handleApiError(err, "Gagal Mengajukan Perubahan Jadwal");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl p-6 md:p-8 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl md:text-2xl font-bold text-[#101828] tracking-tight flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-[#008A72]" />
            <span>Pengajuan Perubahan Jadwal Praktik</span>
          </DialogTitle>
          <p className="text-gray-500 text-xs md:text-sm font-normal mt-1">
            {propDoctorName ? `Dokter: ${propDoctorName}` : "Pilih dokter dan atur usulan jam praktik baru"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
          {/* Change Type Selection */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Tipe Pengajuan Jadwal <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setChangeType("ROUTINE")}
                className={`py-3 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  changeType === "ROUTINE"
                    ? "bg-white text-[#008A72] shadow-xs font-bold border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>1. Perubahan Jadwal Rutin (REPLACE)</span>
              </button>

              <button
                type="button"
                onClick={() => setChangeType("SPECIFIC")}
                className={`py-3 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  changeType === "SPECIFIC"
                    ? "bg-white text-[#008A72] shadow-xs font-bold border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>2. Jadwal Spesifik / Bertanggal (ADD)</span>
              </button>
            </div>
          </div>

          {/* Doctor Selection Dropdown (Only if propAffiliationId not provided) */}
          {!propAffiliationId && (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-800">
                Pilih Dokter RS <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  value={selectedAffiliationId}
                  onChange={(e) => setSelectedAffiliationId(e.target.value)}
                  disabled={isLoadingDoctors}
                  className="w-full py-3 px-4 h-12 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008A72] appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Dokter Terdaftar --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id || doc.doctor_id} value={doc.id || doc.doctor_id}>
                      {doc.first_name || doc.doctor_name} {doc.last_name || ""} ({doc.specialty || "Dokter"}) - SIP: {doc.sip_number || "-"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Reason Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              Alasan Pengajuan Perubahan (Opsional)
            </Label>
            <Input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Menyesuaikan kapasitas poli / Penambahan jam sore bertanggal..."
              className="py-3 px-4 h-11 bg-gray-50/50 border-gray-200 rounded-xl text-sm focus-visible:ring-[#008A72]"
            />
          </div>

          {/* Form Content based on Change Type */}
          {changeType === "ROUTINE" ? (
            <SchedulePicker schedules={schedules} onChange={setSchedules} />
          ) : (
            <div className="p-5 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#008A72]">
                <Sparkles className="h-4 w-4" />
                <span>Form Usulan Jadwal Praktik Spesifik (Bertanggal)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Tanggal Specific */}
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">
                    Tanggal Praktik Spesifik <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={specificDate}
                    onChange={(e) => setSpecificDate(e.target.value)}
                    className="h-10 bg-white border-gray-200 rounded-xl focus-visible:ring-[#008A72]"
                  />
                </div>

                {/* Jam Mulai */}
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">
                    Jam Mulai <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={specificStartTime}
                    onChange={(e) => setSpecificStartTime(e.target.value)}
                    className="h-10 bg-white border-gray-200 rounded-xl focus-visible:ring-[#008A72]"
                  />
                </div>

                {/* Jam Selesai */}
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">
                    Jam Selesai <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={specificEndTime}
                    onChange={(e) => setSpecificEndTime(e.target.value)}
                    className="h-10 bg-white border-gray-200 rounded-xl focus-visible:ring-[#008A72]"
                  />
                </div>

                {/* Mode Booking */}
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">Mode Booking</Label>
                  <select
                    value={specificBookingMode}
                    onChange={(e) => setSpecificBookingMode(e.target.value as "FIXED_SLOT" | "SESSION_QUEUE")}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008A72]"
                  >
                    <option value="FIXED_SLOT">Fixed Slot</option>
                    <option value="SESSION_QUEUE">Session Queue</option>
                  </select>
                </div>

                {/* Durasi / Kapasitas */}
                {specificBookingMode === "FIXED_SLOT" ? (
                  <div>
                    <Label className="font-semibold text-gray-700 mb-1 block">Durasi Slot (Menit)</Label>
                    <Input
                      type="number"
                      min={5}
                      max={240}
                      placeholder="30"
                      value={specificDuration}
                      onChange={(e) => setSpecificDuration(e.target.value === "" ? "" : Number(e.target.value))}
                      className="h-10 bg-white border-gray-200 rounded-xl focus-visible:ring-[#008A72]"
                    />
                  </div>
                ) : (
                  <div>
                    <Label className="font-semibold text-gray-700 mb-1 block">Kapasitas Sesi (Pasien)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={500}
                      placeholder="20"
                      value={specificCapacity}
                      onChange={(e) => setSpecificCapacity(e.target.value === "" ? "" : Number(e.target.value))}
                      className="h-10 bg-white border-gray-200 rounded-xl focus-visible:ring-[#008A72]"
                    />
                  </div>
                )}

                {/* Zona Waktu */}
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">Zona Waktu</Label>
                  <select
                    value={specificTimezone}
                    onChange={(e) => setSpecificTimezone(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008A72]"
                  >
                    <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
                    <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
                    <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="py-3 px-8 h-12 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="py-3 px-8 h-12 text-sm font-semibold bg-[#008A72] hover:bg-[#007661] text-white rounded-xl cursor-pointer shadow-xs"
            >
              {isPending ? "Mengajukan..." : "Kirim Pengajuan Jadwal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

