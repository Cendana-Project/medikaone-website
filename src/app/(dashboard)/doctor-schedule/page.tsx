"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useHospitalDoctors } from "@/hooks/operations/useOperations";
import { getDoctorSchedules } from "@/services/OperationsService";

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function DoctorSchedulePage() {
  const hospitalId = Cookies.get("hospitalId") || "";
  const { doctors, isLoading } = useHospitalDoctors(hospitalId);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const doctor = doctors.find((item) => item.id === selectedDoctor || item.affiliation_id === selectedDoctor) || doctors[0];
  const schedules = doctor ? getDoctorSchedules(doctor) : [];
  return <div className="p-4 md:p-6"><h1 className="text-xl font-bold">Jadwal Dokter</h1><p className="mt-1 text-sm text-gray-500">Lihat jadwal praktik dan antrean dokter.</p><select value={doctor?.id || ""} onChange={(e) => setSelectedDoctor(e.target.value)} disabled={isLoading} className="mt-5 h-10 w-full max-w-md rounded-md border bg-white px-3 text-sm"><option value="">{isLoading ? "Memuat dokter..." : "Pilih dokter"}</option>{doctors.map((item) => <option key={item.id} value={item.id}>{item.doctor_name || `${item.first_name || ""} ${item.last_name || ""}`.trim()}</option>)}</select>{doctor && <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{schedules.map((slot) => <div key={slot.id || `${slot.start_time}-${slot.end_time}-${JSON.stringify(slot.day_of_week)}`} className="rounded-xl border bg-white p-4"><div className="flex items-center justify-between"><span className="font-semibold">{Array.isArray(slot.day_of_week) ? slot.day_of_week.map((day) => DAYS[day]).join(", ") : DAYS[slot.day_of_week]}</span><Badge variant="outline">{slot.status || "ACTIVE"}</Badge></div><p className="mt-3 flex items-center gap-2 text-sm text-gray-700"><Clock className="h-4 w-4 text-[#008A72]" />{slot.start_time} - {slot.end_time}</p><p className="mt-2 text-xs text-gray-500">{slot.booking_mode === "SESSION_QUEUE" ? `Kapasitas ${slot.capacity || 1} pasien` : `Durasi ${slot.slot_duration_minutes || 30} menit`}</p></div>)}</div>}</div>;
}
