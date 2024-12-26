import { Navigate, Outlet } from "react-router-dom";
import useUserPermissions from "@/hooks/useUserPermissions";
import { UserPermission, UserPermissions } from "@/types/User";
import NotFound from "@/pages/NotFound";

interface PermissionProtectedRouteProps {
    requiredPermissions: Partial<UserPermissions>;
}

const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = () => {
    // const userPermissions = useUserPermissions();

    // const hasRequiredPermissions = Object.entries(requiredPermissions).every(([key, value]) => {
    //     const userPermission = userPermissions[key as keyof UserPermissions];
    //     return userPermission && Object.entries(value).every(([permKey, permValue]) => userPermission[permKey as keyof UserPermission] === permValue);
    // });

    // if (!hasRequiredPermissions) {
        // <Navigate to="/users" />;
        // return <NotFound />;
    // }

    return <Outlet />;
};

export default PermissionProtectedRoute;