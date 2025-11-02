'use client';

import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/services/AuthService";
import { UserData } from "@/types/auth";

export const useGetUserInfo = () => {
    const { data, isLoading, error, refetch } = useQuery<UserData, Error>({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await getUserInfo();
            return res.data; 
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    return {
        userInfo: data,
        loading: isLoading,
        error,
        refetch
    };
};
