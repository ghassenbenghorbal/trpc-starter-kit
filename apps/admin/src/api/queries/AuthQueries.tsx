import { trpc } from "@/lib/trpc";

export const useAuthenticatedUserQuery = () =>
    trpc.auth.me.useQuery(undefined, {
        staleTime: Infinity,
    });