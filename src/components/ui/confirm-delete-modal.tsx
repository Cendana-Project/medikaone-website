"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Informasi",
  subtitle = "Apakah anda yakin menghapus akun ini?",
  confirmLabel = "Hapus Akun",
  isLoading = false,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-white rounded-2xl sm:rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <DialogHeader className="flex flex-col items-center justify-center text-center pt-4 pb-2">
          {/* Circular Soft Red Trash Icon Container */}
          <div className="relative w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="h-8 w-8 text-[#D92D20]" />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
            {title}
          </DialogTitle>
          <p className="text-gray-500 text-sm font-normal px-2">
            {subtitle}
          </p>
        </DialogHeader>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-gray-100 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 h-12 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
          >
            Batalkan
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 h-12 text-sm font-semibold bg-[#D92D20] hover:bg-[#B42318] text-white rounded-xl cursor-pointer shadow-xs"
          >
            {isLoading ? "Memproses..." : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
