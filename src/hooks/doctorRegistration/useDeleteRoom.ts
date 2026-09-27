import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom } from "@/services/DoctorRegistrationService";

export const useDeleteRoom = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => deleteRoom(hospitalId, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", hospitalId] });
    },
  });
};
