import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoom } from "@/services/DoctorRegistrationService";
import { CreateRoomRequest } from "@/types/doctorRegistration";
import toast from "react-hot-toast";

export const useUpdateRoom = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, payload }: { roomId: string; payload: Partial<CreateRoomRequest> }) =>
      updateRoom(hospitalId, roomId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", hospitalId] });
    },
  });
};
