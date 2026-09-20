"use client";

import { useState, useMemo } from "react";
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
import { Clock, CheckCircle, XCircle, Eye, AlertCircle, Plus } from "lucide-react";
import { ScheduleChangeRequestItem } from "@/types/doctorRegistration";
import { useGetScheduleChanges } from "@/hooks/doctorRegistration/useGetScheduleChanges";
import { useApproveScheduleChange } from "@/hooks/doctorRegistration/useApproveScheduleChange";
import { useRejectScheduleChange } from "@/hooks/doctorRegistration/useRejectScheduleChange";
import ConfirmModal from "@/components/ui/confirm-modal";
import { StatusFilterDropdown, StatusOption } from "@/components/ui/StatusFilterDropdown";
import { ScheduleChangeModal } from "@/components/doctors/ScheduleChangeModal";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import Cookies from "js-cookie";

const SCHEDULE_CHANGE_STATUS_OPTIONS: StatusOption[] = [
  { value: "PENDING", label: "Pending Persetujuan" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "REJECTED", label: "Ditolak" },
];

export default function DoctorScheduleChangesPage() {
  const hospitalId = Cookies.get("hospitalId") || "";
  const [appliedStatuses, setAppliedStatuses] = useState<string[]>(
    SCHEDULE_CHANGE_STATUS_OPTIONS.map((o) => o.value)
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<ScheduleChangeRequestItem | null>(null);
  const [approveTargetItem, setApproveTargetItem] = useState<ScheduleChangeRequestItem | null>(null);
  const [rejectTargetItem, setRejectTargetItem] = useState<ScheduleChangeRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { scheduleChanges, isLoading, refetch } = useGetScheduleChanges(hospitalId);

  const filteredScheduleChanges = useMemo(() => {
    if (!Array.isArray(scheduleChanges)) return [];
    if (appliedStatuses.length === 0 || appliedStatuses.length === SCHEDULE_CHANGE_STATUS_OPTIONS.length) {
      return scheduleChanges;
    }
    return scheduleChanges.filter((c) => appliedStatuses.includes(c.status));
  }, [scheduleChanges, appliedStatuses]);

  const approveMutation = useApproveScheduleChange(hospitalId);
  const rejectMutation = useRejectScheduleChange(hospitalId);

  const handleApproveConfirm = async () => {
    if (!approveTargetItem) return;
    try {
      const res = await approveMutation.mutateAsync(approveTargetItem.id);
      handleApiSuccess(res, "Perubahan Jadwal Disetujui", "Jadwal praktik dokter berhasil diperbarui.");
      setApproveTargetItem(null);
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
        <TooltipProvider>
          <div className="flex items-center justify-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailItem(row)}
                  className="h-8 w-8 p-0 flex items-center justify-center border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <Eye className="h-4 w-4 text-[#3BB49F]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Rincian Slot Jadwal</p>
              </TooltipContent>
            </Tooltip>

            {row.status === "PENDING" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setApproveTargetItem(row)}
                      disabled={approveMutation.isPending}
                      className="h-8 w-8 p-0 flex items-center justify-center border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Setujui Perubahan Jadwal</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRejectTargetItem(row)}
                      disabled={rejectMutation.isPending}
                      className="h-8 w-8 p-0 flex items-center justify-center border-red-200 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Tolak Perubahan Jadwal</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </TooltipProvider>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Clock className="h-6 w-6 text-[#3BB49F]" />
          <span>Perubahan Jadwal Dokter RS</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola & setujui permintaan pengajuan perubahan jadwal praktik dokter.
        </p>
      </div>

      {/* 3 Top Summary Metric Cards (Styled like /dashboard/roles DashboardCards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <div className="flex flex-col rounded-lg border border-black/10 bg-white shadow-xs transition hover:shadow-md w-full overflow-hidden">
          <div className="bg-gray-50 border-b border-black/10 p-4 px-6 rounded-t-xl">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>Pending Persetujuan</span>
            </p>
          </div>
          <div className="flex-1 flex items-center p-5 px-6">
            <p className="text-3xl font-bold text-gray-900">
              {pendingCount}{" "}
              <span className="text-base font-medium text-gray-500">Pengajuan</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-black/10 bg-white shadow-xs transition hover:shadow-md w-full overflow-hidden">
          <div className="bg-gray-50 border-b border-black/10 p-4 px-6 rounded-t-xl">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Disetujui</span>
            </p>
          </div>
          <div className="flex-1 flex items-center p-5 px-6">
            <p className="text-3xl font-bold text-gray-900">
              {approvedCount}{" "}
              <span className="text-base font-medium text-gray-500">Pengajuan</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-black/10 bg-white shadow-xs transition hover:shadow-md w-full overflow-hidden">
          <div className="bg-gray-50 border-b border-black/10 p-4 px-6 rounded-t-xl">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-red-500" />
              <span>Ditolak</span>
            </p>
          </div>
          <div className="flex-1 flex items-center p-5 px-6">
            <p className="text-3xl font-bold text-gray-900">
              {rejectedCount}{" "}
              <span className="text-base font-medium text-gray-500">Pengajuan</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={filteredScheduleChanges}
        keyExtractor={(row) => row.id}
        createButtonLabel="Buat Pengajuan Jadwal"
        createButtonIcon={<Plus className="h-4 w-4" />}
        onCreateButtonClick={() => setIsCreateOpen(true)}
        extraHeaderControls={
          <StatusFilterDropdown
            title="Filter Status Pengajuan"
            options={SCHEDULE_CHANGE_STATUS_OPTIONS}
            appliedStatuses={appliedStatuses}
            onApply={(newStatuses) => setAppliedStatuses(newStatuses)}
          />
        }
        searchPlaceholder="Cari nama dokter atau alasan..."
        searchField={(row) => `${row.doctor_name || ""} ${row.reason || ""}`}
        emptyText={isLoading ? "Memuat data pengajuan jadwal..." : "Tidak ada data pengajuan perubahan jadwal"}
      />

      {/* Modal Create Schedule Change */}
      <ScheduleChangeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitSuccess={() => refetch()}
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
                {detailItem.schedules?.map((slot, idx) => {
                  const dVal = Array.isArray(slot.day_of_week) ? slot.day_of_week[0] : slot.day_of_week;
                  const dayName = dVal === 0 ? "Minggu" : dVal === 1 ? "Senin" : dVal === 2 ? "Selasa" : dVal === 3 ? "Rabu" : dVal === 4 ? "Kamis" : dVal === 5 ? "Jumat" : "Sabtu";
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-[#EBF8F5] border border-[#C4E9E2] rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#008A72]">
                          Hari {dayName}
                        </span>
                        <span className="text-gray-700 font-medium">
                          {slot.start_time} - {slot.end_time}
                        </span>
                      </div>

                      <div className="text-gray-600 font-normal">
                        Mode: {slot.booking_mode || "FIXED_SLOT"} • Durasi: {slot.slot_duration_minutes || 30} mnt • Max {slot.capacity || 1} pas
                      </div>
                    </div>
                  );
                })}
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

      {/* Confirm Modal Setujui Pengajuan */}
      <ConfirmModal
        isOpen={Boolean(approveTargetItem)}
        onClose={() => setApproveTargetItem(null)}
        onConfirm={handleApproveConfirm}
        isLoading={approveMutation.isPending}
        title="Konfirmasi Persetujuan Perubahan Jadwal"
        description={`Apakah Anda yakin ingin menyetujui pengajuan perubahan jadwal praktik dokter ${approveTargetItem?.doctor_name || ""}?`}
        confirmText="Ya, Setujui"
        cancelText="Batal"
        details={
          approveTargetItem
            ? [
                { label: "Dokter", value: approveTargetItem.doctor_name || "-" },
                { label: "Pihak Pengaju", value: approveTargetItem.requested_by_party === "HOSPITAL" ? "Rumah Sakit" : "Dokter" },
                { label: "Alasan", value: approveTargetItem.reason || "-" },
              ]
            : []
        }
      />

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
