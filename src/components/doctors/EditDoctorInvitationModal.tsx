"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DoctorInvitation, DoctorSchedule } from "@/types/doctorRegistration";
import { useGetDepartments } from "@/hooks/doctorRegistration/useGetDepartments";
import { useGetRooms } from "@/hooks/doctorRegistration/useGetRooms";
import { useUpdateDoctorInvitation } from "@/hooks/doctorRegistration/useUpdateDoctorInvitation";
import { useResendDoctorInvitation } from "@/hooks/doctorRegistration/useResendDoctorInvitation";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import Cookies from "js-cookie";
import { Edit, Plus, Trash2, Calendar, Clock, AlertTriangle, Send } from "lucide-react";

interface EditDoctorInvitationModalProps {
  invitation: DoctorInvitation | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

const DAY_OPTIONS = [
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
  { value: 0, label: "Minggu" },
];

export function EditDoctorInvitationModal({
  invitation,
  isOpen,
  onClose,
  onRefresh,
}: EditDoctorInvitationModalProps) {
  const hospitalId = Cookies.get("hospitalId") || "";
  const { departments } = useGetDepartments(hospitalId);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [shouldResendAfterSave, setShouldResendAfterSave] = useState(true);

  const { rooms } = useGetRooms(hospitalId, selectedDepartmentId || undefined);
  const updateMutation = useUpdateDoctorInvitation(hospitalId);
  const resendMutation = useResendDoctorInvitation(hospitalId);

  useEffect(() => {
    if (invitation) {
      setSelectedDepartmentId(invitation.department_id || "");
      setSelectedRoomId(invitation.room_id || "");
      setMessage(invitation.message || "");
      setSchedules(
        (invitation.schedules || []).map((s) => ({
          day_of_week: Array.isArray(s.day_of_week) ? s.day_of_week[0] ?? 1 : s.day_of_week ?? 1,
          start_time: s.start_time || "08:00",
          end_time: s.end_time || "12:00",
          timezone: s.timezone || "Asia/Jakarta",
          booking_mode: s.booking_mode || "FIXED_SLOT",
          slot_duration_minutes: s.slot_duration_minutes || 30,
          capacity: s.capacity || 20,
        }))
      );
      setShouldResendAfterSave(invitation.status === "REJECTED" || invitation.status === "CANCELLED" || invitation.status === "EXPIRED");
    }
  }, [invitation]);

  if (!invitation) return null;

  const handleAddSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      {
        day_of_week: 1,
        start_time: "08:00",
        end_time: "12:00",
        timezone: "Asia/Jakarta",
        booking_mode: "FIXED_SLOT",
        slot_duration_minutes: 30,
        capacity: 20,
      },
    ]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScheduleChange = <K extends keyof DoctorSchedule>(
    index: number,
    field: K,
    value: DoctorSchedule[K]
  ) => {
    setSchedules((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartmentId) {
      handleApiError(new Error("Departemen wajib dipilih."));
      return;
    }

    try {
      const payload = {
        department_id: selectedDepartmentId,
        room_id: selectedRoomId || "",
        message: message,
        schedules: schedules.map((s) => ({
          booking_mode: s.booking_mode || "FIXED_SLOT",
          day_of_week: Array.isArray(s.day_of_week) ? s.day_of_week : [Number(s.day_of_week)],
          start_time: s.start_time,
          end_time: s.end_time,
          timezone: s.timezone || "Asia/Jakarta",
          slot_duration_minutes: Number(s.slot_duration_minutes || 30),
          capacity: Number(s.capacity || 20),
        })),
      };

      const resUpdate = await updateMutation.mutateAsync({
        invitationId: invitation.id,
        payload,
      });

      if (shouldResendAfterSave && (invitation.status === "REJECTED" || invitation.status === "CANCELLED" || invitation.status === "EXPIRED")) {
        const resResend = await resendMutation.mutateAsync(invitation.id);
        handleApiSuccess(
          resResend,
          "Undangan Diperbarui & Dikirim Ulang",
          "Data undangan telah diperbarui dan penawaran baru berhasil dikirim ulang ke dokter."
        );
      } else {
        handleApiSuccess(
          resUpdate,
          "Undangan Berhasil Diperbarui",
          "Parameter penawaran undangan dokter telah diperbarui."
        );
      }

      onRefresh?.();
      onClose();
    } catch (err) {
      handleApiError(err, "Gagal memperbarui undangan dokter");
    }
  };

  const isPendingSubmit = updateMutation.isPending || resendMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-2xl md:max-w-3xl p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-7 pt-7 pb-4 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-[#3BB49F]" />
              <span>Perbarui & Revisi Undangan Dokter</span>
            </span>
            <Badge
              variant="outline"
              className={
                invitation.status === "PENDING"
                  ? "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89] text-xs px-2.5 py-0.5 rounded-full"
                  : "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA] text-xs px-2.5 py-0.5 rounded-full"
              }
            >
              Status: {invitation.status}
            </Badge>
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            Dokter: <span className="font-semibold text-gray-800">{invitation.doctor_first_name} {invitation.doctor_last_name}</span> ({invitation.doctor_email})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-5">
            {/* Banner Alasan Penolakan dari Dokter (jika REJECTED) */}
            {invitation.status === "REJECTED" && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col gap-1.5 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Alasan Penolakan dari Dokter:</span>
                </div>
                <p className="italic text-amber-800 pl-6">
                  &ldquo;{invitation.rejection_reason || "Dokter menolak undangan tanpa memberikan catatan detail."}&rdquo;
                </p>
                <p className="text-[11px] text-amber-700 mt-1 pl-6">
                  Silakan sesuaikan departemen, ruangan, jadwal, atau pesan penawaran di bawah sebelum mengirim ulang undangan.
                </p>
              </div>
            )}

            {/* Form Departemen & Ruangan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-dept" className="text-xs font-semibold text-gray-800">
                  Departemen / Poli RS <span className="text-red-500">*</span>
                </Label>
                <select
                  id="edit-dept"
                  value={selectedDepartmentId}
                  onChange={(e) => {
                    setSelectedDepartmentId(e.target.value);
                    setSelectedRoomId("");
                  }}
                  className="h-10 bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
                >
                  <option value="">-- Pilih Departemen --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-room" className="text-xs font-semibold text-gray-800">
                  Ruangan Praktik <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                </Label>
                <select
                  id="edit-room"
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="h-10 bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
                >
                  <option value="">-- Tanpa Penempatan Ruangan --</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pesan Penawaran */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-msg" className="text-xs font-semibold text-gray-800">
                Pesan Penawaran Kerjasama / Catatan Revisi
              </Label>
              <textarea
                id="edit-msg"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Contoh: Kami telah menyesuaikan jadwal praktik sesuai ketersediaan Anda..."
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
              />
            </div>

            {/* Usulan Jadwal Praktik */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#3BB49F]" />
                  <span>Usulan Jadwal Praktik Dokter</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSchedule}
                  className="h-8 text-xs border-[#C4E9E2] text-[#008A72] hover:bg-[#EBF8F5] cursor-pointer flex items-center gap-1 rounded-lg"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Jadwal</span>
                </Button>
              </div>

              {schedules.length === 0 ? (
                <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                  Belum ada jadwal yang diusulkan. Klik &quot;Tambah Jadwal&quot; di atas.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {schedules.map((sch, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F8FAFC] border border-gray-200 p-3.5 rounded-xl flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <span className="text-xs font-bold text-gray-800">
                          Sesi Praktik #{idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSchedule(idx)}
                          className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-gray-600">Hari</span>
                          <select
                            value={Array.isArray(sch.day_of_week) ? sch.day_of_week[0] : sch.day_of_week}
                            onChange={(e) => handleScheduleChange(idx, "day_of_week", Number(e.target.value))}
                            className="h-9 bg-white border border-gray-200 rounded-lg px-2 text-xs"
                          >
                            {DAY_OPTIONS.map((d) => (
                              <option key={d.value} value={d.value}>
                                {d.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" /> Jam Mulai
                          </span>
                          <Input
                            type="time"
                            value={sch.start_time}
                            onChange={(e) => handleScheduleChange(idx, "start_time", e.target.value)}
                            className="h-9 bg-white border-gray-200 text-xs rounded-lg px-2"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" /> Jam Selesai
                          </span>
                          <Input
                            type="time"
                            value={sch.end_time}
                            onChange={(e) => handleScheduleChange(idx, "end_time", e.target.value)}
                            className="h-9 bg-white border-gray-200 text-xs rounded-lg px-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-gray-600">Mode Slot</span>
                          <select
                            value={sch.booking_mode || "FIXED_SLOT"}
                            onChange={(e) => handleScheduleChange(idx, "booking_mode", e.target.value as "FIXED_SLOT" | "SESSION_QUEUE")}
                            className="h-9 bg-white border border-gray-200 rounded-lg px-2 text-xs"
                          >
                            <option value="FIXED_SLOT">FIXED_SLOT (Durasi Per Pasien)</option>
                            <option value="SESSION_QUEUE">SESSION_QUEUE (Kuota Antrean Sesi)</option>
                          </select>
                        </div>

                        {sch.booking_mode === "SESSION_QUEUE" ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-medium text-gray-600">Kuota Pasien / Sesi</span>
                            <Input
                              type="number"
                              min={1}
                              max={500}
                              placeholder="20"
                              value={sch.capacity ?? ""}
                              onChange={(e) => handleScheduleChange(idx, "capacity", e.target.value === "" ? undefined : Number(e.target.value))}
                              className="h-9 bg-white border-gray-200 text-xs rounded-lg px-2"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-medium text-gray-600">Durasi Slot (Menit)</span>
                            <Input
                              type="number"
                              min={5}
                              max={240}
                              placeholder="30"
                              value={sch.slot_duration_minutes ?? ""}
                              onChange={(e) => handleScheduleChange(idx, "slot_duration_minutes", e.target.value === "" ? undefined : Number(e.target.value))}
                              className="h-9 bg-white border-gray-200 text-xs rounded-lg px-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkbox Resend Option */}
            {(invitation.status === "REJECTED" || invitation.status === "CANCELLED" || invitation.status === "EXPIRED") && (
              <div className="p-3.5 bg-[#EBF8F5] border border-[#C4E9E2] rounded-xl flex items-center justify-between">
                <label htmlFor="resend-check" className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#008A72]">
                  <input
                    id="resend-check"
                    type="checkbox"
                    checked={shouldResendAfterSave}
                    onChange={(e) => setShouldResendAfterSave(e.target.checked)}
                    className="h-4 w-4 accent-[#3BB49F] rounded"
                  />
                  <span>Langsung Kirim Ulang (Resend) Undangan Setelah Disimpan</span>
                </label>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-white shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPendingSubmit}
              className="border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-5 h-10 text-xs font-semibold cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPendingSubmit}
              className="bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-xl px-6 h-10 text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              {shouldResendAfterSave && (invitation.status === "REJECTED" || invitation.status === "CANCELLED" || invitation.status === "EXPIRED") ? (
                <>
                  <Send className="h-4 w-4" />
                  <span>{isPendingSubmit ? "Menyimpan & Mengirim..." : "Simpan & Kirim Ulang"}</span>
                </>
              ) : (
                <span>{isPendingSubmit ? "Menyimpan..." : "Simpan Perubahan"}</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
