"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useConfirmCheckIn, useLookupPatient } from "@/hooks/operations/useOperations";
import { CheckInCandidate } from "@/types/operations";

export default function PatientVerificationPage() {
  const hospitalId = Cookies.get("hospitalId") || "";
  const [identityNumber, setIdentityNumber] = useState("");
  const [dob, setDob] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [candidates, setCandidates] = useState<CheckInCandidate[]>([]);
  const [selected, setSelected] = useState<CheckInCandidate | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const lookup = useLookupPatient(hospitalId);
  const confirm = useConfirmCheckIn(hospitalId);

  const submitLookup = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await lookup.mutateAsync({ appointmentDate: date, identity: { identity_type: "NIK", identity_number: identityNumber, date_of_birth: dob } });
    setCandidates(result);
    setSelected(null);
  };

  const confirmPatient = async () => {
    if (!selected) return;
    await confirm.mutateAsync({ appointmentId: selected.appointment.id, token: selected.check_in_token, overrideReason: selected.late_override_required ? overrideReason : undefined });
    setCandidates([]); setSelected(null); setIdentityNumber(""); setDob(""); setOverrideReason("");
  };

  return <div className="p-4 md:p-6"><div className="max-w-3xl"><h1 className="text-xl font-bold">Verifikasi Pasien</h1><p className="mt-1 text-sm text-gray-500">Cari pasien dengan minimal dua fakta identitas sebelum check-in.</p><form onSubmit={submitLookup} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border bg-white p-5"><div><Label>NIK / Nomor identitas</Label><Input required value={identityNumber} onChange={(e) => setIdentityNumber(e.target.value)} /></div><div><Label>Tanggal lahir</Label><Input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></div><div><Label>Tanggal appointment</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div><div className="sm:col-span-3"><Button disabled={lookup.isPending || !hospitalId}><Search className="h-4 w-4" /> {lookup.isPending ? "Mencari..." : "Cari Pasien"}</Button></div></form>{candidates.length > 0 && <div className="mt-5 grid gap-3">{candidates.map((candidate) => <button type="button" key={candidate.appointment.id} onClick={() => setSelected(candidate)} className={`text-left rounded-xl border p-4 ${selected?.appointment.id === candidate.appointment.id ? "border-[#008A72] bg-[#EBF8F5]" : "bg-white"}`}><div className="flex items-center justify-between"><span className="font-semibold">{candidate.patient.full_name}</span><Badge variant="outline">{candidate.appointment.queue_number || "-"}</Badge></div><p className="mt-1 text-sm text-gray-600">{candidate.appointment.doctor_name || "Dokter"} · {candidate.appointment.appointment_number}</p><p className="mt-1 text-xs text-gray-500">Identitas: {candidate.patient.identity_number_masked || "-"}</p></button>)}</div>}{selected && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-semibold">Konfirmasi pasien</h2><p className="mt-1 text-sm">{selected.patient.full_name} · {selected.appointment.queue_number || "-"}</p>{selected.late_override_required && <div className="mt-3"><Label>Alasan check-in terlambat</Label><Input required value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="Alasan operasional" /></div>}<Button className="mt-4" onClick={confirmPatient} disabled={confirm.isPending || (selected.late_override_required && !overrideReason.trim())}><CheckCircle2 className="h-4 w-4" /> {confirm.isPending ? "Memproses..." : "Konfirmasi Check-in"}</Button></div>}</div></div>;
}
