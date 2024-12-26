// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import apis from "../apis";
// import { AxiosError } from "axios";

// export const useUserMutation = (
//     setOpen: (open: boolean) => void,
//     userId?: string,
//     setLoading?: (loading: boolean) => void,
//     setError?: (error: string) => void
// ) => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (data: any) => (userId ? apis.users.updateUser(userId, data) : apis.users.createUser(data)),
//         onSuccess: () => {
//             if (userId) {
//                 queryClient.invalidateQueries({
//                     predicate: (query) =>
//                         query.queryKey.includes("users") ||
//                         (query.queryKey.includes("user") && query.queryKey.includes(userId)),
//                 });
//                 queryClient.fetchQuery({ queryKey: ["user", "me"] }).then((resp: any) => {
//                     if (resp.data.data.id === userId)
//                         queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("me") });
//                 });
//             } else {
//                 queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("users") });
//             }
//             setOpen(false);
//             toast.success(userId ? "User updated successfully" : "User created successfully");
//         },
//         onError: (error: any) => {
//             return setError && setError(error.response?.data?.message || error.message);
//         },
//         onSettled: () => {
//             return setLoading && setLoading(false);
//         },
//     });
// };

// export const useDeleteUserMutation = (userId: string | string[]) => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: () => apis.users.deleteUser(userId),
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 predicate: (query) =>
//                     query.queryKey.includes("users") ||
//                     (query.queryKey.includes("user") &&
//                         (Array.isArray(userId)
//                             ? userId.some((id) => query.queryKey.includes(id))
//                             : query.queryKey.includes(userId))),
//             });
//             toast.success("User(s) deleted successfully");
//         },
//         onError: (error: AxiosError) => {
//             toast.error((error.response?.data as any).message || "An error occurred");
//         },
//     });
// };
