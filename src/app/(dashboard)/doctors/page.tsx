"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Calendar, ShieldCheck, Clock, Eye } from "lucide-react";
import { CreateDoctorModal } from "@/components/doctors/CreateDoctorModal";
import { VerifyDoctorModal } from "@/components/doctors/VerifyDoctorModal";
import { ScheduleChangeModal } from "@/components/doctors/ScheduleChangeModal";
import { DoctorScheduleCalendarModal } from "@/components/doctors/DoctorScheduleCalendarModal";
import { useGetDoctors } from "@/hooks/doctorRegistration/useGetDoctors";
import { DoctorAffiliation } from "@/types/doctorRegistration";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const FALLBACK_DOCTORS: DoctorAffiliation[] = [
  {
    affiliation_id: "aff-1",
    hospital_id: "hsp-1",
    doctor_id: "doc-1",
    first_name: "Olivia",
    last_name: "Rhye",
    email: "olivia@untitledui.com",
    sip_number: "SIP-3174-2026-001",
    specialty: "Kandungan",
    department_id: "dept-1",
    department: "Poli Kandungan",
    room_id: "room-1",
    room: "Ruang Bunga I",
    status: "ACTIVE",
    joined_at: "2026-01-10T00:00:00Z",
    schedules: [
      { day_of_week: 1, start_time: "08:00", end_time: "12:00", timezone: "Asia/Jakarta", booking_mode: "FIXED_SLOT", capacity: 15 },
      { day_of_week: 3, start_time: "13:00", end_time: "17:00", timezone: "Asia/Jakarta", booking_mode: "SESSION_QUEUE", capacity: 20 },
    ],
  },
  {
    affiliation_id: "aff-2",
    hospital_id: "hsp-1",
    doctor_id: "doc-2",
    first_name: "Phoenix",
    last_name: "Baker",
    email: "phoenix@untitledui.com",
    sip_number: "SIP-3174-2026-002",
    specialty: "Kandungan",
    department_id: "dept-1",
    department: "Poli Kandungan",
    room_id: "room-2",
    room: "Ruang Bunga II",
    status: "ACTIVE",
    joined_at: "2026-01-12T00:00:00Z",
    schedules: [
      { day_of_week: 2, start_time: "09:00", end_time: "14:00", timezone: "Asia/Jakarta", booking_mode: "FIXED_SLOT", capacity: 12 },
    ],
  },
  {
    affiliation_id: "aff-3",
    hospital_id: "hsp-1",
    doctor_id: "doc-3",
    first_name: "Lana",
    last_name: "Steiner",
    email: "lana@untitledui.com",
    sip_number: "SIP-3174-2026-003",
    specialty: "Penyakit Dalam",
    department_id: "dept-2",
    department: "Poli Penyakit Dalam",
    room_id: "room-3",
    room: "Ruang Anggrek I",
    status: "SUSPENDED",
    joined_at: "2026-02-01T00:00:00Z",
  },
];

export default function DoctorsPage() {
  const router = useRouter();
  const hospitalId = Cookies.get("hospitalId") || "";

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<{ affiliationId: string; doctorName: string } | null>(null);
  const [calendarTarget, setCalendarTarget] = useState<DoctorAffiliation | null>(null);

  const { doctors: apiDoctors, isLoading, refetch } = useGetDoctors(hospitalId);

  const doctorsList: DoctorAffiliation[] = apiDoctors.length > 0 ? apiDoctors : FALLBACK_DOCTORS;

  const activeCount = doctorsList.filter((d) => d.status === "ACTIVE").length;
  const suspendedCount = doctorsList.filter((d) => d.status === "SUSPENDED").length;
  const totalCount = doctorsList.length;

  const columns: ColumnDef<DoctorAffiliation>[] = [
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCalendarTarget(row)}
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
              })
            }
            className="flex items-center gap-1.5 px-3 h-8 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer text-xs font-medium"
          >
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            <span>Ubah Jadwal</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-6">
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
            Total Dokter Non-Aktif / Suspended
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{suspendedCount}</span>
            <span className="text-sm font-medium text-gray-500">Dokter</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total Dokter Terdaftar
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{totalCount}</span>
            <span className="text-sm font-medium text-gray-500">Dokter</span>
          </div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={doctorsList}
        keyExtractor={(row) => row.affiliation_id || row.doctor_id}
        searchPlaceholder="Cari Dokter, SIP, atau Spesialis..."
        searchField={(row) => `${row.first_name} ${row.last_name} ${row.email} ${row.sip_number || ""} ${row.specialty || ""}`}
        createButtonLabel="Tambahkan Akun Dokter +"
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
        emptyText={isLoading ? "Memuat data dokter..." : "Tidak ada data dokter yang ditemukan"}
      />

      {/* Modals */}
      <CreateDoctorModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitSuccess={() => refetch()}
      />

      <VerifyDoctorModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        onSubmitSuccess={() => refetch()}
      />

      {scheduleTarget && (
        <ScheduleChangeModal
          affiliationId={scheduleTarget.affiliationId}
          doctorName={scheduleTarget.doctorName}
          isOpen={Boolean(scheduleTarget)}
          onClose={() => setScheduleTarget(null)}
          onSubmitSuccess={() => refetch()}
        />
      )}

      {calendarTarget && (
        <DoctorScheduleCalendarModal
          doctorName={`${calendarTarget.first_name} ${calendarTarget.last_name}`}
          specialty={calendarTarget.specialty}
          roomName={calendarTarget.room}
          schedules={calendarTarget.schedules}
          isOpen={Boolean(calendarTarget)}
          onClose={() => setCalendarTarget(null)}
          onOpenEditModal={() => {
            setScheduleTarget({
              affiliationId: calendarTarget.affiliation_id || calendarTarget.doctor_id,
              doctorName: `${calendarTarget.first_name} ${calendarTarget.last_name}`,
            });
            setCalendarTarget(null);
          }}
        />
      )}
    </div>
  );
}
