import LoginCard from "@/components/cards/Login";
import Image from "@/components/image/Image";
import logo from "@/assets/svg/logo-dark.svg";
import { Navigate } from "react-router-dom";
import { useAuthenticatedUserQuery } from "@/api/queries/AuthQueries";

const Login = () => {
    const {data} = useAuthenticatedUserQuery();
    if (data) {
        return <Navigate to="/" />;
    }
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-950">
            <div className="flex flex-col items-center justify-center">
                <div className="-mt-14 space-y-4">
                    <div className="flex justify-center">
                        <Image src={logo} alt="logo" width="70%" height="100%" />
                    </div>
                    <LoginCard />
                </div>
            </div>
        </div>
    );
};

export default Login;
