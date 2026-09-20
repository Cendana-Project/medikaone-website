"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Info, Calendar } from "lucide-react";
import { DoctorSearchInput } from "./DoctorSearchInput";
import { DoctorSearchResult } from "@/types/doctorRegistration";
import { useUpdateDoctorStatus } from "@/hooks/doctorRegistration/useUpdateDoctorStatus";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface VerifyDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function VerifyDoctorModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: VerifyDoctorModalProps) {
  const hospitalId = Cookies.get("hospitalId") || "";
  const [doctor, setDoctor] = useState<DoctorSearchResult | null>({
    id: "5146846548465",
    email: "cornelius@medikaone.id",
    first_name: "Cornelius",
    last_name: "De Houtman",
    sip_number: "35041120392003",
    specialty: "Poli anak",
  });
  const [department, setDepartment] = useState("Poli anak");
  const [dob] = useState("31 - 10 - 2002");

  const updateStatusMutation = useUpdateDoctorStatus(hospitalId);

  const handleConfirm = async () => {
    if (!doctor) {
      toast.error("Silakan cari data dokter terlebih dahulu");
      return;
    }

    try {
      const res = await updateStatusMutation.mutateAsync({
        doctorId: doctor.id,
        payload: { status: "ACTIVE" },
      });

      handleApiSuccess(
        res,
        "Verifikasi Dokter Berhasil",
        `Dokter ${doctor.first_name} ${doctor.last_name || ""} berhasil diverifikasi & terdaftar.`
      );
      onSubmitSuccess?.();
      onClose();
    } catch (err) {
      handleApiError(err, "Gagal mengonfirmasi pendaftaran dokter");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-8 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-[#101828] tracking-tight">
            Verifikasi Dokter
          </DialogTitle>
          <p className="text-gray-500 text-sm font-normal mt-1">
            Pastikan identitas akun sesuai dengan user
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-4">
          {/* ID Dokter Search Input + Hint */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-gray-800">
              ID Dokter
            </Label>
            <DoctorSearchInput
              selectedDoctor={doctor}
              onSelectDoctor={(doc) => setDoctor(doc)}
              placeholder="5146846548465"
            />
            <p className="text-xs text-gray-400 font-normal">
              Bisa memasukkan ID Dokter, SIP, Email, NIK, MedikaOne ID, dll.
            </p>
          </div>

          {/* Green Card Section: Data Teridentifikasi (Figma Specs) */}
          {doctor && (
            <div
              className="w-full flex flex-col gap-6 p-8 rounded-xl shadow-lg transition-all"
              style={{
                background: "linear-gradient(147.77deg, #009B80 10.39%, #00352B 162.6%)",
                border: "6px solid rgba(0, 155, 128, 0.3)",
                borderRadius: "12px",
              }}
            >
              {/* Header Title inside card */}
              <div className="flex flex-col justify-center items-center text-center gap-1.5 border-b border-[#89D2C5] pb-4">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                  <h4 className="text-[24px] font-bold text-white leading-[28px] tracking-tight">
                    Data Teridentifikasi
                  </h4>
                </div>
                <p className="text-[16px] text-[#D8F0EC] font-normal leading-[24px]">
                  Pastikan identitas akun sesuai dengan user
                </p>
              </div>

              {/* Avatar + Nama Lengkap */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4B5AD] text-white flex items-center justify-center font-bold text-base border border-white/30 shrink-0">
                  {doctor.first_name[0]}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs text-white/90 font-normal leading-tight">
                    Nama Lengkap
                  </span>
                  <span className="text-lg font-bold text-white leading-tight">
                    {doctor.first_name} {doctor.last_name || ""}
                  </span>
                </div>
              </div>

              {/* Input SIP */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-normal text-white">
                  SIP
                </Label>
                <div className="h-[52px] w-full bg-[#F9FAFB] border border-[#D0D5DD] rounded-[10px] px-5 flex items-center shadow-xs">
                  <span className="text-base text-gray-900 font-medium">
                    {doctor.sip_number || "35041120392003"}
                  </span>
                </div>
              </div>

              {/* Grid 2 Columns: Departemen & Tanggal Lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-normal text-white">
                    Departemen
                  </Label>
                  <div className="h-[52px] w-full bg-[#F9FAFB] border border-[#D0D5DD] rounded-[10px] px-5 flex items-center shadow-xs">
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-transparent text-gray-900 font-medium text-base focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-normal text-white flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-white" /> Tanggal Lahir
                  </Label>
                  <div className="h-[52px] w-full bg-[#F9FAFB] border border-[#D0D5DD] rounded-[10px] px-5 flex items-center shadow-xs">
                    <span className="text-base text-gray-900 font-medium">
                      {dob}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning Subtitle */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-medium">
            <Info className="h-3.5 w-3.5 text-gray-400" />
            <span>Jangan Sebarkan data pasien ke orang lain.</span>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateStatusMutation.isPending}
              className="py-3 px-8 h-12 text-sm font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
            >
              Kembali
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={updateStatusMutation.isPending || !doctor}
              className="py-3 px-8 h-12 text-sm font-semibold bg-[#008A72] hover:bg-[#007661] text-white rounded-xl cursor-pointer shadow-xs"
            >
              {updateStatusMutation.isPending ? "Memproses..." : "Konfirmasi Daftarkan Dokter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
