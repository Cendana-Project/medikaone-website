"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, CheckCircle2, Tag } from "lucide-react";

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt?: string;
}

interface DepartmentDetailModalProps {
  department: DepartmentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEdit?: () => void;
}

export function DepartmentDetailModal({
  department,
  isOpen,
  onClose,
  onOpenEdit,
}: DepartmentDetailModalProps) {
  if (!department) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-[#008A72] to-[#3BB49F] text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/30">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">
                  {department.name}
                </DialogTitle>
                <div className="flex items-center gap-2 text-xs text-emerald-100 mt-0.5 font-mono">
                  <span>Kode: {department.code}</span>
                </div>
              </div>
            </div>

            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs font-semibold px-3 py-1">
              • {department.status}
            </Badge>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="bg-[#F8FAFC] border border-gray-200 p-4 rounded-xl flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-gray-400" /> Kode Departemen
              </span>
              <span className="font-bold text-[#008A72] bg-[#EBF8F5] px-2.5 py-0.5 rounded border border-[#C4E9E2] font-mono">
                {department.code}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-gray-400" /> Nama Departemen
              </span>
              <span className="font-semibold text-gray-900">{department.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" /> Tanggal Registrasi
              </span>
              <span className="font-semibold text-gray-700">{department.createdAt || "2026-08-01"}</span>
            </div>
          </div>

          <div className="p-3 bg-[#EBF8F5] border border-[#C4E9E2] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#008A72] font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Status Operational Active</span>
            </div>
            <span className="text-gray-500 text-[11px]">MedikaOne System</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="py-2 px-6 h-10 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
          >
            Tutup
          </Button>

          {onOpenEdit && (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onOpenEdit();
              }}
              className="py-2 px-6 h-10 text-xs font-semibold bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-xl cursor-pointer shadow-xs"
            >
              Ubah Departemen
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
