import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom } from "@/services/DoctorRegistrationService";
import toast from "react-hot-toast";

export const useDeleteRoom = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => deleteRoom(hospitalId, roomId),
    onSuccess: () => {
      toast.success("Ruangan berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["rooms", hospitalId] });
    },
  });
};
