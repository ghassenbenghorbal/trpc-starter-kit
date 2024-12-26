import LoginForm from "../forms/LoginForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

const LoginCard = () => {
    return (
        <Card className="w-96 bg-white text-black">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription style={{color: "hsl(240,3.8%,46.1%)"}}>Enter your email and password.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
    );
};

export default LoginCard;
