'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, uploadProfilePhoto, deleteProfilePhoto, UpdateProfilePayload } from "@/services/ProfileService";
import { handleApiError } from "@/lib/handleError";
import toast from "react-hot-toast";

export type MutationOptions = {
    silent?: boolean;
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { payload: UpdateProfilePayload; options?: MutationOptions }) => 
            updateProfile(variables.payload),
        onSuccess: async (res, variables) => {
            if (!variables.options?.silent) {
                const successMsg = 
                    res?.data?.message_detail?.desc_idn || 
                    res?.data?.message_detail?.title_idn || 
                    "Profil Anda berhasil diperbarui.";
                toast.success(successMsg);
            }

            // Refetch / Invalidate user queries so fresh data is fetched from server
            await queryClient.invalidateQueries({ queryKey: ["me"] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal Memperbarui Profil");
        },
    });
};

export const useUploadProfilePhoto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { file: File | Blob; options?: MutationOptions }) => 
            uploadProfilePhoto(variables.file),
        onSuccess: async (res, variables) => {
            if (!variables.options?.silent) {
                const successMsg = 
                    res?.data?.message_detail?.desc_idn || 
                    res?.data?.message_detail?.title_idn || 
                    "Foto profil berhasil diperbarui.";
                toast.success(successMsg);
            }

            // Refetch / Invalidate user photo and profile queries immediately
            await queryClient.invalidateQueries({ queryKey: ["profilePhoto"] });
            await queryClient.invalidateQueries({ queryKey: ["me"] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal Mengunggah Foto Profil");
        },
    });
};

export const useDeleteProfilePhoto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (args?: { options?: MutationOptions }) => {
            void args;
            return deleteProfilePhoto();
        },
        onSuccess: async (res, variables) => {
            if (!variables?.options?.silent) {
                const successMsg = 
                    res?.data?.message_detail?.desc_idn || 
                    res?.data?.message_detail?.title_idn || 
                    "Foto profil berhasil dihapus.";
                toast.success(successMsg);
            }

            // Refetch / Invalidate user photo and profile queries immediately
            await queryClient.invalidateQueries({ queryKey: ["profilePhoto"] });
            await queryClient.invalidateQueries({ queryKey: ["me"] });
        },
        onError: (error) => {
            handleApiError(error, "Gagal Menghapus Foto Profil");
        },
    });
};
