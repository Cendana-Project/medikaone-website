"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorInvitation } from "@/types/doctorRegistration";
import { useGetContractUrl } from "@/hooks/doctorRegistration/useGetContractUrl";
import { useCancelDoctorInvitation } from "@/hooks/doctorRegistration/useCancelDoctorInvitation";
import { useResendDoctorInvitation } from "@/hooks/doctorRegistration/useResendDoctorInvitation";
import { useDeleteDoctorInvitation } from "@/hooks/doctorRegistration/useDeleteDoctorInvitation";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import ConfirmModal from "@/components/ui/confirm-modal";
import { FileText, Send, XCircle, ExternalLink, Calendar, Clock, MapPin, Building, Trash2 } from "lucide-react";
import Cookies from "js-cookie";

interface DoctorInvitationDetailModalProps {
  invitation: DoctorInvitation | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export function DoctorInvitationDetailModal({
  invitation,
  isOpen,
  onClose,
  onRefresh,
}: DoctorInvitationDetailModalProps) {
  const hospitalId = Cookies.get("hospitalId") || "";
  const [showContractViewer, setShowContractViewer] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"resend" | "cancel" | "delete" | null>(null);

  const { contractData, isLoading: isLoadingContract } = useGetContractUrl(
    hospitalId,
    invitation?.id || "",
    "original"
  );

  const cancelMutation = useCancelDoctorInvitation(hospitalId);
  const resendMutation = useResendDoctorInvitation(hospitalId);
  const deleteMutation = useDeleteDoctorInvitation(hospitalId);

  if (!invitation) return null;

  const contractUrl = contractData?.url;

  const handleCancelConfirm = async () => {
    try {
      const res = await cancelMutation.mutateAsync(invitation.id);
      handleApiSuccess(res, "Undangan Berhasil Dibatalkan", "Undangan dokter telah dibatalkan.");
      setConfirmAction(null);
      onRefresh?.();
      onClose();
    } catch (err) {
      handleApiError(err, "Gagal membatalkan undangan");
    }
  };

  const handleResendConfirm = async () => {
    try {
      const res = await resendMutation.mutateAsync(invitation.id);
      handleApiSuccess(res, "Undangan Berhasil Dikirim Ulang", "Undangan telah dikirim ulang ke email dokter.");
      setConfirmAction(null);
      onRefresh?.();
    } catch (err) {
      handleApiError(err, "Gagal mengirim ulang undangan");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await deleteMutation.mutateAsync(invitation.id);
      handleApiSuccess(res, "Undangan Berhasil Dihapus", "Arsip undangan dokter telah dihapus dari sistem.");
      setConfirmAction(null);
      onRefresh?.();
      onClose();
    } catch (err) {
      handleApiError(err, "Gagal menghapus undangan");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-xl p-8 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-[#101828] tracking-tight">
                Detail Undangan Dokter
              </DialogTitle>
              <p className="text-gray-500 text-xs font-normal mt-1">
                ID Undangan: <span className="font-mono text-gray-700">{invitation.id}</span>
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                invitation.status === "PENDING"
                  ? "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89] font-semibold text-xs px-3 py-1 rounded-full"
                  : invitation.status === "ACCEPTED"
                  ? "bg-[#ECFDF3] text-[#027A48] border-[#ABE5C6] font-semibold text-xs px-3 py-1 rounded-full"
                  : "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA] font-semibold text-xs px-3 py-1 rounded-full"
              }
            >
              • {invitation.status}
            </Badge>
          </DialogHeader>

          <div className="flex flex-col gap-5 pt-4">
            {/* Card Info Dokter */}
            <div className="bg-[#F8FAFC] border border-gray-200 p-4 rounded-xl flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informasi Dokter & Afiliasi RS
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 block">Nama Dokter:</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {invitation.doctor_first_name} {invitation.doctor_last_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Email:</span>
                  <span className="font-medium text-gray-800">{invitation.doctor_email}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Nomor SIP:</span>
                  <span className="font-medium text-gray-800">{invitation.sip_number || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Spesialisasi:</span>
                  <span className="font-medium text-gray-800">{invitation.specialty || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block flex items-center gap-1">
                    <Building className="h-3 w-3 text-gray-400" /> Departemen:
                  </span>
                  <span className="font-medium text-gray-800">{invitation.department_name || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" /> Ruangan:
                  </span>
                  <span className="font-medium text-gray-800">{invitation.room_name || "-"}</span>
                </div>
              </div>

              {invitation.message && (
                <div className="mt-1 pt-2 border-t border-gray-200 text-xs">
                  <span className="text-gray-500 block">Pesan Undangan:</span>
                  <p className="italic text-gray-700 mt-0.5">&ldquo;{invitation.message}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Jadwal Praktik dari Undangan */}
            {invitation.schedules && invitation.schedules.length > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#3BB49F]" />
                  <span>Usulan Jadwal Praktik Mingguan</span>
                </h4>
                <div className="flex flex-col gap-1.5">
                  {invitation.schedules.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-lg text-xs"
                    >
                      <span className="font-semibold text-[#008A72]">
                        Hari {s.day_of_week === 0 ? "Minggu" : s.day_of_week === 1 ? "Senin" : s.day_of_week === 2 ? "Selasa" : s.day_of_week === 3 ? "Rabu" : s.day_of_week === 4 ? "Kamis" : s.day_of_week === 5 ? "Jumat" : "Sabtu"}
                      </span>
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {s.start_time} - {s.end_time} ({s.timezone || "Asia/Jakarta"})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Viewer Kontrak Kerjasama */}
            <div className="flex flex-col gap-2 bg-[#EBF8F5] border border-[#C4E9E2] p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#008A72]">
                  <FileText className="h-4 w-4" />
                  <span>Dokumen PDF Kontrak Kerjasama</span>
                </div>

                {contractUrl && (
                  <a
                    href={contractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#3BB49F] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Buka PDF</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {contractUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContractViewer(!showContractViewer)}
                  className="mt-1 text-xs h-9 border-[#C4E9E2] text-[#008A72] hover:bg-white"
                >
                  {showContractViewer ? "Sembunyikan Preview PDF" : "Tampilkan Preview PDF Kontrak"}
                </Button>
              ) : (
                <p className="text-xs text-gray-500 italic mt-1">
                  {isLoadingContract ? "Memuat tautan dokumen..." : "Dokumen kontrak tidak tersedia atau belum diunggah."}
                </p>
              )}

              {showContractViewer && contractUrl && (
                <div className="mt-2 w-full h-80 rounded-lg overflow-hidden border border-gray-200 bg-white">
                  <iframe src={contractUrl} className="w-full h-full" title="PDF Contract Preview" />
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="py-2.5 px-5 h-11 text-xs font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
                >
                  Tutup
                </Button>

                {invitation.status !== "ACCEPTED" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConfirmAction("delete")}
                    className="py-2.5 px-4 h-11 text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Hapus Undangan</span>
                  </Button>
                )}
              </div>

              {invitation.status === "PENDING" && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConfirmAction("cancel")}
                    disabled={cancelMutation.isPending}
                    className="py-2.5 px-4 h-11 text-xs font-semibold border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Batalkan Undangan</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setConfirmAction("resend")}
                    disabled={resendMutation.isPending}
                    className="py-2.5 px-4 h-11 text-xs font-semibold bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="h-4 w-4" />
                    <span>Kirim Ulang Undangan</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Resend inside Detail */}
      <ConfirmModal
        isOpen={confirmAction === "resend"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleResendConfirm}
        isLoading={resendMutation.isPending}
        title="Konfirmasi Kirim Ulang Undangan"
        description={`Apakah Anda yakin ingin mengirim ulang email undangan pendaftaran ke dokter ${invitation.doctor_first_name} ${invitation.doctor_last_name}?`}
        confirmText="Ya, Kirim Ulang"
        cancelText="Batal"
        details={[
          { label: "Dokter", value: `${invitation.doctor_first_name} ${invitation.doctor_last_name}` },
          { label: "Email", value: invitation.doctor_email },
        ]}
      />

      {/* Confirmation Modal for Cancel inside Detail */}
      <ConfirmModal
        isOpen={confirmAction === "cancel"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleCancelConfirm}
        isLoading={cancelMutation.isPending}
        variant="destructive"
        title="Konfirmasi Batalkan Undangan"
        description={`Apakah Anda yakin ingin membatalkan undangan pendaftaran dokter ${invitation.doctor_first_name} ${invitation.doctor_last_name}?`}
        confirmText="Ya, Batalkan Undangan"
        cancelText="Kembali"
        details={[
          { label: "Dokter", value: `${invitation.doctor_first_name} ${invitation.doctor_last_name}` },
          { label: "Email", value: invitation.doctor_email },
        ]}
      />

      {/* Confirmation Modal for Delete inside Detail */}
      <ConfirmModal
        isOpen={confirmAction === "delete"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        variant="destructive"
        title="Konfirmasi Hapus Undangan"
        description={`Apakah Anda yakin ingin menghapus arsip undangan dokter ${invitation.doctor_first_name} ${invitation.doctor_last_name}?`}
        confirmText="Ya, Hapus Undangan"
        cancelText="Kembali"
        details={[
          { label: "Dokter", value: `${invitation.doctor_first_name} ${invitation.doctor_last_name}` },
          { label: "Email", value: invitation.doctor_email },
          { label: "Status", value: invitation.status },
        ]}
      />
    </>
  );
}
