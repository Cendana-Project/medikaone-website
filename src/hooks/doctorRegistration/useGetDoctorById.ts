import { useQuery } from "@tanstack/react-query";
import { getDoctorById } from "@/services/DoctorRegistrationService";
import { DoctorSearchResult } from "@/types/doctorRegistration";

export function useGetDoctorById(doctorId?: string, enabled = true) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["doctor-by-id", doctorId],
    queryFn: async () => {
      if (!doctorId) return null;
      const res = await getDoctorById(doctorId);
      return res?.data || res || null;
    },
    enabled: Boolean(doctorId) && enabled,
  });

  return {
    doctor: (data as DoctorSearchResult | null) || null,
    isLoading,
    isError,
    refetch,
  };
}
