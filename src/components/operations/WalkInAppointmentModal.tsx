"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateWalkInAppointment, useHospitalDoctors } from "@/hooks/operations/useOperations";
import { getDoctorSchedules } from "@/services/OperationsService";
import Cookies from "js-cookie";

export function WalkInAppointmentModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess?: () => void }) {
  const hospitalId = Cookies.get("hospitalId") || "";
  const { doctors } = useHospitalDoctors(hospitalId);
  const mutation = useCreateWalkInAppointment(hospitalId);
  const [doctorId, setDoctorId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"L" | "P">("L");
  const [identityNumber, setIdentityNumber] = useState("");
  const [reason, setReason] = useState("");

  const doctor = doctors.find((item) => item.id === doctorId || item.affiliation_id === doctorId);
  const schedules = doctor ? getDoctorSchedules(doctor).filter((item) => item.status === "ACTIVE" || !item.status) : [];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await mutation.mutateAsync({
      idempotencyKey: crypto.randomUUID(),
      payload: {
        schedule_id: scheduleId,
        patient: { first_name: firstName, last_name: lastName || undefined, phone, date_of_birth: dob, gender, identity_type: "NIK", identity_number: identityNumber },
        reason_for_visit: reason,
        consent_version: "walk-in-consent-v1",
      },
    });
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:w-max bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Buat Appointment Walk-in</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0 sm:min-w-[34rem]">
          <div className="sm:col-span-2"><Label>Dokter</Label><select required value={doctorId} onChange={(e) => { setDoctorId(e.target.value); setScheduleId(""); }} className="mt-1 h-10 w-full rounded-md border px-3 text-sm"><option value="">Pilih dokter</option>{doctors.map((item) => <option key={item.id} value={item.id}>{item.doctor_name || `${item.first_name || ""} ${item.last_name || ""}`.trim()}</option>)}</select></div>
          <div className="sm:col-span-2"><Label>Jadwal hari ini</Label><select required value={scheduleId} onChange={(e) => setScheduleId(e.target.value)} className="mt-1 h-10 w-full rounded-md border px-3 text-sm"><option value="">Pilih jadwal</option>{schedules.filter((item) => item.id).map((item) => <option key={item.id} value={item.id}>{item.start_time} - {item.end_time}</option>)}</select></div>
          <div><Label>Nama depan</Label><Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div><Label>Nama belakang</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
          <div><Label>No. telepon</Label><Input required value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><Label>Tanggal lahir</Label><Input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></div>
          <div><Label>Jenis kelamin</Label><select value={gender} onChange={(e) => setGender(e.target.value as "L" | "P")} className="mt-1 h-10 w-full rounded-md border px-3 text-sm"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
          <div><Label>NIK / Identitas</Label><Input required value={identityNumber} onChange={(e) => setIdentityNumber(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Alasan kunjungan</Label><Input required value={reason} onChange={(e) => setReason(e.target.value)} /></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>Batal</Button><Button disabled={mutation.isPending || !hospitalId}>{mutation.isPending ? "Menyimpan..." : "Buat Appointment"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
