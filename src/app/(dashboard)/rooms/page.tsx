"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, Plus, Trash2 } from "lucide-react";
import { RoomModal } from "@/components/rooms/RoomModal";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import toast from "react-hot-toast";

interface RoomRow {
  id: string;
  code: string;
  name: string;
  departmentName: string;
  status: "Active" | "Inactive";
}

const INITIAL_ROOMS: RoomRow[] = [
  { id: "1", code: "RNG-BUNGA-1", name: "Ruang Bunga I", departmentName: "Poli anak", status: "Active" },
  { id: "2", code: "RNG-BUNGA-2", name: "Ruang Bunga II", departmentName: "Poli Kandungan", status: "Active" },
  { id: "3", code: "RNG-BUNGA-3", name: "Ruang Bunga III", departmentName: "Poli Penyakit Dalam", status: "Active" },
  { id: "4", code: "RNG-MAWAR-1", name: "Ruang Mawar I", departmentName: "Poli THT (Telinga)", status: "Active" },
  { id: "5", code: "RNG-ANGGREK-1", name: "Ruang Anggrek I", departmentName: "Poli Estetika", status: "Active" },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomRow[]>(INITIAL_ROOMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setRooms((prev) => prev.filter((r) => r.id !== deleteTargetId));
      toast.success("Ruangan berhasil dihapus.");
      setDeleteTargetId(null);
    } catch {
      toast.error("Gagal menghapus ruangan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<RoomRow>[] = [
    {
      key: "code",
      label: "Kode Ruangan",
      sortable: true,
      render: (row) => <span className="font-semibold text-[#3BB49F]">{row.code}</span>,
    },
    {
      key: "name",
      label: "Nama Ruangan",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 font-medium text-gray-900">
          <DoorOpen className="h-4 w-4 text-gray-400" />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      key: "departmentName",
      label: "Departemen",
      sortable: true,
      render: (row) => <span className="text-gray-700 font-medium">{row.departmentName}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge
          variant="outline"
          className="bg-[#ECFDF3] text-[#027A48] border-none font-medium text-xs px-2.5 py-0.5"
        >
          • {row.status}
        </Badge>
      ),
    },
    {
      key: "action",
      label: "Aksi",
      sortable: false,
      align: "center",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteTargetId(row.id)}
          className="flex items-center justify-center p-2 h-9 w-9 border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-6">
      <DataTable
        columns={columns}
        data={rooms}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Cari Ruangan..."
        searchField={(row) => `${row.code} ${row.name} ${row.departmentName}`}
        createButtonLabel="Tambah Ruangan +"
        createButtonIcon={<Plus className="h-4 w-4" />}
        onCreateButtonClick={() => setIsModalOpen(true)}
        emptyText="Tidak ada ruangan yang ditemukan"
      />

      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={() => {
          // Re-fetch rooms
        }}
      />

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        subtitle="Apakah anda yakin menghapus ruangan ini?"
      />
    </div>
  );
}
