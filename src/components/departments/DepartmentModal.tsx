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
import toast from "react-hot-toast";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function DepartmentModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: DepartmentModalProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      toast.error("Kode dan Nama Departemen wajib diisi");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success(`Departemen ${name} (${code}) berhasil dibuat.`);
      onSubmitSuccess?.();
      onClose();
      setCode("");
      setName("");
    } catch {
      toast.error("Gagal menambahkan departemen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <DialogHeader className="pb-3 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-[#101828]">
            Tambah Departemen Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Kode Departemen <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. POLI-ANAK"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="py-2.5 px-3 h-11 border-gray-200 text-sm rounded-xl"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Nama Departemen <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. Poliklinik Anak"
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
              {isLoading ? "Memproses..." : "Simpan Departemen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
