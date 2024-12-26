import { useAuthenticatedUserQuery } from "@/api/queries/AuthQueries";
import Loading from "@/components/loading/Loading";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
    const { data, isLoading } = useAuthenticatedUserQuery();
    if (isLoading) return <div className="absolute inset-0"><Loading /></div>;
    if (!data) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
};

export default PrivateRoutes;
