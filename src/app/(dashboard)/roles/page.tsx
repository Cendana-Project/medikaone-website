"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { tableData } from "@/data/dashboard/tableData";
import { CreateEmployeeModal } from "@/components/pegawai/CreateEmployeeModal";
import { EditEmployeeModal, EmployeeData } from "@/components/pegawai/EditEmployeeModal";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import toast from "react-hot-toast";

type Employee = (typeof tableData)[number];

export default function RolesPage() {
  const [data, setData] = useState<Employee[]>(tableData);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setData((prev) => prev.filter((item) => item.id !== deleteTargetId));
      toast.success("Akun pegawai berhasil dihapus.");
      setDeleteTargetId(null);
    } catch {
      toast.error("Gagal menghapus akun pegawai.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Employee>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
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
            <p className="font-medium text-gray-900 leading-tight">{row.name}</p>
            <p className="text-gray-500 text-xs">{row.username}</p>
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
            row.status === "Active"
              ? "bg-[#ECFDF3] text-[#027A48] border-none font-medium text-xs px-2.5 py-0.5"
              : "bg-gray-100 text-gray-600 border-none font-medium text-xs px-2.5 py-0.5"
          }
        >
          • {row.status}
        </Badge>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row) => <span className="font-medium text-gray-700">{row.role}</span>,
    },
    {
      key: "email",
      label: "Email address",
      sortable: true,
      render: (row) => <span className="text-gray-600">{row.email}</span>,
    },
    {
      key: "action",
      label: "Action",
      sortable: false,
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedEmployee({
                id: String(row.id),
                name: row.name,
                email: row.email,
                role: row.role,
                status: row.status,
              });
              setIsEditOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 h-9 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <Edit className="h-3.5 w-3.5 text-[#3BB49F]" />
            <span>Edit</span>
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
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Cari Pegawai..."
        searchField={(row) => `${row.name} ${row.username} ${row.email} ${row.role}`}
        createButtonLabel="Buat Akun Baru +"
        createButtonIcon={<UserPlus className="h-4 w-4" />}
        onCreateButtonClick={() => setIsCreateOpen(true)}
        emptyText="Tidak ada data pegawai yang cocok"
      />

      {/* Modals */}
      <CreateEmployeeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitSuccess={() => {
          // Re-trigger query if connected to backend
        }}
      />

      <EditEmployeeModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedEmployee(null);
        }}
        employeeData={selectedEmployee}
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
