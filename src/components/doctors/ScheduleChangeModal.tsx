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
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import { useGetDoctors } from "@/hooks/doctorRegistration/useGetDoctors";
import { ChevronDown, Edit3 } from "lucide-react";
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

  const [selectedAffiliationId, setSelectedAffiliationId] = useState<string>(propAffiliationId || "");
  const [reason, setReason] = useState("");
  const [schedules, setSchedules] = useState<DoctorSchedule[]>(initialSchedules || []);

  useEffect(() => {
    if (isOpen) {
      setSelectedAffiliationId(propAffiliationId || "");
      setSchedules(initialSchedules || []);
    }
  }, [isOpen, propAffiliationId, initialSchedules]);

  const activeAffiliationId = propAffiliationId || selectedAffiliationId;

  const createScheduleChangeMutation = useCreateScheduleChange(hospitalId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAffiliationId) {
      toast.error("Pilih dokter terlebih dahulu.");
      return;
    }
    if (schedules.length === 0) {
      toast.error("Tambahkan minimal 1 slot jadwal praktik usulan.");
      return;
    }

    try {
      const res = await createScheduleChangeMutation.mutateAsync({
        affiliation_id: activeAffiliationId,
        reason: reason || undefined,
        schedules,
      });

      handleApiSuccess(res, "Pengajuan Perubahan Jadwal Berhasil", "Permintaan perubahan jadwal telah dikirimkan ke sistem RS.");
      onSubmitSuccess?.();
      onClose();

      // Reset
      setReason("");
      setSchedules([]);
      setSelectedAffiliationId("");
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
            {propDoctorName ? `Dokter: ${propDoctorName}` : "Pilih dokter dan atur usulan jam praktik baru"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
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
                  className="w-full py-3 px-4 h-12 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F] appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Dokter Terdaftar --</option>
                  {doctors.map((doc) => (
                    <option key={doc.affiliation_id || doc.doctor_id} value={doc.affiliation_id || doc.doctor_id}>
                      {doc.first_name} {doc.last_name} ({doc.specialty || "Dokter"}) - SIP: {doc.sip_number || "-"}
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
