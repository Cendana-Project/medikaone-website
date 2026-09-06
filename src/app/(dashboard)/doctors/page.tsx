"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Calendar, ShieldCheck, Trash2 } from "lucide-react";
import { CreateDoctorModal } from "@/components/doctors/CreateDoctorModal";
import { VerifyDoctorModal } from "@/components/doctors/VerifyDoctorModal";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import toast from "react-hot-toast";

interface DoctorRow {
  id: string;
  doctorCode: string;
  name: string;
  email: string;
  avatar?: string;
  status: "Tersedia" | "Sibuk" | "Pending";
  specialty: string;
  roomName: string;
}

const INITIAL_DOCTORS: DoctorRow[] = [
  {
    id: "1",
    doctorCode: "#3066",
    name: "Olivia Rhye",
    email: "olivia@untitledui.com",
    avatar: "/avatars/olivia.png",
    status: "Tersedia",
    specialty: "Kandungan",
    roomName: "Ruang Bunga I",
  },
  {
    id: "2",
    doctorCode: "#3065",
    name: "Phoenix Baker",
    email: "phoenix@untitledui.com",
    avatar: "/avatars/phoenix.png",
    status: "Tersedia",
    specialty: "Kandungan",
    roomName: "Ruang Bunga II",
  },
  {
    id: "3",
    doctorCode: "#3064",
    name: "Lana Steiner",
    email: "lana@untitledui.com",
    avatar: "/avatars/lana.png",
    status: "Sibuk",
    specialty: "Kandungan",
    roomName: "Ruang Bunga II",
  },
  {
    id: "4",
    doctorCode: "#3063",
    name: "Demi Wilkinson",
    email: "demi@untitledui.com",
    avatar: "/avatars/demi.png",
    status: "Sibuk",
    specialty: "Telinga",
    roomName: "Ruang Bunga II",
  },
  {
    id: "5",
    doctorCode: "#3062",
    name: "Candice Wu",
    email: "candice@untitledui.com",
    avatar: "/avatars/candice.png",
    status: "Sibuk",
    specialty: "Telinga",
    roomName: "Ruang Bunga I",
  },
  {
    id: "6",
    doctorCode: "#3061",
    name: "Natali Craig",
    email: "natali@untitledui.com",
    avatar: "/avatars/natalia.png",
    status: "Sibuk",
    specialty: "Telinga",
    roomName: "Ruang Bunga III",
  },
  {
    id: "7",
    doctorCode: "#3059",
    name: "Orlando Diggs",
    email: "orlando@untitledui.com",
    avatar: "/avatars/orlando.png",
    status: "Tersedia",
    specialty: "Telinga",
    roomName: "Ruang Bunga III",
  },
  {
    id: "8",
    doctorCode: "#3057",
    name: "Kate Morrison",
    email: "kate@untitledui.com",
    avatar: "/avatars/kate.png",
    status: "Tersedia",
    specialty: "Kecantikan",
    roomName: "Ruang Bunga I",
  },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorRow[]>(INITIAL_DOCTORS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const availableCount = doctors.filter((d) => d.status === "Tersedia").length;
  const busyCount = doctors.filter((d) => d.status === "Sibuk").length;
  const totalCount = doctors.length;

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setDoctors((prev) => prev.filter((item) => item.id !== deleteTargetId));
      toast.success("Data dokter berhasil dihapus.");
      setDeleteTargetId(null);
    } catch {
      toast.error("Gagal menghapus data dokter.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<DoctorRow>[] = [
    {
      key: "doctorCode",
      label: "ID Dokter",
      sortable: true,
      render: (row) => <span className="font-semibold text-gray-900">{row.doctorCode}</span>,
    },
    {
      key: "name",
      label: "Nama Dokter",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.avatar} alt={row.name} />
            <AvatarFallback className="bg-[#EBF8F5] text-[#3BB49F] font-bold text-xs">
              {row.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">{row.name}</p>
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
            row.status === "Tersedia"
              ? "bg-[#ECFDF3] text-[#027A48] border-none font-medium text-xs px-3 py-1 rounded-full"
              : "bg-[#FEF3F2] text-[#B42318] border-none font-medium text-xs px-3 py-1 rounded-full"
          }
        >
          • {row.status}
        </Badge>
      ),
    },
    {
      key: "specialty",
      label: "Spesialis",
      sortable: true,
      render: (row) => <span className="text-gray-700 font-medium">{row.specialty}</span>,
    },
    {
      key: "roomName",
      label: "Nomor Ruangan",
      sortable: true,
      render: (row) => <span className="text-gray-600">{row.roomName}</span>,
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
            onClick={() => toast(`Atur jadwal untuk Dokter ${row.name}`)}
            className="flex items-center gap-1.5 px-3.5 h-9 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer text-xs font-medium"
          >
            <Calendar className="h-3.5 w-3.5 text-[#3BB49F]" />
            <span>Atur Jadwal</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteTargetId(row.id)}
            className="flex items-center justify-center p-2 h-9 w-9 border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-6">
      {/* 3 Top Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {/* Card 1: Total Dokter Tersedia */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total Dokter Tersedia
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{availableCount}</span>
            <span className="text-sm font-medium text-gray-500">Akun</span>
          </div>
        </div>

        {/* Card 2: Total Dokter Tidak Tersedia */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total Dokter Tidak Tersedia
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{busyCount}</span>
            <span className="text-sm font-medium text-gray-500">Akun</span>
          </div>
        </div>

        {/* Card 3: Total Dokter Terdaftar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total Dokter Terdaftar
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-gray-900">{totalCount}</span>
            <span className="text-sm font-medium text-gray-500">Akun</span>
          </div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={doctors}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Cari Dokter..."
        searchField={(row) => `${row.doctorCode} ${row.name} ${row.email} ${row.specialty} ${row.roomName}`}
        createButtonLabel="Tambah Akun Dokter +"
        createButtonIcon={<UserPlus className="h-4 w-4" />}
        onCreateButtonClick={() => setIsCreateOpen(true)}
        extraHeaderControls={
          <Button
            onClick={() => setIsVerifyOpen(true)}
            variant="outline"
            className="border-[#C4E9E2] text-[#3BB49F] hover:bg-[#EBF8F5] text-xs font-medium h-10 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Verifikasi Dokter</span>
          </Button>
        }
        emptyText="Tidak ada data dokter yang ditemukan"
      />

      {/* Modals */}
      <CreateDoctorModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitSuccess={() => {
          // Re-fetch doctors list
        }}
      />

      <VerifyDoctorModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
