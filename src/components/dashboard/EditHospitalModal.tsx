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
import { Edit } from "lucide-react";
import { HospitalItem } from "@/hooks/hospital/useGetHospitals";
import toast from "react-hot-toast";

interface EditHospitalModalProps {
  hospital: HospitalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function EditHospitalModal({
  hospital,
  isOpen,
  onClose,
  onSubmitSuccess,
}: EditHospitalModalProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hospital) {
      setCode(hospital.code || "");
      setName(hospital.name || "");
      setAddress(hospital.address || "");
      setCity(hospital.city || "");
      setProvince(hospital.province || "");
      setPhone(hospital.phone || "");
      setDescription(hospital.description || "");
    }
  }, [hospital]);

  if (!hospital) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !city) {
      toast.error("Kode, Nama RS, dan Kota wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success(`Data Rumah Sakit ${name} berhasil diperbarui.`);
      onSubmitSuccess?.();
      onClose();
    } catch {
      toast.error("Gagal mengalirkan perubahan data rumah sakit.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-7 pt-7 pb-4 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Edit className="h-5 w-5 text-[#3BB49F]" />
            <span>Ubah Data Rumah Sakit</span>
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1 font-normal">
            ID RS: {hospital.id}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-7 pb-5 pt-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-code" className="text-xs font-semibold text-gray-800">
                  Kode Rumah Sakit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Contoh: HSP-MO-001"
                  className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-name" className="text-xs font-semibold text-gray-800">
                  Nama Rumah Sakit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: RS MedikaOne Jakarta"
                  className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-address" className="text-xs font-semibold text-gray-800">
                Alamat Lengkap
              </Label>
              <Input
                id="edit-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Sudirman No. 1"
                className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-city" className="text-xs font-semibold text-gray-800">
                  Kota / Kabupaten <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Jakarta Pusat"
                  className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-province" className="text-xs font-semibold text-gray-800">
                  Provinsi
                </Label>
                <Input
                  id="edit-province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Contoh: DKI Jakarta"
                  className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-phone" className="text-xs font-semibold text-gray-800">
                Nomor Telepon RS
              </Label>
              <Input
                id="edit-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: +628123456789"
                className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-description" className="text-xs font-semibold text-gray-800">
                Deskripsi / Catatan RS
              </Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Rumah sakit rujukan utama"
                className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
              />
            </div>
          </div>

          {/* Form Footer */}
          <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 shrink-0 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border border-gray-200 bg-white text-gray-700 rounded-xl px-5 h-10 text-xs font-semibold cursor-pointer"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-xl px-6 h-10 text-xs font-semibold cursor-pointer shadow-xs"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
