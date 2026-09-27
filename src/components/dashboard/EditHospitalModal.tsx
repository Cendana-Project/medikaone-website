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
import { Edit, Image as ImageIcon } from "lucide-react";
import { HospitalItem } from "@/hooks/hospital/useGetHospitals";
import { useUpdateHospital } from "@/hooks/hospital/useUpdateHospital";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import { HospitalGalleryModal } from "@/components/dashboard/HospitalGalleryModal";

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
  const [country, setCountry] = useState("Indonesia");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [establishedYear, setEstablishedYear] = useState<number | undefined>(undefined);
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [description, setDescription] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const updateMutation = useUpdateHospital(hospital?.id);

  useEffect(() => {
    if (hospital) {
      setCode(hospital.code || "");
      setName(hospital.name || "");
      setAddress(hospital.address || "");
      setCity(hospital.city || "");
      setProvince(hospital.province || "");
      setCountry(hospital.country || "Indonesia");
      setPhone(hospital.phone || "");
      setEmail(hospital.email || "");
      setWebsite(hospital.website || "");
      setEstablishedYear(hospital.established_year);
      setTimezone(hospital.timezone || "Asia/Jakarta");
      setDescription(hospital.description || "");
    }
  }, [hospital]);

  if (!hospital) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        code,
        name,
        address,
        city,
        province,
        country,
        phone,
        email,
        website,
        established_year: establishedYear ? Number(establishedYear) : undefined,
        timezone,
        description,
      };

      const res = await updateMutation.mutateAsync({
        id: hospital.id,
        payload,
      });

      handleApiSuccess(res, "Profil Rumah Sakit diperbarui", `Data rumah sakit ${name} telah berhasil disimpan.`);
      onSubmitSuccess?.();
      onClose();
    } catch (err) {
      handleApiError(err, "Gagal memperbarui data rumah sakit");
    }
  };

  const isPending = updateMutation.isPending;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-xl p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="px-7 pt-7 pb-4 border-b border-gray-100 shrink-0 flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Edit className="h-5 w-5 text-[#3BB49F]" />
                <span>Ubah Data Rumah Sakit</span>
              </DialogTitle>
              <p className="text-xs text-gray-500 mt-1 font-normal font-mono">
                ID RS: {hospital.id}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsGalleryOpen(true)}
              className="h-9 border-[#C4E9E2] text-[#008A72] hover:bg-[#EBF8F5] text-xs font-semibold flex items-center gap-1.5 rounded-xl cursor-pointer"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Kelola Galeri Foto</span>
            </Button>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-country" className="text-xs font-semibold text-gray-800">
                    Negara
                  </Label>
                  <Input
                    id="edit-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Contoh: Indonesia"
                    className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
                  />
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
              </div>

              {/* Email & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-email" className="text-xs font-semibold text-gray-800">
                    Email Resmi RS
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: info@hospital.com"
                    className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-website" className="text-xs font-semibold text-gray-800">
                    Website RS
                  </Label>
                  <Input
                    id="edit-website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Contoh: https://hospital.com"
                    className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
                  />
                </div>
              </div>

              {/* Tahun Berdiri & Timezone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-[#established-year]" className="text-xs font-semibold text-gray-800">
                    Tahun Berdiri RS
                  </Label>
                  <Input
                    id="edit-established-year"
                    type="number"
                    value={establishedYear ?? ""}
                    onChange={(e) => setEstablishedYear(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Contoh: 2010"
                    className="h-10 bg-[#F8FAFC] border-gray-200 rounded-xl px-3.5 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-timezone" className="text-xs font-semibold text-gray-800">
                    Zona Waktu (Timezone)
                  </Label>
                  <select
                    id="edit-timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="h-10 bg-[#F8FAFC] border border-gray-200 rounded-xl px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#3BB49F]"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>
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
                disabled={isPending}
                className="border border-gray-200 bg-white text-gray-700 rounded-xl px-5 h-10 text-xs font-semibold cursor-pointer"
              >
                Batalkan
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-xl px-6 h-10 text-xs font-semibold cursor-pointer shadow-xs"
              >
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hospital Gallery Modal */}
      <HospitalGalleryModal
        hospitalId={hospital.id}
        hospitalName={name || hospital.name}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </>
  );
}
