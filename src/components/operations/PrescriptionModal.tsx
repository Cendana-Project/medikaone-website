"use client";

import Cookies from "js-cookie";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePrescription, usePrescriptionDocumentUrl } from "@/hooks/operations/useOperations";
import { HospitalAppointment } from "@/types/operations";

export function PrescriptionModal({ appointment, onClose }: { appointment: HospitalAppointment | null; onClose: () => void }) {
  const hospitalId = Cookies.get("hospitalId") || "";
  const { prescription, isLoading, isError } = usePrescription(hospitalId, appointment?.id);
  const openPdf = usePrescriptionDocumentUrl(hospitalId);
  const items = prescription?.current_revision?.items || [];

  return (
    <Dialog open={Boolean(appointment)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:w-max bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Resep · {appointment?.patient_name || "-"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 min-w-0 sm:min-w-[30rem] text-sm">
          {isLoading && <p className="text-gray-500">Memuat resep...</p>}
          {isError && <p className="text-gray-500">Resep terbit belum tersedia untuk appointment ini.</p>}
          {prescription && (
            <>
              <p><b>No. resep:</b> {prescription.prescription_number || "-"} · <b>Dokter:</b> {prescription.doctor_name || "-"}</p>
              <ul className="grid gap-2">
                {items.map((item) => (
                  <li key={item.order} className="rounded-lg border p-3">
                    <p className="font-semibold">{item.medication_name} {item.strength}</p>
                    <p className="text-gray-600">{item.dose_amount} {item.dose_unit} · {item.frequency_per_day}x sehari · {item.duration_value} {item.duration_unit} · jumlah {item.quantity} {item.quantity_unit}</p>
                    {item.directions && <p className="text-gray-500">{item.directions}</p>}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end"><Button disabled={openPdf.isPending} onClick={() => appointment && openPdf.mutate(appointment.id)}>Cetak / Buka PDF</Button></div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
