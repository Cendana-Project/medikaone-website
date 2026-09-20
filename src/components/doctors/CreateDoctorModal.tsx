"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, CheckCircle2, FileText, Upload, Plus, ArrowLeft, ArrowRight, UserCheck } from "lucide-react";
import { DoctorSearchInput } from "./DoctorSearchInput";
import { DoctorSearchResult, DoctorSchedule, Department, Room } from "@/types/doctorRegistration";
import { SchedulePicker } from "./SchedulePicker";
import { useGetDepartments } from "@/hooks/doctorRegistration/useGetDepartments";
import { useGetRooms } from "@/hooks/doctorRegistration/useGetRooms";
import { useCreateDoctorInvitation } from "@/hooks/doctorRegistration/useCreateDoctorInvitation";
import { useCreateDepartment } from "@/hooks/doctorRegistration/useCreateDepartment";
import { useCreateRoom } from "@/hooks/doctorRegistration/useCreateRoom";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface CreateDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function CreateDoctorModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: CreateDoctorModalProps) {
  const { userInfo } = useGetUserInfo();
  const hospitalId = Cookies.get("hospitalId") || userInfo?.hospitals?.[0]?.id || userInfo?.hospitals?.[0]?.code || "";

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorSearchResult | null>(null);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [message, setMessage] = useState<string>("Silakan bergabung dengan tim medis kami.");
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);

  // Quick Create State
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptName, setNewDeptName] = useState("");

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomCode, setNewRoomCode] = useState("");
  const [newRoomName, setNewRoomName] = useState("");

  // React Query Hooks
  const { departments, isLoading: isLoadingDepts, refetch: refetchDepts } = useGetDepartments(hospitalId);
  const { rooms, isLoading: isLoadingRooms, refetch: refetchRooms } = useGetRooms(hospitalId, departmentId);

  const createInvitationMutation = useCreateDoctorInvitation(hospitalId);
  const createDeptMutation = useCreateDepartment(hospitalId);
  const createRoomMutation = useCreateRoom(hospitalId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("File kontrak harus berformat PDF.");
        return;
      }
      setContractFile(file);
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDeptCode || !newDeptName) {
      toast.error("Kode dan Nama Departemen wajib diisi");
      return;
    }
    try {
      const res = await createDeptMutation.mutateAsync({ code: newDeptCode, name: newDeptName });
      handleApiSuccess(res, "Departemen baru berhasil dibuat");
      setShowAddDept(false);
      setNewDeptCode("");
      setNewDeptName("");
      refetchDepts();
      if (res?.data?.id) setDepartmentId(res.data.id);
    } catch (err) {
      handleApiError(err, "Gagal membuat departemen");
    }
  };

  const handleCreateRoom = async () => {
    if (!departmentId) {
      toast.error("Pilih departemen terlebih dahulu sebelum membuat ruangan");
      return;
    }
    if (!newRoomCode || !newRoomName) {
      toast.error("Kode dan Nama Ruangan wajib diisi");
      return;
    }
    try {
      const res = await createRoomMutation.mutateAsync({
        department_id: departmentId,
        code: newRoomCode,
        name: newRoomName,
      });
      handleApiSuccess(res, "Ruangan baru berhasil dibuat");
      setShowAddRoom(false);
      setNewRoomCode("");
      setNewRoomName("");
      refetchRooms();
      if (res?.data?.id) setRoomId(res.data.id);
    } catch (err) {
      handleApiError(err, "Gagal membuat ruangan");
    }
  };

  const handleNextStep = () => {
    if (!selectedDoctor) {
      toast.error("Silakan cari dan pilih dokter terlebih dahulu untuk melanjutkan ke Step 2.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error("Silakan verifikasi dokter terlebih dahulu.");
      setStep(1);
      return;
    }

    try {
      const res = await createInvitationMutation.mutateAsync({
        doctor_id: selectedDoctor.id,
        department_id: departmentId || "33333333-3333-4333-8333-333333333333",
        room_id: roomId || undefined,
        message: message || undefined,
        schedules: schedules.length > 0 ? schedules : undefined,
        contract: contractFile || undefined,
      });

      handleApiSuccess(res, "Dokter Berhasil Di-assign ke RS", "Penugasan dokter ke rumah sakit berhasil diproses.");
      onSubmitSuccess?.();
      onClose();

      // Reset Form State
      setStep(1);
      setSelectedDoctor(null);
      setDepartmentId("");
      setRoomId("");
      setMessage("Silakan bergabung dengan tim medis kami.");
      setContractFile(null);
      setSchedules([]);
    } catch (err) {
      handleApiError(err, "Gagal Meng-assign Dokter");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl md:max-w-4xl p-6 md:p-8 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header with Stepper Progress */}
        <DialogHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <DialogTitle className="text-xl md:text-2xl font-bold text-[#101828] tracking-tight">
                Assign Dokter ke Rumah Sakit
              </DialogTitle>
              <p className="text-gray-500 text-xs md:text-sm font-normal mt-1">
                {step === 1
                  ? "Step 1: Cari dan verifikasi identitas dokter"
                  : "Step 2: Lengkapi penugasan departemen, ruangan, & jadwal praktik"}
              </p>
            </div>

            {/* Stepper Pill Indicator */}
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200 text-xs">
              <span
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  step === 1
                    ? "bg-[#008A72] text-white shadow-2xs"
                    : "text-gray-500 hover:text-gray-900 cursor-pointer"
                }`}
                onClick={() => selectedDoctor && setStep(1)}
              >
                1. Verifikasi Dokter
              </span>
              <span
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  step === 2
                    ? "bg-[#008A72] text-white shadow-2xs"
                    : "text-gray-400"
                }`}
              >
                2. Penugasan & Detail
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* STEP 1: Verifikasi Dokter */}
        {step === 1 && (
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-800">
                Cari Identitas Dokter <span className="text-red-500">*</span>
              </Label>
              <DoctorSearchInput
                selectedDoctor={selectedDoctor}
                onSelectDoctor={(doc) => setSelectedDoctor(doc)}
                placeholder="Masukkan ID Dokter, SIP, NIK, Email, atau Nama Dokter..."
              />
              <p className="text-xs text-gray-400 font-normal">
                Ketik kata kunci untuk mencari data dokter terverifikasi di jaringan nasional MedikaOne.
              </p>

              {/* Selected Doctor Identified Card */}
              {selectedDoctor && (
                <div className="bg-[#EBF8F5] border border-[#C4E9E2] p-4 rounded-xl flex flex-col gap-3 shadow-2xs mt-2">
                  <div className="flex items-center justify-between border-b border-[#C4E9E2] pb-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#008A72] font-bold">
                      <CheckCircle2 className="h-4 w-4 text-[#3BB49F]" />
                      <span>Data Dokter Teridentifikasi & Terverifikasi</span>
                    </div>
                    <span className="text-xs bg-white px-2.5 py-1 rounded border border-[#C4E9E2] font-mono font-semibold text-gray-800">
                      SIP: {selectedDoctor.sip_number || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-800">
                    <div>
                      <span className="text-gray-500 block text-[11px]">Nama Lengkap Dokter:</span>
                      <span className="font-bold text-gray-900 text-sm">
                        {selectedDoctor.first_name} {selectedDoctor.last_name || ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[11px]">Spesialisasi:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedDoctor.specialty || "Dokter Spesialis"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions Step 1 */}
            <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="py-3 px-6 h-11 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
              >
                Batalkan
              </Button>

              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!selectedDoctor}
                className="py-3 px-8 h-11 text-xs font-semibold bg-[#008A72] hover:bg-[#007661] text-white rounded-xl cursor-pointer shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowRight className="h-4 w-4" />
                <span>Lanjut ke Step 2 (Penugasan)</span>
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Penugasan RS (Membawa Data Dokter Step 1) */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
            {/* Carried-Over Doctor Banner Header */}
            {selectedDoctor && (
              <div className="bg-[#EBF8F5] border border-[#C4E9E2] p-3.5 rounded-xl flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#3BB49F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#008A72] font-semibold block">Dokter Terpilih (Step 1):</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {selectedDoctor.first_name} {selectedDoctor.last_name || ""}
                    </span>
                    <span className="text-gray-600 font-mono ml-2">
                      ({selectedDoctor.sip_number || "SIP-3174-2026"})
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="h-8 px-3 text-[11px] font-semibold text-[#008A72] border-[#C4E9E2] bg-white hover:bg-[#EBF8F5] rounded-lg shrink-0 cursor-pointer"
                >
                  Ganti Dokter
                </Button>
              </div>
            )}

            {/* Departemen Dropdown */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-800">
                  Departemen / Poli <span className="text-red-500">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowAddDept(!showAddDept)}
                  className="text-xs text-[#3BB49F] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Buat Departemen Baru</span>
                </button>
              </div>

              {showAddDept && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <Input
                    type="text"
                    placeholder="Kode (mis. POLI-ANAK)"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className="h-9 text-xs bg-white"
                  />
                  <Input
                    type="text"
                    placeholder="Nama Departemen"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="h-9 text-xs bg-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateDepartment}
                    disabled={createDeptMutation.isPending}
                    className="h-9 px-3 bg-[#3BB49F] hover:bg-[#329a88] text-white text-xs shrink-0 cursor-pointer"
                  >
                    Simpan
                  </Button>
                </div>
              )}

              <div className="relative">
                <select
                  value={departmentId}
                  onChange={(e) => {
                    setDepartmentId(e.target.value);
                    setRoomId("");
                  }}
                  disabled={isLoadingDepts}
                  className="w-full py-3 px-4 h-12 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F] appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Departemen --</option>
                  {departments.map((dept: Department) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Ruangan Dropdown */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-800">
                  Ruangan Praktik
                </Label>
                {departmentId && (
                  <button
                    type="button"
                    onClick={() => setShowAddRoom(!showAddRoom)}
                    className="text-xs text-[#3BB49F] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Buat Ruangan Baru</span>
                  </button>
                )}
              </div>

              {showAddRoom && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <Input
                    type="text"
                    placeholder="Kode (mis. R-BUNGA-1)"
                    value={newRoomCode}
                    onChange={(e) => setNewRoomCode(e.target.value)}
                    className="h-9 text-xs bg-white"
                  />
                  <Input
                    type="text"
                    placeholder="Nama Ruangan"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="h-9 text-xs bg-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateRoom}
                    disabled={createRoomMutation.isPending}
                    className="h-9 px-3 bg-[#3BB49F] hover:bg-[#329a88] text-white text-xs shrink-0 cursor-pointer"
                  >
                    Simpan
                  </Button>
                </div>
              )}

              <div className="relative">
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  disabled={isLoadingRooms}
                  className="w-full py-3 px-4 h-12 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3BB49F] appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Ruangan --</option>
                  {rooms.map((room: Room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Dokumen Kontrak Kerjasama PDF Upload */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-800 flex items-center justify-between">
                <span>Dokumen Kontrak Kerjasama</span>
                <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
              </Label>
              <div className="relative border-2 border-dashed border-gray-200 hover:border-[#3BB49F] rounded-xl p-3.5 transition-colors text-center bg-gray-50/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {contractFile ? (
                  <div className="flex items-center gap-2 text-[#008A72] font-semibold text-xs bg-[#EBF8F5] px-3 py-1.5 rounded-lg border border-[#C4E9E2]">
                    <FileText className="h-4 w-4" />
                    <span>{contractFile.name} ({(contractFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-gray-400" />
                    <p className="text-xs text-gray-600 font-medium">
                      Upload file PDF kontrak kerjasama (Opsional)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Pesan Undangan */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-gray-800 flex items-center justify-between">
                <span>Pesan Undangan</span>
                <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
              </Label>
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Pesan selamat datang untuk dokter..."
                className="py-3 px-4 h-11 bg-gray-50/50 border-gray-200 rounded-xl text-sm focus-visible:ring-[#3BB49F]"
              />
            </div>

            {/* Collapsible Interactive Schedule Picker */}
            <SchedulePicker schedules={schedules} onChange={setSchedules} />

            {/* Step 2 Footer Actions */}
            <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={createInvitationMutation.isPending}
                className="py-3 px-6 h-12 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Step 1</span>
              </Button>

              <Button
                type="submit"
                disabled={createInvitationMutation.isPending}
                className="py-3 px-8 h-12 text-sm font-semibold bg-[#008A72] hover:bg-[#007661] text-white rounded-xl cursor-pointer shadow-xs"
              >
                {createInvitationMutation.isPending ? "Memproses..." : "Assign Dokter ke RS"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
