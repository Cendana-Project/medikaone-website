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
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function RoomModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: RoomModalProps) {
  const [departmentId, setDepartmentId] = useState("Poli anak");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      toast.error("Kode dan Nama Ruangan wajib diisi");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success(`Ruangan ${name} (${code}) berhasil dibuat.`);
      onSubmitSuccess?.();
      onClose();
      setCode("");
      setName("");
    } catch {
      toast.error("Gagal menambahkan ruangan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <DialogHeader className="pb-3 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-[#101828]">
            Tambah Ruangan Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Departemen
            </Label>
            <div className="relative">
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full py-2.5 px-3 h-11 border border-gray-200 rounded-xl text-sm bg-gray-50/50 appearance-none cursor-pointer"
              >
                <option value="Poli anak">Poli anak</option>
                <option value="Kandungan">Kandungan</option>
                <option value="Penyakit Dalam">Penyakit Dalam</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Kode Ruangan <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. RNG-BUNGA-1"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="py-2.5 px-3 h-11 border-gray-200 text-sm rounded-xl"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Nama Ruangan <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. Ruang Bunga I"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-2.5 px-3 h-11 border-gray-200 text-sm rounded-xl"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="py-2 px-5 h-10 text-xs font-medium rounded-xl cursor-pointer"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="py-2 px-5 h-10 text-xs font-semibold bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-xl cursor-pointer"
            >
              {isLoading ? "Memproses..." : "Simpan Ruangan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
