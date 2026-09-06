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
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!doctor) {
      toast.error("Silakan cari data dokter terlebih dahulu");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(`Dokter ${doctor.first_name} ${doctor.last_name} berhasil diverifikasi & terdaftar.`);
      onSubmitSuccess?.();
      onClose();
    } catch {
      toast.error("Gagal mengonfirmasi pendaftaran dokter");
    } finally {
      setIsLoading(false);
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
          {/* ID Dokter Search */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              ID Dokter
            </Label>
            <DoctorSearchInput
              selectedDoctor={doctor}
              onSelectDoctor={(doc) => setDoctor(doc)}
              placeholder="5146846548465"
            />
          </div>

          {/* Green Card Section: Data Teridentifikasi */}
          {doctor && (
            <div className="bg-[#008A72] text-white p-6 rounded-2xl border border-[#007A65] flex flex-col gap-4 shadow-md">
              <div className="flex items-center gap-2 justify-center text-center border-b border-white/20 pb-3">
                <CheckCircle2 className="h-5 w-5 text-white" />
                <h4 className="text-lg font-bold">Data Teridentifikasi</h4>
              </div>
              <p className="text-xs text-white/80 text-center -mt-2">
                Pastikan identitas akun sesuai dengan user
              </p>

              {/* Avatar + Nama */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white border border-white/30 shrink-0">
                  {doctor.first_name[0]}
                </div>
                <div>
                  <p className="text-xs text-white/70">Nama Lengkap</p>
                  <p className="text-base font-bold text-white">
                    {doctor.first_name} {doctor.last_name}
                  </p>
                </div>
              </div>

              {/* SIP Input Field */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-white/90">
                  SIP
                </Label>
                <Input
                  type="text"
                  readOnly
                  value={doctor.sip_number}
                  className="bg-white text-gray-900 font-medium py-2.5 h-11 rounded-xl text-sm border-none shadow-xs"
                />
              </div>

              {/* Grid: Departemen & Tanggal Lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-white/90">
                    Departemen
                  </Label>
                  <Input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-white text-gray-900 font-medium py-2.5 h-11 rounded-xl text-sm border-none shadow-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-white/90 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Tanggal Lahir
                  </Label>
                  <Input
                    type="text"
                    readOnly
                    value={dob}
                    className="bg-white text-gray-900 font-medium py-2.5 h-11 rounded-xl text-sm border-none shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Subtitle warning */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Info className="h-3.5 w-3.5" />
            <span>Jangan Sebarkan data pasien ke orang lain.</span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="py-3 px-8 h-12 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
            >
              Kembali
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="py-3 px-8 h-12 text-sm font-semibold bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-xl cursor-pointer shadow-xs"
            >
              {isLoading ? "Memproses..." : "Konfirmasi Daftarkan Dokter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
