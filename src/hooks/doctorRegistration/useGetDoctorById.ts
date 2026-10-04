import { useQuery } from "@tanstack/react-query";
import { getDoctorById } from "@/services/DoctorRegistrationService";
import { DoctorSearchResult } from "@/types/doctorRegistration";
import Cookies from "js-cookie";

export function useGetDoctorById(doctorId?: string, enabled = true, hospitalId?: string) {
  const activeHospitalId = hospitalId || Cookies.get("hospitalId") || "";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["doctor-by-id", activeHospitalId, doctorId],
    queryFn: async () => {
      if (!doctorId || !activeHospitalId) return null;
      const res = await getDoctorById(activeHospitalId, doctorId);
      return res || null;
    },
    enabled: Boolean(doctorId) && Boolean(activeHospitalId) && enabled,
  });

  return {
    doctor: (data as unknown as DoctorSearchResult | null) || null,
    isLoading,
    isError,
    refetch,
  };
}
