import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHospitalImage } from "@/services/HospitalService";
import { UpdateHospitalImagePayload } from "@/types/hospital";

export function useUpdateHospitalImage(hospitalId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, imageId, payload }: { id?: string; imageId: string; payload: UpdateHospitalImagePayload }) => {
            const targetId = id || hospitalId;
            if (!targetId) throw new Error("Hospital ID is required to update image.");
            return updateHospitalImage(targetId, imageId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hospital-images"] });
            queryClient.invalidateQueries({ queryKey: ["hospitals"] });
        },
    });
}
