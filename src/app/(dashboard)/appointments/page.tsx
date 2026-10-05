"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Plus, Eye, XCircle } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WalkInAppointmentModal } from "@/components/operations/WalkInAppointmentModal";
import { useAppointments, useCancelAppointment } from "@/hooks/operations/useOperations";
import { HospitalAppointment } from "@/types/operations";

export default function AppointmentsPage() {
  const hospitalId = Cookies.get("hospitalId") || "";
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<HospitalAppointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<HospitalAppointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const { appointments, isLoading, refetch } = useAppointments(hospitalId, date);
  const cancelMutation = useCancelAppointment(hospitalId);

  const columns: ColumnDef<HospitalAppointment>[] = [
    { key: "queue_number", label: "Antrean", sortable: true, render: (row) => <span className="font-bold text-[#008A72]">{row.queue_number || "-"}</span> },
    { key: "patient_name", label: "Pasien", sortable: true, render: (row) => <span className="font-medium">{row.patient_name || "-"}</span> },
    { key: "doctor_name", label: "Dokter", sortable: true, render: (row) => <span>{row.doctor_name || "-"}</span> },
    { key: "appointment_date", label: "Tanggal", sortable: true },
    { key: "status", label: "Status", sortable: true, render: (row) => <Badge variant="outline">{row.status || "-"}</Badge> },
    { key: "actions", label: "Aksi", align: "center", render: (row) => <div className="flex justify-center gap-2"><Button variant="outline" size="sm" onClick={() => setDetail(row)} title="Detail"><Eye className="h-4 w-4" /></Button>{["CONFIRMED", "RESCHEDULED"].includes(row.status || "") && <Button variant="outline" size="sm" className="text-red-600" onClick={() => setCancelTarget(row)} title="Batalkan"><XCircle className="h-4 w-4" /></Button>}</div> },
  ];

  const confirmCancel = async () => {
    if (!cancelTarget || !cancelReason.trim()) return;
    await cancelMutation.mutateAsync({ appointmentId: cancelTarget.id, reason: cancelReason });
    setCancelTarget(null); setCancelReason("");
  };

  return <div className="flex flex-col gap-5 p-4 md:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-xl font-bold text-gray-900">Appointment</h1><p className="text-sm text-gray-500">Buat, lihat, dan batalkan appointment rumah sakit.</p></div><Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Buat Appointment</Button></div><div className="flex items-center gap-3"><label className="text-sm font-medium">Tanggal</label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" /></div><DataTable columns={columns} data={appointments} keyExtractor={(row) => row.id} isLoading={isLoading} loadingText="Memuat appointment..." emptyText="Tidak ada appointment pada tanggal ini" searchPlaceholder="Cari appointment..." searchField={(row) => `${row.patient_name || ""} ${row.doctor_name || ""} ${row.queue_number || ""}`} /><WalkInAppointmentModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSuccess={() => refetch()} /><Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}><DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:w-max bg-white"><DialogHeader><DialogTitle>Detail Appointment</DialogTitle></DialogHeader>{detail && <div className="grid gap-2 text-sm min-w-0 sm:min-w-[24rem]"><p><b>Pasien:</b> {detail.patient_name || "-"}</p><p><b>Dokter:</b> {detail.doctor_name || "-"}</p><p><b>Nomor antrean:</b> {detail.queue_number || "-"}</p><p><b>Status:</b> {detail.status || "-"}</p><p><b>Appointment:</b> {detail.appointment_number || detail.id}</p></div>}</DialogContent></Dialog><Dialog open={Boolean(cancelTarget)} onOpenChange={(open) => !open && setCancelTarget(null)}><DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:w-max bg-white"><DialogHeader><DialogTitle>Batalkan Appointment</DialogTitle></DialogHeader><div className="grid gap-3"><p className="text-sm text-gray-600">Alasan pembatalan wajib diisi untuk audit.</p><Input placeholder="Alasan pembatalan" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} /><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setCancelTarget(null)}>Batal</Button><Button variant="destructive" disabled={cancelMutation.isPending || !cancelReason.trim()} onClick={confirmCancel}>Konfirmasi</Button></div></div></DialogContent></Dialog></div>;
}
