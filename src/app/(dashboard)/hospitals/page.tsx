"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Plus, MapPin, Phone, Search } from "lucide-react";
import { useGetHospitals, HospitalItem } from "@/hooks/hospital/useGetHospitals";
import RegisterHospitalModal from "@/components/dashboard/RegisterHospitalModal";

export default function HospitalsPage() {
  const [search, setSearch] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const { hospitals, isLoading, refetch } = useGetHospitals(search);

  const columns: ColumnDef<HospitalItem>[] = [
    {
      key: "code",
      label: "Kode RS",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-[#008A72] bg-[#EBF8F5] px-2.5 py-1 rounded-md border border-[#C4E9E2] text-xs font-mono">
          {row.code || "-"}
        </span>
      ),
    },
    {
      key: "name",
      label: "Nama Rumah Sakit",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#3BB49F] shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight text-sm">{row.name}</p>
            <p className="text-gray-500 text-xs font-mono">ID: {row.id?.slice(0, 8)}...</p>
          </div>
        </div>
      ),
    },
    {
      key: "city",
      label: "Kota & Provinsi",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span>
            {row.city || "Kota"} {row.province ? `, ${row.province}` : ""}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status Integrasi",
      sortable: false,
      render: () => (
        <Badge variant="outline" className="bg-[#ECFDF3] text-[#027A48] border-[#ABE5C6] text-xs font-medium px-3 py-1 rounded-full">
          • Terdaftar & Aktif
        </Badge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#3BB49F]" />
            <span>Daftar Rumah Sakit Terdaftar</span>
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Kelola data fasilitas kesehatan & rumah sakit yang terintegrasi di MedikaOne.
          </p>
        </div>

        <Button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-[#3BB49F] hover:bg-[#329a88] text-white text-xs font-semibold h-11 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Register Rumah Sakit Baru</span>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-[#3BB49F]" /> Total RS Terdaftar
          </span>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">{hospitals.length}</span>
            <span className="text-xs md:text-sm font-medium text-gray-500">Rumah Sakit</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-500" /> Wilayah Jangkauan
          </span>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">
              {new Set(hospitals.map((h) => h.city).filter(Boolean)).size || 1}
            </span>
            <span className="text-xs md:text-sm font-medium text-gray-500">Kota / Kabupaten</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col justify-between shadow-xs col-span-1 sm:col-span-2 md:col-span-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-indigo-500" /> Status Sistem
          </span>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-lg md:text-xl font-bold text-emerald-600">Online & Active</span>
          </div>
        </div>
      </div>

      {/* Desktop DataTable View */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={hospitals}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Cari Nama Rumah Sakit, Kode RS, atau Kota..."
          searchField={(row) => `${row.name} ${row.code} ${row.city || ""} ${row.province || ""}`}
          emptyText={isLoading ? "Memuat data rumah sakit..." : "Tidak ada data rumah sakit yang ditemukan"}
        />
      </div>

      {/* Mobile Card List View */}
      <div className="flex md:hidden flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari Rumah Sakit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white text-xs border-gray-200 rounded-xl"
          />
        </div>

        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#008A72] bg-[#EBF8F5] px-2 py-0.5 rounded text-xs font-mono border border-[#C4E9E2]">
                  {hospital.code || "HSP-MO"}
                </span>
                <Badge variant="outline" className="bg-[#ECFDF3] text-[#027A48] border-[#ABE5C6] text-[10px]">
                  • Active
                </Badge>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#3BB49F] shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">{hospital.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    {hospital.city || "Kota"} {hospital.province ? `, ${hospital.province}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-xs text-gray-500 bg-white rounded-xl border border-gray-200">
            {isLoading ? "Memuat data rumah sakit..." : "Tidak ada data rumah sakit yang ditemukan"}
          </div>
        )}
      </div>

      {/* Register Modal */}
      <RegisterHospitalModal
        isOpen={isRegisterOpen}
        onClose={() => {
          setIsRegisterOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
