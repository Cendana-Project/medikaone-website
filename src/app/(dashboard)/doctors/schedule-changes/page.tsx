"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Plus,
  User,
  Stethoscope,
  FileText,
  RefreshCw,
  Info,
} from "lucide-react";
import Cookies from "js-cookie";
import { useGetScheduleChanges } from "@/hooks/doctorRegistration/useGetScheduleChanges";
import { useApproveScheduleChange } from "@/hooks/doctorRegistration/useApproveScheduleChange";
import { useRejectScheduleChange } from "@/hooks/doctorRegistration/useRejectScheduleChange";
import { ScheduleChangeProposal } from "@/types/doctorRegistration";
import { ScheduleChangeModal } from "@/components/doctors/ScheduleChangeModal";
import toast from "react-hot-toast";

const DAYS_MAP: Record<number, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

interface ExtractedSlot {
  dayLabel?: string;
  dateLabel?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  bookingMode?: string;
  duration?: number;
  capacity?: number;
  type?: string;
}

export default function ScheduleChangesPage() {
  const hospitalId = Cookies.get("hospitalId") || "";
  const { scheduleChanges: proposals = [], isLoading, refetch } = useGetScheduleChanges(hospitalId);

  const approveMutation = useApproveScheduleChange(hospitalId);
  const rejectMutation = useRejectScheduleChange(hospitalId);

  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<ScheduleChangeProposal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter proposals
  const filteredProposals = proposals.filter((p) => {
    if (activeTab !== "ALL" && p.status !== activeTab) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const docName = (p.doctor_name || "").toLowerCase();
    const spec = (p.specialty || "").toLowerCase();
    const reason = (p.reason || "").toLowerCase();
    return docName.includes(term) || spec.includes(term) || reason.includes(term);
  });

  const pendingCount = proposals.filter((p) => p.status === "PENDING").length;
  const approvedCount = proposals.filter((p) => p.status === "APPROVED").length;
  const rejectedCount = proposals.filter((p) => p.status === "REJECTED").length;

  const handleOpenDetail = (proposal: ScheduleChangeProposal) => {
    setSelectedProposal(proposal);
    setIsDetailOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedProposal) return;
    try {
      await approveMutation.mutateAsync(selectedProposal.id);
      toast.success("Pengajuan perubahan jadwal berhasil disetujui!");
      setIsDetailOpen(false);
      setSelectedProposal(null);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedProposal) return;
    try {
      await rejectMutation.mutateAsync({
        scheduleChangeId: selectedProposal.id,
        reason: rejectReason || undefined,
      });
      toast.success("Pengajuan perubahan jadwal telah ditolak.");
      setIsRejectDialogOpen(false);
      setIsDetailOpen(false);
      setRejectReason("");
      setSelectedProposal(null);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  const getOperationBadge = (op: string) => {
    switch (op) {
      case "ADD":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Jadwal Spesifik (ADD)</Badge>;
      case "REPLACE":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Perubahan Rutin (REPLACE)</Badge>;
      case "REMOVE":
        return <Badge className="bg-rose-100 text-rose-700 border-rose-200">Hapus Slot (REMOVE)</Badge>;
      case "DEACTIVATE":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Nonaktif Sesi (DEACTIVATE)</Badge>;
      default:
        return <Badge variant="outline">{op}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3" /> Menunggu Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Disetujui
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-semibold flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Ditolak
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper to extract slots from groups or schedules array
  const getProposalSlots = (proposal: ScheduleChangeProposal): ExtractedSlot[] => {
    const slots: ExtractedSlot[] = [];

    if (proposal.schedule_groups && proposal.schedule_groups.length > 0) {
      proposal.schedule_groups.forEach((group) => {
        if (group.schedules && group.schedules.length > 0) {
          group.schedules.forEach((s) => {
            const dayNum = Array.isArray(s.day_of_week) ? s.day_of_week[0] : s.day_of_week;
            slots.push({
              dayLabel: dayNum !== undefined && dayNum !== null ? DAYS_MAP[dayNum] : group.day_label,
              dateLabel: s.schedule_date || group.schedule_date,
              startTime: s.start_time || group.start_time,
              endTime: s.end_time || group.end_time,
              timezone: s.timezone || group.timezone || "Asia/Jakarta",
              bookingMode: s.booking_mode || group.booking_mode || "FIXED_SLOT",
              duration: s.slot_duration_minutes || group.slot_duration_minutes || 30,
              capacity: s.capacity || group.capacity || 20,
              type: group.type,
            });
          });
        } else {
          const dayNum = group.day_of_week ? (Array.isArray(group.day_of_week) ? group.day_of_week[0] : group.day_of_week) : undefined;
          slots.push({
            dayLabel: group.display_label || group.day_label || (dayNum !== undefined ? DAYS_MAP[dayNum] : undefined),
            dateLabel: group.schedule_date,
            startTime: group.start_time,
            endTime: group.end_time,
            timezone: group.timezone || "Asia/Jakarta",
            bookingMode: group.booking_mode || "FIXED_SLOT",
            duration: group.slot_duration_minutes || 30,
            capacity: group.capacity || 20,
            type: group.type,
          });
        }
      });
    } else if (proposal.schedules && proposal.schedules.length > 0) {
      proposal.schedules.forEach((s) => {
        const dayNum = Array.isArray(s.day_of_week) ? s.day_of_week[0] : s.day_of_week;
        slots.push({
          dayLabel: dayNum !== undefined && dayNum !== null ? DAYS_MAP[dayNum] : undefined,
          dateLabel: s.schedule_date,
          startTime: s.start_time,
          endTime: s.end_time,
          timezone: s.timezone || "Asia/Jakarta",
          bookingMode: s.booking_mode || "FIXED_SLOT",
          duration: s.slot_duration_minutes || 30,
          capacity: s.capacity || 20,
          type: s.schedule_date ? "SPECIFIC" : "RECURRING",
        });
      });
    }

    return slots;
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Pengajuan Perubahan Jadwal Praktik
            </h1>
            <Badge className="bg-[#EBF8F5] text-[#008A72] border-[#C4E9E2]">
              {proposals.length} Pengajuan
            </Badge>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Kelola persetujuan usulan jadwal praktik dokter (Rutin, Spesifik Bertanggal, & Penonaktifan Sesi)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="h-11 px-4 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-11 px-6 bg-[#008A72] hover:bg-[#007661] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Buat Pengajuan Jadwal</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Total Pengajuan</span>
            <span className="text-2xl font-bold text-gray-900">{proposals.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 bg-white border border-amber-200 rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-amber-700">Menunggu Persetujuan</span>
            <span className="text-2xl font-bold text-amber-900">{pendingCount}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 bg-white border border-emerald-200 rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-emerald-700">Disetujui</span>
            <span className="text-2xl font-bold text-emerald-900">{approvedCount}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 bg-white border border-rose-200 rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-rose-700">Ditolak</span>
            <span className="text-2xl font-bold text-rose-900">{rejectedCount}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <XCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 border border-gray-200 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all ${
              activeTab === "ALL" ? "bg-white text-gray-900 shadow-2xs font-bold" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Semua ({proposals.length})
          </button>
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all ${
              activeTab === "PENDING" ? "bg-amber-500 text-white shadow-2xs font-bold" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Menunggu ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("APPROVED")}
            className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all ${
              activeTab === "APPROVED" ? "bg-[#008A72] text-white shadow-2xs font-bold" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Disetujui ({approvedCount})
          </button>
          <button
            onClick={() => setActiveTab("REJECTED")}
            className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all ${
              activeTab === "REJECTED" ? "bg-rose-600 text-white shadow-2xs font-bold" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Ditolak ({rejectedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari dokter, spesialis, alasan..."
            className="pl-9 pr-4 h-10 bg-gray-50 border-gray-200 rounded-xl text-xs focus-visible:ring-[#008A72]"
          />
        </div>
      </div>

      {/* Proposal Table / Cards */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 text-sm flex flex-col items-center justify-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-[#008A72]" />
            <span>Memuat daftar pengajuan jadwal...</span>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm flex flex-col items-center justify-center gap-2 italic">
            <AlertCircle className="h-8 w-8 text-gray-300" />
            <span>Tidak ada data pengajuan perubahan jadwal yang ditemukan.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Dokter & Spesialisasi</th>
                  <th className="py-3.5 px-4">Operasi Pengajuan</th>
                  <th className="py-3.5 px-4">Alasan Pengajuan</th>
                  <th className="py-3.5 px-4">Tanggal Pengajuan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EBF8F5] text-[#008A72] flex items-center justify-center font-bold text-xs shrink-0">
                          {proposal.doctor_name?.[0] || "D"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">
                            {proposal.doctor_name || "Dokter Spesialis"}
                          </span>
                          <span className="text-[11px] text-gray-500 font-normal">
                            {proposal.specialty || proposal.department_name || "Spesialis MedikaOne"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {getOperationBadge(proposal.operation)}
                    </td>

                    <td className="py-4 px-4 max-w-xs truncate text-gray-700 font-normal">
                      {proposal.reason || <span className="text-gray-400 italic">Tanpa alasan</span>}
                    </td>

                    <td className="py-4 px-4 font-mono text-gray-600">
                      {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString("id-ID") : "-"}
                    </td>

                    <td className="py-4 px-4">
                      {getStatusBadge(proposal.status)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <Button
                        onClick={() => handleOpenDetail(proposal)}
                        className="h-9 px-3.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Detail & Konfirmasi
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Confirmation Modal */}
      {selectedProposal && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="w-max max-w-[calc(100vw-2rem)] p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <DialogHeader className="p-6 bg-linear-to-r from-[#008A72] to-[#3BB49F] text-white shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    Rincian Konfirmasi Pengajuan Jadwal
                  </DialogTitle>
                  <p className="text-emerald-100 text-xs mt-1">
                    Tinjau detail usulan slot waktu sebelum menyetujui atau menolak
                  </p>
                </div>
                {getStatusBadge(selectedProposal.status)}
              </div>
            </DialogHeader>

            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
              {/* Doctor Info Box */}
              <div className="p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-[#008A72] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Nama Dokter</span>
                    <span className="font-bold text-gray-900">{selectedProposal.doctor_name || "Dokter"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Stethoscope className="h-4 w-4 text-[#008A72] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Spesialisasi</span>
                    <span className="font-bold text-gray-900">{selectedProposal.specialty || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Proposal Info & Reason */}
              <div className="p-4 border border-gray-200 rounded-xl flex flex-col gap-2 bg-white text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">Tipe Operasi:</span>
                  {getOperationBadge(selectedProposal.operation)}
                </div>
                <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
                  <span className="font-bold text-gray-700">Alasan Pengajuan:</span>
                  <p className="text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    {selectedProposal.reason || "Tidak ada alasan spesifik dari pengaju."}
                  </p>
                </div>
              </div>

              {/* Proposed Schedules Breakdown / Deactivation Info */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#008A72]" />
                  Rincian Slot Waktu Usulan
                </h4>

                {selectedProposal.operation === "DEACTIVATE" ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs flex flex-col gap-1 text-amber-900">
                    <span className="font-bold flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-amber-600" />
                      Penonaktifan Sesi Jadwal Praktik:
                    </span>
                    <p className="mt-1">
                      Cakupan:{" "}
                      <strong>
                        {selectedProposal.deactivation_scope === "ALL"
                          ? "Seluruh Jadwal Praktik Dokter"
                          : `Jadwal Hari ${
                              selectedProposal.deactivation_day_of_week !== undefined
                                ? DAYS_MAP[selectedProposal.deactivation_day_of_week] || selectedProposal.deactivation_day_of_week
                                : "Tertentu"
                            }`}
                      </strong>
                    </p>
                  </div>
                ) : (
                  (() => {
                    const slots = getProposalSlots(selectedProposal);
                    if (slots.length === 0) {
                      return (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 italic">
                          Tidak ada rincian slot tambahan (penonaktifan massal/rutin).
                        </div>
                      );
                    }

                    return (
                      <div className="flex flex-col gap-2">
                        {slots.map((slot, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 bg-[#EBF8F5] border border-[#C4E9E2] rounded-xl flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 flex-wrap">
                              {slot.dateLabel ? (
                                <span className="font-bold text-[#008A72] bg-white px-2.5 py-1 rounded-lg border border-[#C4E9E2] flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {slot.dateLabel}
                                </span>
                              ) : slot.dayLabel ? (
                                <span className="font-bold text-[#008A72] bg-white px-2.5 py-1 rounded-lg border border-[#C4E9E2]">
                                  Hari {slot.dayLabel}
                                </span>
                              ) : null}

                              {slot.startTime && slot.endTime && (
                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-[#008A72]" />
                                  {slot.startTime} - {slot.endTime} ({slot.timezone || "WIB"})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-gray-600">
                              <span className="font-semibold bg-white/80 px-2 py-0.5 rounded border border-gray-200">
                                {slot.bookingMode || "FIXED_SLOT"}
                              </span>
                              <span>
                                {slot.bookingMode === "FIXED_SLOT"
                                  ? `${slot.duration || 30} m`
                                  : `Max ${slot.capacity || 20} Pasien`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>

            {/* Footer Action Buttons with Terima & Tolak */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
              <Button
                variant="outline"
                onClick={() => setIsDetailOpen(false)}
                className="py-2.5 px-6 h-11 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Tutup
              </Button>

              {selectedProposal.status === "PENDING" && (
                <div className="flex items-center gap-3">
                  {/* Tombol Tolak (Merah) */}
                  <Button
                    type="button"
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={rejectMutation.isPending || approveMutation.isPending}
                    className="py-2.5 px-6 h-11 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Tolak Pengajuan</span>
                  </Button>

                  {/* Tombol Terima (Hijau) */}
                  <Button
                    type="button"
                    onClick={handleApprove}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    className="py-2.5 px-6 h-11 text-xs font-semibold bg-[#008A72] hover:bg-[#007661] text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{approveMutation.isPending ? "Memproses..." : "Terima / Setujui"}</span>
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="w-max max-w-[calc(100vw-2rem)] p-6 bg-white rounded-2xl border border-gray-100 shadow-2xl">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-lg font-bold text-gray-900">Alasan Penolakan Pengajuan</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masukkan alasan penolakan (opsional)..."
              className="h-11 text-xs bg-gray-50 border-gray-200 rounded-xl focus-visible:ring-rose-500"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              className="h-10 px-4 text-xs font-semibold border-gray-200 text-gray-700 rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmReject}
              disabled={rejectMutation.isPending}
              className="h-10 px-6 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
            >
              {rejectMutation.isPending ? "Mengabaikan..." : "Konfirmasi Penolakan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Schedule Change Modal */}
      <ScheduleChangeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={() => refetch()}
      />
    </div>
  );
}
