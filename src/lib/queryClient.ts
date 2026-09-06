import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes default stale time
            gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
            refetchOnWindowFocus: false, // Prevent hitting API on tab switch
            refetchOnMount: false, // Prevent refetching on component remount if fresh
            retry: 1,
        },
    },
});