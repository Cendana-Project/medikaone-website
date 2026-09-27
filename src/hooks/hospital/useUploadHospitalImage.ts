import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadHospitalImage } from "@/services/HospitalService";
import { UploadHospitalImagePayload } from "@/types/hospital";

export function useUploadHospitalImage(hospitalId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id?: string; payload: UploadHospitalImagePayload }) => {
            const targetId = id || hospitalId;
            if (!targetId) throw new Error("Hospital ID is required to upload image.");
            return uploadHospitalImage(targetId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hospital-images"] });
            queryClient.invalidateQueries({ queryKey: ["hospitals"] });
        },
    });
}
