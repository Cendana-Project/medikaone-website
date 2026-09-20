"use client";

import { useState } from "react";
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
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import { Edit3 } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface ScheduleChangeModalProps {
  affiliationId: string;
  doctorName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function ScheduleChangeModal({
  affiliationId,
  doctorName,
  isOpen,
  onClose,
  onSubmitSuccess,
}: ScheduleChangeModalProps) {
  const hospitalId = Cookies.get("hospitalId") || "";

  const [reason, setReason] = useState("");
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);

  const createScheduleChangeMutation = useCreateScheduleChange(hospitalId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliationId) {
      toast.error("Afiliasi dokter tidak valid.");
      return;
    }
    if (schedules.length === 0) {
      toast.error("Tambahkan minimal 1 slot jadwal praktik usulan.");
      return;
    }

    try {
      const res = await createScheduleChangeMutation.mutateAsync({
        affiliation_id: affiliationId,
        reason: reason || undefined,
        schedules,
      });

      handleApiSuccess(res, "Pengajuan Perubahan Jadwal Berhasil", "Permintaan perubahan jadwal telah dikirimkan ke sistem RS.");
      onSubmitSuccess?.();
      onClose();

      // Reset
      setReason("");
      setSchedules([]);
    } catch (err) {
      handleApiError(err, "Gagal Mengajukan Perubahan Jadwal");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl md:max-w-4xl p-6 md:p-8 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl md:text-2xl font-bold text-[#101828] tracking-tight flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-[#3BB49F]" />
            <span>Pengajuan Perubahan Jadwal Praktik</span>
          </DialogTitle>
          <p className="text-gray-500 text-xs md:text-sm font-normal mt-1">
            {doctorName ? `Dokter: ${doctorName}` : `Afiliasi ID: ${affiliationId}`}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
          {/* Reason Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              Alasan Pengajuan Perubahan (Opsional)
            </Label>
            <Input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Menyesuaikan kapasitas poli / Penambahan jam sore..."
              className="py-3 px-4 h-11 bg-gray-50/50 border-gray-200 rounded-xl text-sm focus-visible:ring-[#3BB49F]"
            />
          </div>

          {/* Interactive Schedule Picker */}
          <SchedulePicker schedules={schedules} onChange={setSchedules} />

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createScheduleChangeMutation.isPending}
              className="py-3 px-8 h-12 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={createScheduleChangeMutation.isPending}
              className="py-3 px-8 h-12 text-sm font-semibold bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-xl cursor-pointer shadow-xs"
            >
              {createScheduleChangeMutation.isPending ? "Mengajukan..." : "Kirim Pengajuan Jadwal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
