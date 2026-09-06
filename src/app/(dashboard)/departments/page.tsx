"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Trash2 } from "lucide-react";
import { DepartmentModal } from "@/components/departments/DepartmentModal";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import toast from "react-hot-toast";

interface DepartmentRow {
  id: string;
  code: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

const INITIAL_DEPARTMENTS: DepartmentRow[] = [
  { id: "1", code: "POLI-ANAK", name: "Poli anak", status: "Active", createdAt: "2026-08-01" },
  { id: "2", code: "POLI-KANDUNGAN", name: "Poli Kandungan", status: "Active", createdAt: "2026-08-05" },
  { id: "3", code: "POLI-[#3064]", name: "Poli Penyakit Dalam", status: "Active", createdAt: "2026-08-10" },
  { id: "4", code: "POLI-THT", name: "Poli THT (Telinga)", status: "Active", createdAt: "2026-08-15" },
  { id: "5", code: "POLI-ESTETIKA", name: "Poli Estetika / Kecantikan", status: "Active", createdAt: "2026-08-20" },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentRow[]>(INITIAL_DEPARTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setDepartments((prev) => prev.filter((d) => d.id !== deleteTargetId));
      toast.success("Departemen berhasil dihapus.");
      setDeleteTargetId(null);
    } catch {
      toast.error("Gagal menghapus departemen.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<DepartmentRow>[] = [
    {
      key: "code",
      label: "Kode Departemen",
      sortable: true,
      render: (row) => <span className="font-semibold text-[#3BB49F]">{row.code}</span>,
    },
    {
      key: "name",
      label: "Nama Departemen",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 font-medium text-gray-900">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span>{row.name}</span>
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
          className="bg-[#ECFDF3] text-[#027A48] border-none font-medium text-xs px-2.5 py-0.5"
        >
          • {row.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Tanggal Dibuat",
      sortable: true,
      render: (row) => <span className="text-gray-500 text-xs">{row.createdAt}</span>,
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
        data={departments}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Cari Departemen..."
        searchField={(row) => `${row.code} ${row.name}`}
        createButtonLabel="Tambah Departemen +"
        createButtonIcon={<Plus className="h-4 w-4" />}
        onCreateButtonClick={() => setIsModalOpen(true)}
        emptyText="Tidak ada departemen yang ditemukan"
      />

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={() => {
          // Re-fetch departments
        }}
      />

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        subtitle="Apakah anda yakin menghapus departemen ini?"
      />
    </div>
  );
}
