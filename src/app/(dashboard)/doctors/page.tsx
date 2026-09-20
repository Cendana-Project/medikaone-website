"use client";

import { useState, useEffect } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Calendar, ShieldCheck, Clock, Eye, Globe, Building2, Trash2 } from "lucide-react";
import { CreateDoctorModal } from "@/components/doctors/CreateDoctorModal";
import { VerifyDoctorModal } from "@/components/doctors/VerifyDoctorModal";
import { ScheduleChangeModal } from "@/components/doctors/ScheduleChangeModal";
import ConfirmModal from "@/components/ui/confirm-modal";
import { useGetDoctors } from "@/hooks/doctorRegistration/useGetDoctors";
import { useGetGlobalDoctors, GlobalDoctorItem } from "@/hooks/doctorRegistration/useGetGlobalDoctors";
import { useDeleteDoctorAffiliation } from "@/hooks/doctorRegistration/useDeleteDoctorAffiliation";
import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo";
import { DoctorAffiliation, DoctorSchedule } from "@/types/doctorRegistration";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DoctorsPage() {
  const router = useRouter();
  const hospitalId = Cookies.get("hospitalId") || "";
  const { userInfo } = useGetUserInfo();

  const userRole = (userInfo?.role || "").toUpperCase().replace(/[-\s]+/g, "_");
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const [activeTab, setActiveTab] = useState<"hospital" | "global">("hospital");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<{ affiliationId: string; doctorName: string; schedules?: DoctorSchedule[] } | null>(null);
  const [deleteAffiliationTarget, setDeleteAffiliationTarget] = useState<DoctorAffiliation | null>(null);

  useEffect(() => {
    if (isSuperAdmin) {
      setActiveTab("global");
    }
  }, [isSuperAdmin]);

  const { doctors: apiDoctors, isLoading: isHospitalLoading, refetch: refetchHospitalDoctors } = useGetDoctors(hospitalId);
  const { doctors: globalDoctors, isLoading: isGlobalLoading } = useGetGlobalDoctors();
  const deleteAffiliationMutation = useDeleteDoctorAffiliation(hospitalId);

  const doctorsList: DoctorAffiliation[] = apiDoctors;

  const handleDeleteAffiliationConfirm = async () => {
    if (!deleteAffiliationTarget) return;
    try {
      const docId = deleteAffiliationTarget.doctor_id || deleteAffiliationTarget.affiliation_id;
      const res = await deleteAffiliationMutation.mutateAsync(docId);
      handleApiSuccess(
        res,
        "Afiliasi Dokter Berhasil Dihapus",
        `Afiliasi dokter ${deleteAffiliationTarget.first_name} ${deleteAffiliationTarget.last_name} di rumah sakit telah diarsipkan.`
      );
      setDeleteAffiliationTarget(null);
      refetchHospitalDoctors();
    } catch (err) {
      handleApiError(err, "Gagal menghapus afiliasi dokter");
    }
  };

  const activeCount = doctorsList.filter((d) => d.status === "ACTIVE").length;
  const suspendedCount = doctorsList.filter((d) => d.status === "SUSPENDED").length;
  const totalCount = doctorsList.length;

  const hospitalColumns: ColumnDef<DoctorAffiliation>[] = [
    {
      key: "sip_number",
      label: "SIP / ID",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-gray-900 text-xs">
          {row.sip_number || row.doctor_id?.slice(0, 8) || "-"}
        </span>
      ),
    },
    {
      key: "first_name",
      label: "Nama Dokter",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-[#EBF8F5] text-[#3BB49F] font-bold text-xs">
              {(row.first_name?.[0] || "D") + (row.last_name?.[0] || "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {row.first_name} {row.last_name}
            </p>
            <p className="text-gray-500 text-xs">{row.email}</p>
          </div>
        </div>
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
            row.status === "ACTIVE"
              ? "bg-[#ECFDF3] text-[#027A48] border-none font-medium text-xs px-3 py-1 rounded-full"
              : "bg-[#FEF3F2] text-[#B42318] border-none font-medium text-xs px-3 py-1 rounded-full"
          }
        >
          • {row.status === "ACTIVE" ? "Aktif (Tersedia)" : "Suspended (Tidak Aktif)"}
        </Badge>
      ),
    },
    {
      key: "specialty",
      label: "Spesialis",
      sortable: true,
      render: (row) => <span className="text-gray-700 font-medium text-xs">{row.specialty || "Umum"}</span>,
    },
    {
      key: "department",
      label: "Departemen & Ruangan",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="text-gray-800 font-medium">{row.department || "-"}</span>
          <span className="text-gray-500">{row.room || "-"}</span>
        </div>
      ),
    },
    {
      key: "action",
      label: "Aksi",
      sortable: false,
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          {/* Eye Icon Action Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/doctors/${row.doctor_id || row.affiliation_id || "doc-1"}/schedule`)}
            title="Lihat Detail & Jadwal 24 Jam"
            className="flex items-center gap-1 px-2.5 h-8 border-[#C4E9E2] text-[#008A72] hover:bg-[#EBF8F5] rounded-lg cursor-pointer text-xs font-medium"
          >
            <Eye className="h-3.5 w-3.5 text-[#3BB49F]" />
            <span className="hidden sm:inline">Detail</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/doctors/${row.doctor_id || row.affiliation_id || "doc-1"}/schedule`)}
            className="flex items-center gap-1.5 px-3 h-8 border-[#C4E9E2] text-[#008A72] hover:bg-[#EBF8F5] rounded-lg cursor-pointer text-xs font-medium"
          >
            <Calendar className="h-3.5 w-3.5 text-[#3BB49F]" />
            <span>Kalender Jadwal</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setScheduleTarget({
                affiliationId: row.affiliation_id || row.doctor_id,
                doctorName: `${row.first_name} ${row.last_name}`,
                schedules: row.schedules || [],
              })
            }
            className="flex items-center gap-1.5 px-3 h-8 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer text-xs font-medium"
          >
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            <span>Ubah Jadwal</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteAffiliationTarget(row)}
            className="flex items-center justify-center p-2 h-8 w-8 border-red-200 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
            title="Hapus Afiliasi Dokter"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const globalColumns: ColumnDef<GlobalDoctorItem>[] = [
    {
      key: "doctor_medikaone_id",
      label: "MedikaOne ID / SIP",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#008A72] font-mono text-xs">
            {row.doctor_medikaone_id || "MDO-SYSTEM"}
          </span>
          <span className="text-[11px] text-gray-500 font-mono">{row.sip_number || "-"}</span>
        </div>
      ),
    },
    {
      key: "first_name",
      label: "Nama Dokter Global",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-teal-50 text-[#3BB49F] font-bold text-xs">
              {(row.first_name?.[0] || "D") + (row.last_name?.[0] || "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {row.full_name || `${row.first_name} ${row.last_name}`}
            </p>
            <p className="text-gray-500 text-xs">{row.email || "Terverifikasi Sistem MedikaOne"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "specialty",
      label: "Spesialisasi",
      sortable: true,
      render: (row) => <span className="text-gray-800 font-medium text-xs">{row.specialty || "Dokter Spesialis"}</span>,
    },
    {
      key: "action",
      label: "Aksi Detail",
      sortable: false,
      align: "center",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/doctors/${row.doctor_id || "doc-1"}/schedule`)}
          className="flex items-center gap-1.5 px-3 h-8 border-[#C4E9E2] text-[#008A72] hover:bg-[#EBF8F5] rounded-lg cursor-pointer text-xs font-medium"
        >
          <Eye className="h-3.5 w-3.5 text-[#3BB49F]" />
          <span>Lihat Profil & Jadwal</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-4 md:p-6">
      {/* Tab Switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#3BB49F]" />
            <span>Manajemen & Direktori Dokter</span>
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Kelola tim medis rumah sakit serta peninjauan direktori dokter nasional MedikaOne.
          </p>
        </div>

        {/* View Mode Tab */}
        <div className="flex items-center bg-gray-100 p-1.5 rounded-xl border border-gray-200 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab("hospital")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "hospital"
                ? "bg-white text-[#008A72] shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Dokter RS Ini</span>
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "global"
                ? "bg-white text-[#008A72] shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Direktori Dokter (Superadmin)</span>
          </button>
        </div>
      </div>

      {/* 3 Top Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total Dokter Aktif
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{activeCount}</span>
            <span className="text-sm font-medium text-gray-500">Dokter</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total Dokter Suspended
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{suspendedCount}</span>
            <span className="text-sm font-medium text-gray-500">Dokter</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {activeTab === "hospital" ? "Total Dokter Terdaftar RS" : "Total Dokter Terdaftar System"}
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">
              {activeTab === "hospital" ? totalCount : globalDoctors.length || totalCount}
            </span>
            <span className="text-sm font-medium text-gray-500">Dokter</span>
          </div>
        </div>
      </div>

      {/* Main DataTable */}
      {activeTab === "hospital" ? (
        <DataTable
          columns={hospitalColumns}
          data={doctorsList}
          keyExtractor={(row) => row.affiliation_id || row.doctor_id}
          searchPlaceholder="Cari Dokter, SIP, atau Spesialis..."
          searchField={(row) => `${row.first_name} ${row.last_name} ${row.email} ${row.sip_number || ""} ${row.specialty || ""}`}
          createButtonLabel="Assign Dokter ke RS"
          createButtonIcon={<UserPlus className="h-4 w-4" />}
          onCreateButtonClick={() => setIsCreateOpen(true)}
          extraHeaderControls={
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsVerifyOpen(true)}
                variant="outline"
                className="border-[#C4E9E2] text-[#3BB49F] hover:bg-[#EBF8F5] text-xs font-medium h-10 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Verifikasi Dokter</span>
              </Button>
              <Button
                onClick={() => router.push("/doctors/schedule-changes")}
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50 text-xs font-medium h-10 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="h-4 w-4" />
                <span>Pengajuan Jadwal</span>
              </Button>
            </div>
          }
          emptyText={isHospitalLoading ? "Memuat data dokter..." : "Tidak ada data dokter yang ditemukan"}
        />
      ) : (
        <DataTable
          columns={globalColumns}
          data={globalDoctors}
          keyExtractor={(row) => row.doctor_id || row.sip_number}
          searchPlaceholder="Cari Dokter Global (Nama, MedikaOne ID, SIP, Spesialis)..."
          searchField={(row) => `${row.first_name} ${row.last_name} ${row.doctor_medikaone_id || ""} ${row.sip_number || ""} ${row.specialty || ""}`}
          emptyText={isGlobalLoading ? "Memuat direktori dokter global..." : "Tidak ada data dokter global yang ditemukan"}
        />
      )}

      {/* Modals */}
      <CreateDoctorModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitSuccess={() => refetchHospitalDoctors()}
      />

      <VerifyDoctorModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        onSubmitSuccess={() => refetchHospitalDoctors()}
      />

      {scheduleTarget && (
        <ScheduleChangeModal
          affiliationId={scheduleTarget.affiliationId}
          doctorName={scheduleTarget.doctorName}
          initialSchedules={scheduleTarget.schedules}
          isOpen={Boolean(scheduleTarget)}
          onClose={() => setScheduleTarget(null)}
          onSubmitSuccess={() => refetchHospitalDoctors()}
        />
      )}

      {/* Confirmation Modal: Delete Doctor Affiliation */}
      <ConfirmModal
        isOpen={Boolean(deleteAffiliationTarget)}
        onClose={() => setDeleteAffiliationTarget(null)}
        onConfirm={handleDeleteAffiliationConfirm}
        isLoading={deleteAffiliationMutation.isPending}
        variant="destructive"
        title="Konfirmasi Hapus Afiliasi Dokter"
        description={`Apakah Anda yakin ingin menghapus afiliasi dokter ${deleteAffiliationTarget?.first_name || ""} ${deleteAffiliationTarget?.last_name || ""} dari rumah sakit ini?`}
        confirmText="Ya, Hapus Afiliasi"
        cancelText="Kembali"
        details={
          deleteAffiliationTarget
            ? [
                { label: "Nama Dokter", value: `${deleteAffiliationTarget.first_name} ${deleteAffiliationTarget.last_name}` },
                { label: "Email", value: deleteAffiliationTarget.email },
                { label: "SIP", value: deleteAffiliationTarget.sip_number || "-" },
                { label: "Spesialis", value: deleteAffiliationTarget.specialty || "-" },
              ]
            : []
        }
      />
    </div>
  );
}
