import { SearchParams } from "@/types/DataTable";
import { trpc } from "@/lib/trpc";

export const useUsersQuery = (params: Partial<SearchParams>) =>
    trpc.admins.findMany.useQuery(params)

// export const useUserQuery = (userId: string, enabled: boolean) =>
//     useQuery({
//         queryKey: ["user", userId],
//         queryFn: ({ signal }) => apis.users.getUser(userId, signal),
//         enabled
//     });