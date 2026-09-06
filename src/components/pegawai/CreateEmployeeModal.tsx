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
import { ImageIcon, Info, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function CreateEmployeeModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: CreateEmployeeModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [role, setRole] = useState("Resepsionis");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 10MB");
        return;
      }
      setPhoto(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan Password wajib diisi");
      return;
    }
    if (password !== rePassword) {
      toast.error("Password dan Konfirmasi Password tidak cocok");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate submission / call hook
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Akun baru berhasil dibuat.");
      onSubmitSuccess?.();
      onClose();
      // Reset form
      setEmail("");
      setPassword("");
      setRePassword("");
      setRole("Resepsionis");
      setPhoto(null);
    } catch {
      toast.error("Gagal membuat akun");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-8 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-[#101828] tracking-tight">
            Buat Akun Baru
          </DialogTitle>
          <p className="text-gray-500 text-sm font-normal mt-1">
            Pastikan identitas akun sesuai dengan user
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="Placeholder..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 px-4 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm focus-visible:ring-[#3BB49F]"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Placeholder..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3 px-4 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm focus-visible:ring-[#3BB49F]"
              required
            />
          </div>

          {/* Re-type Password */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              Re - type password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Placeholder..."
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="py-3 px-4 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm focus-visible:ring-[#3BB49F]"
              required
            />
          </div>

          {/* Role Pegawai Dropdown */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              Role pegawai
            </Label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full py-3 px-4 h-12 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F] appearance-none cursor-pointer"
              >
                <option value="Resepsionis">Resepsionis</option>
                <option value="Perawat">Perawat</option>
                <option value="Admin">Admin RS</option>
                <option value="BOD">Board of Director</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Upload Photo Profil */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-800">
              Upload Photo Profil
            </Label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50/30 flex flex-col items-center justify-center text-center hover:bg-gray-50/70 transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <ImageIcon className="h-5 w-5 text-[#3BB49F]" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {photo ? photo.name : "Geser atau pilih gambar untuk upload"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 italic">
              <Info className="h-3.5 w-3.5" />
              <span>Maksimal file yaitu 10MB dengan format PNG. / JPG.</span>
            </div>
          </div>

          {/* Footer */}
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
              {isLoading ? "Memproses..." : "Daftar Akun"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
