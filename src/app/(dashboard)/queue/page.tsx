"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HospitalAppointment } from "@/types/operations";
import { useAppointmentQueue } from "@/hooks/operations/useOperations";
import { useHospitalDoctors } from "@/hooks/operations/useOperations";
import { VitalsModal } from "@/components/operations/VitalsModal";
import { PrescriptionModal } from "@/components/operations/PrescriptionModal";

export default function QueuePage() {
  const hospitalId = Cookies.get("hospitalId") || "";
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [doctorId, setDoctorId] = useState("");
  const [status, setStatus] = useState("WAITING_VITALS");
  const [vitalsTarget, setVitalsTarget] = useState<HospitalAppointment | null>(null);
  const [prescriptionTarget, setPrescriptionTarget] = useState<HospitalAppointment | null>(null);
  const { doctors } = useHospitalDoctors(hospitalId);
  const { queue, isLoading } = useAppointmentQueue(hospitalId, { date, doctor_id: doctorId || undefined, status: status || undefined, page: 1, limit: 20 });
  const columns: ColumnDef<HospitalAppointment>[] = [
    { key: "queue_number", label: "Nomor Antrean", sortable: true, render: (row) => <span className="font-bold text-[#008A72]">{row.queue_number || "-"}</span> },
    { key: "patient_name", label: "Pasien", sortable: true },
    { key: "doctor_name", label: "Dokter", sortable: true },
    { key: "department_name", label: "Poli", sortable: true },
    { key: "status", label: "Status", render: (row) => <Badge variant="outline">{row.status || "-"}</Badge> },
    { key: "action", label: "Aksi", align: "center", render: (row) => row.status === "WAITING_VITALS" || row.status === "WAITING_DOCTOR"
      ? <button type="button" onClick={() => setVitalsTarget(row)} className="rounded-lg border border-[#C4E9E2] px-3 py-1.5 text-xs font-semibold text-[#008A72] hover:bg-[#EBF8F5]">{row.status === "WAITING_VITALS" ? "Input Vital" : "Koreksi Vital"}</button>
      : row.status === "COMPLETED"
        ? <button type="button" onClick={() => setPrescriptionTarget(row)} className="rounded-lg border border-[#C4E9E2] px-3 py-1.5 text-xs font-semibold text-[#008A72] hover:bg-[#EBF8F5]">Lihat Resep</button>
        : null },
  ];
  return <div className="p-4 md:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-xl font-bold">Antrean Pasien</h1><p className="text-sm text-gray-500">Daftar antrean aktif yang sudah check-in.</p></div><div className="flex flex-wrap gap-2"><select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="h-10 rounded-md border bg-white px-3 text-sm"><option value="">Semua dokter</option>{doctors.map((doctor) => <option key={doctor.affiliation_id || doctor.doctor_id} value={doctor.doctor_id}>{doctor.doctor_name || `${doctor.first_name || ""} ${doctor.last_name || ""}`.trim()}</option>)}</select><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-md border bg-white px-3 text-sm"><option value="WAITING_VITALS">Menunggu vital</option><option value="WAITING_DOCTOR">Menunggu dokter</option><option value="COMPLETED">Selesai</option><option value="">Semua status</option></select><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" /></div></div><div className="mt-5"><DataTable columns={columns} data={queue.items} keyExtractor={(row) => row.id} isLoading={isLoading} emptyText="Tidak ada antrean aktif" searchPlaceholder="Cari pasien, dokter, atau nomor antrean" searchField={(row) => `${row.patient_name || ""} ${row.doctor_name || ""} ${row.queue_number || ""}`} /></div><VitalsModal appointment={vitalsTarget} onClose={() => setVitalsTarget(null)} /><PrescriptionModal appointment={prescriptionTarget} onClose={() => setPrescriptionTarget(null)} /></div>;
}
