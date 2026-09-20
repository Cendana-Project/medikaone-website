"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Trash2, Eye, Edit } from "lucide-react";
import { DepartmentModal } from "@/components/departments/DepartmentModal";
import { DepartmentDetailModal, DepartmentItem } from "@/components/departments/DepartmentDetailModal";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { useGetDepartments } from "@/hooks/doctorRegistration/useGetDepartments";
import { useDeleteDepartment } from "@/hooks/doctorRegistration/useDeleteDepartment";
import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo";
import { handleApiError } from "@/lib/handleError";
import Cookies from "js-cookie";

export default function DepartmentsPage() {
  const { userInfo } = useGetUserInfo();
  const hospitalId = Cookies.get("hospitalId") || userInfo?.hospitals?.[0]?.id || userInfo?.hospitals?.[0]?.code || "";
  const { departments: apiDepts, refetch } = useGetDepartments(hospitalId);
  const deleteDeptMutation = useDeleteDepartment(hospitalId);

  const [localDepartments, setLocalDepartments] = useState<DepartmentItem[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<DepartmentItem | null>(null);
  const [editItem, setEditItem] = useState<DepartmentItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Exclude local items that are already fetched from the backend API (prevents 2 items bug)
  const localFiltered = localDepartments.filter(
    (loc) => !apiDepts.some((api) => api.id === loc.id || api.code === loc.code)
  );

  const departments: DepartmentItem[] = [
    ...apiDepts.map((d) => ({
      id: d.id,
      code: d.code,
      name: d.name,
      status: "Active" as const,
      createdAt: "Terintegrasi",
    })),
    ...localFiltered,
  ];

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteDeptMutation.mutateAsync(deleteTargetId);
      setLocalDepartments((prev) => prev.filter((d) => d.id !== deleteTargetId));
      setDeleteTargetId(null);
      refetch();
    } catch (err) {
      handleApiError(err, "Gagal menghapus departemen");
    }
  };

  const columns: ColumnDef<DepartmentItem>[] = [
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
        <div className="flex items-center justify-center gap-2">
          {/* Eye Icon Popup */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailItem(row)}
            title="Lihat Detail Departemen"
            className="flex items-center justify-center p-2 h-9 w-9 border-[#C4E9E2] text-[#008A72] hover:bg-[#EBF8F5] rounded-lg cursor-pointer"
          >
            <Eye className="h-4 w-4 text-[#3BB49F]" />
          </Button>

          {/* Edit Icon Popup */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditItem(row)}
            title="Ubah Data Departemen"
            className="flex items-center justify-center p-2 h-9 w-9 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <Edit className="h-4 w-4 text-gray-500" />
          </Button>

          {/* Delete Icon */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteTargetId(row.id)}
            title="Hapus Departemen"
            className="flex items-center justify-center p-2 h-9 w-9 border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-4 md:p-6">
      <DataTable
        columns={columns}
        data={departments}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Cari Departemen..."
        searchField={(row) => `${row.code} ${row.name}`}
        createButtonLabel="Tambah Departemen"
        createButtonIcon={<Plus className="h-4 w-4" />}
        onCreateButtonClick={() => setIsCreateOpen(true)}
        emptyText="Tidak ada departemen yang ditemukan"
      />

      {/* Create Modal */}
      <DepartmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitSuccess={() => {
          refetch();
        }}
      />

      {/* Eye Detail Modal */}
      <DepartmentDetailModal
        department={detailItem}
        isOpen={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
        onOpenEdit={() => {
          setEditItem(detailItem);
          setDetailItem(null);
        }}
      />

      {/* Edit Modal */}
      <DepartmentModal
        initialData={editItem}
        isOpen={Boolean(editItem)}
        onClose={() => setEditItem(null)}
        onSubmitSuccess={() => {
          refetch();
        }}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteDeptMutation.isPending}
        title="Konfirmasi Hapus Departemen"
        subtitle="Apakah Anda yakin ingin menghapus departemen ini?"
        confirmLabel="Hapus Departemen"
      />
    </div>
  );
}
