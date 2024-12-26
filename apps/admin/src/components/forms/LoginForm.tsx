import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useLoginMutation } from "@/api/mutations/AuthMutations";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

const LoginForm = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const { mutate } = useLoginMutation();
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        mutate(values, {
            onSuccess: () => {
                navigate("/");
            },
            onError: (error: any) => {
                console.log(error);
                const errorMessage = error.response?.data.message || "An unknown error occurred";
                setError(errorMessage);
            },
            onSettled: () => {
                setLoading(false);
                form.reset();
            },
        });
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <div className="flex items-center gap-2">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <AlertTitle className="mb-0">{error}</AlertTitle>
                        </div>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} style={{ borderColor: "hsl(240,5.9%,90%)" }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} style={{ borderColor: "hsl(240,5.9%,90%)" }} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full bg-blue-950/95 hover:bg-blue-950/100" type="submit" disabled={loading}>
                    {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;
