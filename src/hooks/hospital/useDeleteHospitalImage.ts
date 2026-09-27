import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHospitalImage } from "@/services/HospitalService";

export function useDeleteHospitalImage(hospitalId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, imageId }: { id?: string; imageId: string }) => {
            const targetId = id || hospitalId;
            if (!targetId) throw new Error("Hospital ID is required to delete image.");
            return deleteHospitalImage(targetId, imageId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hospital-images"] });
            queryClient.invalidateQueries({ queryKey: ["hospitals"] });
        },
    });
}
