"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, CheckCircle, XCircle, Eye, Calendar, UserCheck, AlertCircle } from "lucide-react";
import { ScheduleChangeRequestItem } from "@/types/doctorRegistration";
import { useGetScheduleChanges } from "@/hooks/doctorRegistration/useGetScheduleChanges";
import { useApproveScheduleChange } from "@/hooks/doctorRegistration/useApproveScheduleChange";
import { useRejectScheduleChange } from "@/hooks/doctorRegistration/useRejectScheduleChange";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import Cookies from "js-cookie";

export default function DoctorScheduleChangesPage() {
  const hospitalId = Cookies.get("hospitalId") || "";
  const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");

  const [detailItem, setDetailItem] = useState<ScheduleChangeRequestItem | null>(null);
  const [rejectTargetItem, setRejectTargetItem] = useState<ScheduleChangeRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { scheduleChanges, isLoading, refetch } = useGetScheduleChanges(
    hospitalId,
    selectedStatus === "ALL" ? undefined : selectedStatus
  );

  const approveMutation = useApproveScheduleChange(hospitalId);
  const rejectMutation = useRejectScheduleChange(hospitalId);

  const handleApprove = async (scheduleChangeId: string) => {
    try {
      const res = await approveMutation.mutateAsync(scheduleChangeId);
      handleApiSuccess(res, "Perubahan Jadwal Disetujui", "Jadwal praktik dokter berhasil diperbarui.");
      refetch();
    } catch (err) {
      handleApiError(err, "Gagal menyetujui perubahan jadwal");
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTargetItem) return;
    try {
      const res = await rejectMutation.mutateAsync({
        scheduleChangeId: rejectTargetItem.id,
        reason: rejectReason || undefined,
      });
      handleApiSuccess(res, "Perubahan Jadwal Ditolak", "Permintaan perubahan jadwal ditolak.");
      setRejectTargetItem(null);
      setRejectReason("");
      refetch();
    } catch (err) {
      handleApiError(err, "Gagal menolak perubahan jadwal");
    }
  };

  const pendingCount = scheduleChanges.filter((c) => c.status === "PENDING").length;
  const approvedCount = scheduleChanges.filter((c) => c.status === "APPROVED").length;
  const rejectedCount = scheduleChanges.filter((c) => c.status === "REJECTED").length;

  const columns: ColumnDef<ScheduleChangeRequestItem>[] = [
    {
      key: "doctor_name",
      label: "Nama Dokter",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm">
            {row.doctor_name || "Dokter"}
          </span>
          <span className="text-xs text-gray-500 font-mono">ID: {row.doctor_id?.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      key: "requested_by_party",
      label: "Pihak Pengaju",
      sortable: true,
      render: (row) => (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs px-2.5 py-0.5">
          {row.requested_by_party === "HOSPITAL" ? "Rumah Sakit" : "Dokter"}
        </Badge>
      ),
    },
    {
      key: "reason",
      label: "Alasan Pengajuan",
      sortable: false,
      render: (row) => (
        <span className="text-gray-700 text-xs truncate max-w-[200px] block">
          {row.reason || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge
          variant="outline"
          className={
            row.status === "PENDING"
              ? "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89] font-semibold text-xs px-3 py-1 rounded-full"
              : row.status === "APPROVED"
              ? "bg-[#ECFDF3] text-[#027A48] border-[#ABE5C6] font-semibold text-xs px-3 py-1 rounded-full"
              : "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA] font-semibold text-xs px-3 py-1 rounded-full"
          }
        >
          • {row.status}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Tanggal Pengajuan",
      sortable: true,
      render: (row) => (
        <span className="text-gray-600 text-xs">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Aksi",
      sortable: false,
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailItem(row)}
            className="flex items-center gap-1 px-3 h-8 text-xs border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-[#3BB49F]" />
            <span>Detail Slot</span>
          </Button>

          {row.status === "PENDING" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(row.id)}
                disabled={approveMutation.isPending}
                className="flex items-center gap-1 px-2.5 h-8 text-xs border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                title="Setujui Perubahan"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Setujui</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectTargetItem(row)}
                disabled={rejectMutation.isPending}
                className="flex items-center gap-1 px-2.5 h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                title="Tolak Perubahan"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Tolak</span>
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Clock className="h-6 w-6 text-[#3BB49F]" />
            <span>Perubahan Jadwal Dokter RS</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola & setujui permintaan pengajuan perubahan jadwal praktik dokter.
          </p>
        </div>
      </div>

      {/* 3 Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-500" /> Pending Persetujuan
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{pendingCount}</span>
            <span className="text-sm font-medium text-gray-500">Pengajuan</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-500" /> Disetujui
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{approvedCount}</span>
            <span className="text-sm font-medium text-gray-500">Pengajuan</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-red-500" /> Ditolak
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{rejectedCount}</span>
            <span className="text-sm font-medium text-gray-500">Pengajuan</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["PENDING", "APPROVED", "REJECTED", "ALL"].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedStatus === st
                ? "bg-[#3BB49F] text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {st === "PENDING"
              ? "Pending Persetujuan"
              : st === "APPROVED"
              ? "Disetujui"
              : st === "REJECTED"
              ? "Ditolak"
              : "Semua Status"}
          </button>
        ))}
      </div>

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={scheduleChanges}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Cari nama dokter atau alasan..."
        searchField={(row) => `${row.doctor_name || ""} ${row.reason || ""}`}
        emptyText={isLoading ? "Memuat data pengajuan jadwal..." : "Tidak ada data pengajuan perubahan jadwal"}
      />

      {/* Modal Detail Slot Schedule */}
      <Dialog open={Boolean(detailItem)} onOpenChange={(open) => !open && setDetailItem(null)}>
        <DialogContent className="max-w-lg p-6 bg-white rounded-2xl border border-gray-100 shadow-2xl">
          <DialogHeader className="pb-3 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Rincian Usulan Slot Jadwal
            </DialogTitle>
            <p className="text-xs text-gray-500">Dokter: {detailItem?.doctor_name || "Dokter"}</p>
          </DialogHeader>

          {detailItem && (
            <div className="flex flex-col gap-3 pt-3">
              {detailItem.reason && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <span className="font-semibold text-gray-700 block">Alasan Pengajuan:</span>
                  <p className="text-gray-600 mt-1">{detailItem.reason}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-800">Daftar Slot Jam Praktik:</span>
                {detailItem.schedules?.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#EBF8F5] border border-[#C4E9E2] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#008A72]">
                        Hari {slot.day_of_week === 0 ? "Minggu" : slot.day_of_week === 1 ? "Senin" : slot.day_of_week === 2 ? "Selasa" : slot.day_of_week === 3 ? "Rabu" : slot.day_of_week === 4 ? "Kamis" : slot.day_of_week === 5 ? "Jumat" : "Sabtu"}
                      </span>
                      <span className="text-gray-700 font-medium">
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>

                    <div className="text-gray-600 font-normal">
                      Mode: {slot.booking_mode || "FIXED_SLOT"} • Durasi: {slot.slot_duration_minutes || 30} mnt • Max {slot.capacity || 1} pas
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-100">
                <Button variant="outline" onClick={() => setDetailItem(null)} className="h-10 text-xs">
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Tolak Pengajuan */}
      <Dialog open={Boolean(rejectTargetItem)} onOpenChange={(open) => !open && setRejectTargetItem(null)}>
        <DialogContent className="max-w-md p-6 bg-white rounded-2xl border border-gray-100 shadow-2xl">
          <DialogHeader className="pb-3 border-b border-gray-100">
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Tolak Pengajuan Jadwal</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 pt-3">
            <p className="text-xs text-gray-600">
              Apakah Anda yakin ingin menolak pengajuan jadwal dokter{" "}
              <span className="font-semibold text-gray-900">{rejectTargetItem?.doctor_name}</span>?
            </p>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-gray-800">Alasan Penolakan (Opsional)</span>
              <Input
                type="text"
                placeholder="Contoh: Kapasitas ruangan tidak mencukupi..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="h-10 text-xs bg-gray-50 border-gray-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setRejectTargetItem(null)}
                className="h-10 text-xs"
              >
                Batalkan
              </Button>
              <Button
                onClick={handleRejectConfirm}
                disabled={rejectMutation.isPending}
                className="h-10 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {rejectMutation.isPending ? "Menolak..." : "Konfirmasi Tolak"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
