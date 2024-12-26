import { trpc } from "@/lib/trpc";
import { useNavigate } from "react-router-dom";

export const useLoginMutation = (setIsLoading?: (loading: boolean) => void) => {
    const navigate = useNavigate();
    return trpc.auth.login.useMutation({
        onMutate: async () => {
            return setIsLoading && setIsLoading(true);
        },
        onSuccess: async () => {
            return navigate("/");
        },
        onSettled: async () => {
            return setIsLoading && setIsLoading(false);
        },
    });
}

export const useLogoutMutation = (setIsLoading?: (loading: boolean) => void) => {
    const navigate = useNavigate();
    return trpc.auth.logout.useMutation({
        onMutate: async () => {
            return setIsLoading && setIsLoading(true);
        },
        onSuccess: async () => {
            return navigate("/login");
        },
        onSettled: async () => {
            return setIsLoading && setIsLoading(false);
        },
    });
}
