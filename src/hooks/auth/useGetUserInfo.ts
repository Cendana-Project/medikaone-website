'use client';

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/services/AuthService";
import { getProfilePhotoUrl } from "@/services/ProfileService";
import { UserData } from "@/types/auth";

export const useGetUserInfo = () => {
    const { data, isLoading, error, refetch: refetchMe } = useQuery<UserData, Error>({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await getUserInfo();
            return res.data; 
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    const { data: photoUrl, refetch: refetchPhoto } = useQuery<string | null>({
        queryKey: ["profilePhoto"],
        queryFn: async () => {
            try {
                const res = await getProfilePhotoUrl();
                if (res && res.data?.url) {
                    return res.data.url;
                }
                return null;
            } catch {
                return null;
            }
        },
        staleTime: 0,
        retry: 1,
    });

    const userInfoWithAvatar = useMemo(() => {
        if (!data) return undefined;
        return {
            ...data,
            avatar: photoUrl || (data as any).avatar || null,
        };
    }, [data, photoUrl]);

    const refetchAll = async () => {
        await Promise.all([refetchMe(), refetchPhoto()]);
    };

    return {
        userInfo: userInfoWithAvatar,
        loading: isLoading,
        error,
        refetch: refetchAll,
    };
};


