"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCorrectVitals, useExamination, useFinalizeVitals, useSaveVitalsDraft } from "@/hooks/operations/useOperations";
import { HospitalAppointment, VitalsInput, VitalsRecord } from "@/types/operations";

type NumericField = Exclude<keyof VitalsInput, "nurse_note">;

const NUMERIC_FIELDS: { key: NumericField; label: string; min: number; max: number; step: string }[] = [
  { key: "height_cm", label: "Tinggi (cm)", min: 30, max: 300, step: "0.1" },
  { key: "weight_kg", label: "Berat (kg)", min: 1, max: 1000, step: "0.1" },
  { key: "temperature_c", label: "Suhu (°C)", min: 25, max: 50, step: "0.1" },
  { key: "systolic_mmhg", label: "Sistolik (mmHg)", min: 40, max: 300, step: "1" },
  { key: "diastolic_mmhg", label: "Diastolik (mmHg)", min: 20, max: 200, step: "1" },
  { key: "heart_rate_bpm", label: "Denyut jantung (bpm)", min: 20, max: 300, step: "1" },
  { key: "respiratory_rate_bpm", label: "Napas (per menit)", min: 5, max: 100, step: "1" },
  { key: "oxygen_saturation_percent", label: "SpO₂ (%)", min: 1, max: 100, step: "1" },
];

const toForm = (vitals?: VitalsRecord): Record<string, string> => ({
  ...Object.fromEntries(NUMERIC_FIELDS.map(({ key }) => [key, String(vitals?.[key] ?? "")])),
  nurse_note: vitals?.nurse_note ?? "",
});

const toInput = (form: Record<string, string>): VitalsInput => {
  const input: VitalsInput = {};
  for (const { key } of NUMERIC_FIELDS) {
    if (form[key] !== "") input[key] = Number(form[key]);
  }
  if (form.nurse_note.trim()) input.nurse_note = form.nurse_note.trim();
  return input;
};

export function VitalsModal({ appointment, onClose }: { appointment: HospitalAppointment | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(appointment)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:w-max bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Tanda Vital · {appointment?.patient_name || "-"}</DialogTitle></DialogHeader>
        {appointment && <VitalsForm key={appointment.id} appointment={appointment} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function VitalsForm({ appointment, onClose }: { appointment: HospitalAppointment; onClose: () => void }) {
  const hospitalId = Cookies.get("hospitalId") || "";
  const { examination, isLoading } = useExamination(hospitalId, appointment.id);
  const saveDraft = useSaveVitalsDraft(hospitalId);
  const finalize = useFinalizeVitals(hospitalId);
  const correct = useCorrectVitals(hospitalId);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [reason, setReason] = useState("");

  const isFinal = examination?.vitals?.status === "FINALIZED";
  const form = { ...toForm(examination?.vitals), ...edits };
  const input = toInput(form);
  const hasPressureError = input.systolic_mmhg !== undefined && input.diastolic_mmhg !== undefined && input.systolic_mmhg <= input.diastolic_mmhg;
  const hasContent = Object.keys(input).length > 0;
  const busy = saveDraft.isPending || finalize.isPending || correct.isPending;

  if (isLoading) return <p className="text-sm text-gray-500">Memuat data pemeriksaan...</p>;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isFinal) await correct.mutateAsync({ appointmentId: appointment.id, vitals: input, reason: reason.trim() });
    else await finalize.mutateAsync({ appointmentId: appointment.id, vitals: input });
    onClose();
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0 sm:min-w-[34rem]">
      {examination && (examination.patient_allergies || examination.reason_for_visit) && (
        <div className="sm:col-span-2 rounded-lg bg-[#EBF8F5] p-3 text-sm">
          {examination.reason_for_visit && <p><b>Keluhan:</b> {examination.reason_for_visit}</p>}
          {examination.patient_allergies && <p><b>Alergi:</b> {examination.patient_allergies}</p>}
        </div>
      )}
      {NUMERIC_FIELDS.map(({ key, label, min, max, step }) => (
        <div key={key}>
          <Label>{label}</Label>
          <Input type="number" inputMode="decimal" min={min} max={max} step={step} value={form[key]} onChange={(e) => setEdits({ ...edits, [key]: e.target.value })} />
        </div>
      ))}
      {hasPressureError && <p className="sm:col-span-2 text-xs text-red-600">Sistolik harus lebih besar dari diastolik.</p>}
      {examination?.vitals?.bmi !== undefined && <p className="sm:col-span-2 text-xs text-gray-500">BMI (dihitung server): {examination.vitals.bmi}</p>}
      <div className="sm:col-span-2"><Label>Catatan perawat</Label><Input maxLength={4000} value={form.nurse_note} onChange={(e) => setEdits({ ...edits, nurse_note: e.target.value })} /></div>
      {isFinal && <div className="sm:col-span-2"><Label>Alasan koreksi (wajib)</Label><Input required maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} /></div>}
      <div className="sm:col-span-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Tutup</Button>
        {!isFinal && <Button type="button" variant="outline" disabled={busy || !hasContent || hasPressureError} onClick={() => saveDraft.mutate({ appointmentId: appointment.id, vitals: input })}>Simpan Draft</Button>}
        <Button disabled={busy || !hasContent || hasPressureError || (isFinal && !reason.trim())}>{isFinal ? "Simpan Koreksi" : "Finalisasi"}</Button>
      </div>
    </form>
  );
}
