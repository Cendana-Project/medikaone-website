import { useQuery } from "@tanstack/react-query";
import { getGlobalDoctors } from "@/services/DoctorRegistrationService";

export interface GlobalDoctorItem {
  doctor_id: string;
  doctor_medikaone_id?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  sip_number: string;
  specialty: string;
  email?: string;
  phone?: string;
}

export function useGetGlobalDoctors(params?: {
  page?: number;
  limit?: number;
  q?: string;
  specialty?: string;
  hospital_id?: string;
}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["global-doctors", params],
    queryFn: async () => {
      const res = await getGlobalDoctors(params);
      const items = res?.data?.items || res?.data || [];
      return Array.isArray(items) ? items : [];
    },
  });

  return {
    doctors: (data as GlobalDoctorItem[]) || [],
    isLoading,
    isError,
    refetch,
  };
}
