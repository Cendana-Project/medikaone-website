import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHospital } from "@/services/HospitalService";
import { CreateHospitalRequest } from "@/types/hospital";

export function useUpdateHospital(hospitalId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id?: string; payload: Partial<CreateHospitalRequest> }) => {
            const targetId = id || hospitalId;
            if (!targetId) throw new Error("Hospital ID is required for update.");
            return updateHospital(targetId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hospitals"] });
            queryClient.invalidateQueries({ queryKey: ["hospital"] });
        },
    });
}
