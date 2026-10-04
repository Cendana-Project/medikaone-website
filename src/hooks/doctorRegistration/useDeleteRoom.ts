import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom } from "@/services/DoctorRegistrationService";
import { handleApiError } from "@/lib/handleError";

export const useDeleteRoom = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => deleteRoom(hospitalId, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", hospitalId] });
    },
    onError: (error) => {
      handleApiError(error, "Gagal menghapus ruangan");
    },
  });
};
