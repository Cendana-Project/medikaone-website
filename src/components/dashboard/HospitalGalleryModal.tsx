"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useGetHospitalImages } from "@/hooks/hospital/useGetHospitalImages";
import { useUploadHospitalImage } from "@/hooks/hospital/useUploadHospitalImage";
import { useUpdateHospitalImage } from "@/hooks/hospital/useUpdateHospitalImage";
import { useDeleteHospitalImage } from "@/hooks/hospital/useDeleteHospitalImage";
import { handleApiError, handleApiSuccess } from "@/lib/handleError";
import ConfirmModal from "@/components/ui/confirm-modal";
import { Image as ImageIcon, Upload, Trash2, Star, CheckCircle, Plus, Info } from "lucide-react";
import Image from "next/image";

interface HospitalGalleryModalProps {
  hospitalId: string;
  hospitalName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function HospitalGalleryModal({
  hospitalId,
  hospitalName,
  isOpen,
  onClose,
}: HospitalGalleryModalProps) {
  const { images, isLoading, refetch } = useGetHospitalImages(hospitalId);
  const uploadMutation = useUploadHospitalImage(hospitalId);
  const updateMutation = useUpdateHospitalImage(hospitalId);
  const deleteMutation = useDeleteHospitalImage(hospitalId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isCover, setIsCover] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        handleApiError(new Error("Ukuran foto maksimal 10 MB."));
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      handleApiError(new Error("Silakan pilih file foto terlebih dahulu."));
      return;
    }

    try {
      const res = await uploadMutation.mutateAsync({
        id: hospitalId,
        payload: {
          image: selectedFile,
          caption: caption || undefined,
          sort_order: sortOrder,
          is_cover: isCover,
        },
      });

      handleApiSuccess(res, "Foto Berhasil Diunggah", "Foto telah ditambahkan ke galeri rumah sakit.");
      setSelectedFile(null);
      setCaption("");
      setSortOrder(0);
      setIsCover(false);
      refetch();
    } catch (err) {
      handleApiError(err, "Gagal mengunggah foto rumah sakit");
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      const res = await updateMutation.mutateAsync({
        id: hospitalId,
        imageId,
        payload: { is_cover: true },
      });
      handleApiSuccess(res, "Cover Berhasil Diperbarui", "Foto pilihan telah dijadikan foto sampul utama.");
      refetch();
    } catch (err) {
      handleApiError(err, "Gagal memperbarui foto cover");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await deleteMutation.mutateAsync({
        id: hospitalId,
        imageId: deleteTargetId,
      });
      handleApiSuccess(res, "Foto Dihapus", "Foto telah dihapus dari galeri rumah sakit.");
      setDeleteTargetId(null);
      refetch();
    } catch (err) {
      handleApiError(err, "Gagal menghapus foto");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl p-0 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-7 pt-7 pb-4 border-b border-gray-100 shrink-0 flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#3BB49F]" />
                <span>Galeri Foto & Cover Rumah Sakit</span>
              </DialogTitle>
              <p className="text-xs text-gray-500 mt-1 font-normal">
                RS: <span className="font-semibold text-gray-800">{hospitalName || hospitalId}</span> (Maksimal 20 Foto)
              </p>
            </div>
            <Badge variant="outline" className="bg-[#EBF8F5] text-[#008A72] border-[#C4E9E2] text-xs font-semibold px-3 py-1">
              {images.length} / 20 Foto
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-6">
            {/* Upload Area */}
            <form onSubmit={handleUpload} className="bg-[#F8FAFC] border border-gray-200 p-4 rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-[#3BB49F]" /> Unggah Foto Galeri Baru
                </span>
                <span className="text-[11px] text-gray-500">Format PNG / JPEG, Maks. 10 MB</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="image-file" className="text-xs font-semibold text-gray-800">
                    Pilih File Foto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="h-10 bg-white border-gray-200 rounded-xl text-xs cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="image-caption" className="text-xs font-semibold text-gray-800">
                    Keterangan / Caption <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                  </Label>
                  <Input
                    id="image-caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Contoh: Tampak depan gedung utama RS"
                    className="h-10 bg-white border-gray-200 rounded-xl text-xs px-3"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label htmlFor="image-cover" className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    id="image-[#cover]"
                    type="checkbox"
                    checked={isCover}
                    onChange={(e) => setIsCover(e.target.checked)}
                    className="h-4 w-4 accent-[#3BB49F] rounded"
                  />
                  <span>Jadikan Foto Sampul Utama (Cover RS)</span>
                </label>

                <Button
                  type="submit"
                  disabled={uploadMutation.isPending || !selectedFile}
                  className="bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-xl px-5 h-9 text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>{uploadMutation.isPending ? "Mengunggah..." : "Unggah Foto"}</span>
                </Button>
              </div>
            </form>

            {/* Gallery Grid */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-gray-500" /> Daftar Foto Tersimpan
              </span>

              {isLoading ? (
                <p className="text-xs text-gray-400 italic text-center py-8">Memuat foto galeri rumah sakit...</p>
              ) : images.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 p-8 rounded-xl flex flex-col items-center justify-center gap-2 text-center text-xs text-gray-400">
                  <Info className="h-8 w-8 text-gray-300" />
                  <p>Belum ada foto galeri yang diunggah untuk rumah sakit ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div className="relative w-full h-36 bg-gray-100 overflow-hidden">
                        {img.url ? (
                          <Image
                            src={img.url}
                            alt={img.caption || "Hospital photo"}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}

                        {img.is_cover && (
                          <Badge className="absolute top-2 left-2 bg-[#3BB49F] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                            <Star className="h-3 w-3 fill-current" /> Cover Utama
                          </Badge>
                        )}
                      </div>

                      <div className="p-3 flex flex-col gap-2">
                        <p className="text-xs font-medium text-gray-800 line-clamp-1">
                          {img.caption || "Tanpa keterangan"}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
                          {!img.is_cover ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetCover(img.id)}
                              disabled={updateMutation.isPending}
                              className="h-7 text-[11px] text-[#008A72] hover:bg-[#EBF8F5] p-1 font-semibold cursor-pointer"
                            >
                              Jadikan Cover
                            </Button>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#008A72] flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Sampul Aktif
                            </span>
                          )}

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTargetId(img.id)}
                            disabled={deleteMutation.isPending}
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-7 py-4 border-t border-gray-100 bg-white flex items-center justify-end shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="py-2 px-6 h-10 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        variant="destructive"
        title="Hapus Foto Galeri"
        description="Apakah Anda yakin ingin menghapus foto ini dari galeri rumah sakit?"
        confirmText="Ya, Hapus Foto"
        cancelText="Batal"
      />
    </>
  );
}
