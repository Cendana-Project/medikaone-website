"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, CheckCircle2, UserCheck } from "lucide-react";
import { EmployeeData } from "./EditEmployeeModal";

interface EmployeeDetailModalProps {
  employee: EmployeeData & { avatar?: string; username?: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEdit?: () => void;
}

export function EmployeeDetailModal({
  employee,
  isOpen,
  onClose,
  onOpenEdit,
}: EmployeeDetailModalProps) {
  if (!employee) return null;

  const initials = employee.name
    ? employee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PG";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-[#008A72] to-[#3BB49F] text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <Avatar className="h-12 w-12 border-2 border-white/40 shadow-sm">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback className="bg-white/20 text-white font-bold text-sm backdrop-blur-md">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">
                  {employee.name}
                </DialogTitle>
                <div className="flex items-center gap-2 text-xs text-emerald-100 mt-0.5 font-mono">
                  <span>@{employee.username || employee.email.split("@")[0]}</span>
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className={
                employee.status === "Active"
                  ? "bg-white/20 text-white border-white/30 text-xs font-semibold px-3 py-1"
                  : "bg-black/20 text-gray-200 border-white/20 text-xs font-semibold px-3 py-1"
              }
            >
              • {employee.status}
            </Badge>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="bg-[#F8FAFC] border border-gray-200 p-4 rounded-xl flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" /> Nama Lengkap
              </span>
              <span className="font-semibold text-gray-900">{employee.name}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" /> Email Address
              </span>
              <span className="font-medium text-gray-800">{employee.email}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-gray-400" /> Role Hak Akses
              </span>
              <span className="font-bold text-[#008A72] bg-[#EBF8F5] px-2.5 py-0.5 rounded border border-[#C4E9E2]">
                {employee.role}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-gray-400" /> Status Akun
              </span>
              <span className="font-semibold text-gray-900">{employee.status}</span>
            </div>
          </div>

          <div className="p-3 bg-[#EBF8F5] border border-[#C4E9E2] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#008A72] font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Akun Terverifikasi Sistem</span>
            </div>
            <span className="text-gray-500 text-[11px]">MedikaOne Identity</span>
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
              Ubah Data Pegawai
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
