"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Eye, Send, XCircle, ShieldCheck, Mail, Clock, Trash2 } from "lucide-react";
import { DoctorInvitation } from "@/types/doctorRegistration";
import { useGetDoctorInvitations } from "@/hooks/doctorRegistration/useGetDoctorInvitations";
import { useResendDoctorInvitation } from "@/hooks/doctorRegistration/useResendDoctorInvitation";
import { useCancelDoctorInvitation } from "@/hooks/doctorRegistration/useCancelDoctorInvitation";
import { useDeleteDoctorInvitation } from "@/hooks/doctorRegistration/useDeleteDoctorInvitation";
import { CreateDoctorModal } from "@/components/doctors/CreateDoctorModal";
import { DoctorInvitationDetailModal } from "@/components/doctors/DoctorInvitationDetailModal";
import ConfirmModal from "@/components/ui/confirm-modal";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import Cookies from "js-cookie";

export default function DoctorInvitationsPage() {
  const hospitalId = Cookies.get("hospitalId") || "";
  const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<DoctorInvitation | null>(null);
  const [resendTarget, setResendTarget] = useState<DoctorInvitation | null>(null);
  const [cancelTarget, setCancelTarget] = useState<DoctorInvitation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DoctorInvitation | null>(null);

  const { invitations, isLoading, refetch } = useGetDoctorInvitations(
    hospitalId,
    selectedStatus === "ALL" ? undefined : selectedStatus
  );

  const resendMutation = useResendDoctorInvitation(hospitalId);
  const cancelMutation = useCancelDoctorInvitation(hospitalId);
  const deleteMutation = useDeleteDoctorInvitation(hospitalId);

  const handleResendConfirm = async () => {
    if (!resendTarget) return;
    try {
      const res = await resendMutation.mutateAsync(resendTarget.id);
      handleApiSuccess(
        res,
        "Undangan Berhasil Dikirim Ulang",
        `Pemberitahuan undangan baru telah dikirimkan ke email ${resendTarget.doctor_email}.`
      );
      setResendTarget(null);
      refetch();
    } catch (err) {
      handleApiError(err, "Gagal mengirim ulang undangan");
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      const res = await cancelMutation.mutateAsync(cancelTarget.id);
      handleApiSuccess(res, "Undangan Berhasil Dibatalkan");
      setCancelTarget(null);
      refetch();
    } catch (err) {
      handleApiError(err, "Gagal membatalkan undangan");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteMutation.mutateAsync(deleteTarget.id);
      handleApiSuccess(res, "Undangan Berhasil Dihapus", "Arsip undangan dokter telah dihapus.");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      handleApiError(err, "Gagal menghapus undangan");
    }
  };

  const pendingCount = invitations.filter((i: DoctorInvitation) => i.status === "PENDING").length;
  const acceptedCount = invitations.filter((i: DoctorInvitation) => i.status === "ACCEPTED").length;
  const totalCount = invitations.length;

  const columns: ColumnDef<DoctorInvitation>[] = [
    {
      key: "doctor_first_name",
      label: "Dokter",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-[#EBF8F5] text-[#3BB49F] font-bold text-xs">
              {(row.doctor_first_name?.[0] || "D") + (row.doctor_last_name?.[0] || "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {row.doctor_first_name} {row.doctor_last_name}
            </p>
            <p className="text-gray-500 text-xs">{row.doctor_email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "sip_number",
      label: "Nomor SIP",
      sortable: true,
      render: (row) => <span className="text-gray-800 font-medium text-xs">{row.sip_number || "-"}</span>,
    },
    {
      key: "department_name",
      label: "Departemen / Ruangan",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-gray-900">{row.department_name || "-"}</span>
          <span className="text-gray-500">{row.room_name || "-"}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status Undangan",
      sortable: true,
      render: (row) => (
        <Badge
          variant="outline"
          className={
            row.status === "PENDING"
              ? "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89] font-medium text-xs px-3 py-1 rounded-full"
              : row.status === "ACCEPTED"
              ? "bg-[#ECFDF3] text-[#027A48] border-[#ABE5C6] font-medium text-xs px-3 py-1 rounded-full"
              : "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA] font-medium text-xs px-3 py-1 rounded-full"
          }
        >
          • {row.status}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Tanggal Dibuat",
      sortable: true,
      render: (row) => (
        <span className="text-gray-600 text-xs">
          {new Date(row.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
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
            onClick={() => setSelectedInvitation(row)}
            className="flex items-center gap-1.5 px-3 h-8 text-xs border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-[#3BB49F]" />
            <span>Detail</span>
          </Button>

          {row.status === "PENDING" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResendTarget(row)}
                className="flex items-center justify-center p-2 h-8 w-8 border-gray-200 text-[#3BB49F] hover:bg-[#EBF8F5] rounded-lg cursor-pointer"
                title="Kirim Ulang Undangan"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelTarget(row)}
                className="flex items-center justify-center p-2 h-8 w-8 border-amber-200 text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer"
                title="Batalkan Undangan"
              >
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            </>
          )}

          {row.status !== "ACCEPTED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(row)}
              className="flex items-center justify-center p-2 h-8 w-8 border-red-200 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              title="Hapus Undangan"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-6">
      {/* Page Title & Subtitle */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#3BB49F]" />
            <span>Undangan & Verifikasi Dokter</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola daftar undangan pendaftaran dokter terdaftar & verifikasi dokumen kontrak kerjasama RS.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#3BB49F] hover:bg-[#329a88] text-white text-xs font-semibold h-11 px-4 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ Buat Undangan Dokter</span>
        </Button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-500" /> Undangan Pending
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{pendingCount}</span>
            <span className="text-sm font-medium text-gray-500">Undangan</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Diterima (Terverifikasi)
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{acceptedCount}</span>
            <span className="text-sm font-medium text-gray-500">Dokter</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-[#3BB49F]" /> Total Riwayat Undangan
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{totalCount}</span>
            <span className="text-sm font-medium text-gray-500">Data</span>
          </div>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "ALL"].map((st) => (
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
              ? "Undangan Pending"
              : st === "ACCEPTED"
              ? "Diterima / Terverifikasi"
              : st === "REJECTED"
              ? "Ditolak"
              : st === "CANCELLED"
              ? "Dibatalkan"
              : "Semua Status"}
          </button>
        ))}
      </div>

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={invitations}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Cari nama dokter, email, atau NIK/SIP..."
        searchField={(row) => `${row.doctor_first_name} ${row.doctor_last_name} ${row.doctor_email} ${row.sip_number || ""} ${row.department_name || ""}`}
        emptyText={isLoading ? "Memuat data undangan..." : "Tidak ada data undangan dokter yang ditemukan"}
      />

      {/* Modals */}
      <CreateDoctorModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitSuccess={() => refetch()}
      />

      <DoctorInvitationDetailModal
        invitation={selectedInvitation}
        isOpen={Boolean(selectedInvitation)}
        onClose={() => setSelectedInvitation(null)}
        onRefresh={() => refetch()}
      />

      {/* Confirmation Modal: Resend Invitation */}
      <ConfirmModal
        isOpen={Boolean(resendTarget)}
        onClose={() => setResendTarget(null)}
        onConfirm={handleResendConfirm}
        isLoading={resendMutation.isPending}
        title="Konfirmasi Kirim Ulang Undangan"
        description={`Apakah Anda yakin ingin mengirim ulang email undangan pendaftaran ke dokter ${resendTarget?.doctor_first_name || ""} ${resendTarget?.doctor_last_name || ""}?`}
        confirmText="Ya, Kirim Ulang"
        cancelText="Batal"
        details={
          resendTarget
            ? [
                { label: "Dokter", value: `${resendTarget.doctor_first_name} ${resendTarget.doctor_last_name}` },
                { label: "Email", value: resendTarget.doctor_email },
                { label: "Departemen", value: resendTarget.department_name || "-" },
              ]
            : []
        }
      />

      {/* Confirmation Modal: Cancel Invitation */}
      <ConfirmModal
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        isLoading={cancelMutation.isPending}
        variant="destructive"
        title="Konfirmasi Batalkan Undangan"
        description={`Apakah Anda yakin ingin membatalkan undangan pendaftaran untuk dokter ${cancelTarget?.doctor_first_name || ""} ${cancelTarget?.doctor_last_name || ""}?`}
        confirmText="Ya, Batalkan Undangan"
        cancelText="Kembali"
        details={
          cancelTarget
            ? [
                { label: "Dokter", value: `${cancelTarget.doctor_first_name} ${cancelTarget.doctor_last_name}` },
                { label: "Email", value: cancelTarget.doctor_email },
                { label: "SIP", value: cancelTarget.sip_number || "-" },
              ]
            : []
        }
      />

      {/* Confirmation Modal: Delete Invitation */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        variant="destructive"
        title="Konfirmasi Hapus Undangan"
        description={`Apakah Anda yakin ingin menghapus arsip undangan dokter ${deleteTarget?.doctor_first_name || ""} ${deleteTarget?.doctor_last_name || ""}?`}
        confirmText="Ya, Hapus Undangan"
        cancelText="Kembali"
        details={
          deleteTarget
            ? [
                { label: "Dokter", value: `${deleteTarget.doctor_first_name} ${deleteTarget.doctor_last_name}` },
                { label: "Email", value: deleteTarget.doctor_email },
                { label: "Status", value: deleteTarget.status },
              ]
            : []
        }
      />
    </div>
  );
}

