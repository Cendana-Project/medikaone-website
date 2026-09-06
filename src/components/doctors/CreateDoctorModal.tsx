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
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { DoctorSearchInput } from "./DoctorSearchInput";
import { DoctorSearchResult } from "@/types/doctorRegistration";
import toast from "react-hot-toast";

interface CreateDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function CreateDoctorModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: CreateDoctorModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorSearchResult | null>(null);
  const [specialty, setSpecialty] = useState("Poli anak");
  const [department, setDepartment] = useState("Poli anak");
  const [room, setRoom] = useState("Poli anak");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error("Silakan cari dan pilih ID Dokter / Nama Dokter terlebih dahulu");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(`Dokter ${selectedDoctor.first_name} ${selectedDoctor.last_name} berhasil didaftarkan.`);
      onSubmitSuccess?.();
      onClose();
      // Reset form
      setSelectedDoctor(null);
      setSpecialty("Poli anak");
      setDepartment("Poli anak");
      setRoom("Poli anak");
    } catch {
      toast.error("Gagal mendaftarkan akun dokter");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-8 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-[#101828] tracking-tight">
            Buat Akun Dokter Baru
          </DialogTitle>
          <p className="text-gray-500 text-sm font-normal mt-1">
            Pastikan identitas akun sesuai dengan user
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
          {/* Live Search ID Dokter */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              ID Dokter / Cari Dokter
            </Label>
            <DoctorSearchInput
              selectedDoctor={selectedDoctor}
              onSelectDoctor={(doc) => {
                setSelectedDoctor(doc);
                if (doc.specialty) setSpecialty(doc.specialty);
              }}
              placeholder="Cari ID Dokter, Nama, atau Email..."
            />
            {selectedDoctor && (
              <div className="flex items-center gap-2 text-xs text-[#3BB49F] font-medium bg-[#EBF8F5] p-2.5 rounded-lg border border-[#C4E9E2]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Dokter Terpilih: {selectedDoctor.first_name} {selectedDoctor.last_name} ({selectedDoctor.email})</span>
              </div>
            )}
          </div>

          {/* Spesialis Dropdown */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              Spesialis
            </Label>
            <div className="relative">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full py-3 px-4 h-12 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F] appearance-none cursor-pointer"
              >
                <option value="Poli anak">Poli anak</option>
                <option value="Kandungan">Kandungan</option>
                <option value="Penyakit Dalam">Penyakit Dalam</option>
                <option value="Telinga">Telinga (THT)</option>
                <option value="Kecantikan">Kecantikan (Estetika)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Departemen Dropdown */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              Departemen
            </Label>
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full py-3 px-4 h-12 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F] appearance-none cursor-pointer"
              >
                <option value="Poli anak">Poli anak</option>
                <option value="Poli Utama">Poli Utama</option>
                <option value="Departemen Spesialis II">Departemen Spesialis II</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Ruangan Dropdown */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              Ruangan
            </Label>
            <div className="relative">
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full py-3 px-4 h-12 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F] appearance-none cursor-pointer"
              >
                <option value="Poli anak">Poli anak</option>
                <option value="Ruang Bunga I">Ruang Bunga I</option>
                <option value="Ruang Bunga II">Ruang Bunga II</option>
                <option value="Ruang Bunga III">Ruang Bunga III</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="py-3 px-8 h-12 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="py-3 px-8 h-12 text-sm font-semibold bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-xl cursor-pointer shadow-xs"
            >
              {isLoading ? "Memproses..." : "Daftar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
