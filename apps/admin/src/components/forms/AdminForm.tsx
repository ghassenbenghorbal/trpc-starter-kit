import { User } from "@/types/User";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { MultiSelect } from "../ui/multiselect";
import { Alert, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type Props = {
    user?: User;
    readOnly?: boolean;
    error?: string;
    submitButton?: React.ReactNode;
    onSubmit: (data: any) => void;
};

const AdminForm = ({ user, submitButton, readOnly, error, onSubmit }: Props) => {
    const FormSchema = z.object({
        email: z.string().email("Invalid email address"),
        firstname: z.string(),
        lastname: z.string(),
        password: user ? z.string().optional() : z.string().min(8, "Password must be at least 8 characters"),
        image: z.string().optional(),
        permissions: z.object({
            analytics: z.array(z.string()).optional(),
            stores: z.array(z.string()).optional(),
            errorLogs: z.array(z.string()).optional(),
            users: z.array(z.string()).optional(),
            orders: z.array(z.string()).optional(),
            tracks: z.array(z.string()).optional(),
            payments: z.array(z.string()).optional(),
        }).refine(data => {
            return Object.values(data).some(array => array && array.length > 0);
        }, {
            message: "At least one permission must be granted.",
        }),
    });
    const permissions: {
        field:
            | "permissions.analytics"
            | "permissions.stores"
            | "permissions.errorLogs"
            | "permissions.users"
            | "permissions.orders"
            | "permissions.tracks"
            | "permissions.payments"
        label: string;
    }[] = [
        {
            field: "permissions.analytics",
            label: "Analytics Permissions",
        },
        {
            field: "permissions.stores",
            label: "Stores Permissions",
        },
        {
            field: "permissions.errorLogs",
            label: "Error Logs Permissions",
        },
        {
            field: "permissions.users",
            label: "Users Permissions",
        },
        {
            field: "permissions.orders",
            label: "Order Permissions",
        },
        {
            field: "permissions.tracks",
            label: "Tracks Permissions",
        },
        {
            field: "permissions.payments",
            label: "Payments Permissions",
        },
    ];
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: user?.email || "",
            firstname: user?.firstname || "",
            lastname: user?.lastname || "",
            password: "",
            permissions: Object.entries(user?.permissions ?? {}).reduce((acc: Record<string, any>, [key, value]) => {
                acc[key] =
                    Object.entries(value ?? {}).reduce((perms, [permKey, permValue]) => {
                        if (permValue) {
                            perms.push(permKey);
                        }
                        return perms;
                    }, [] as string[]) || [];
                return acc;
            }, {}),
        },
    });
    const { formState: { errors } } = form;
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="max-h-[75vh] overflow-y-auto px-1 pb-6 2xl:max-h-[82vh]">
                    {(errors?.permissions || error) && (
                        <Alert variant="destructive" className="mb-2 dark:bg-red-800 dark:text-white">
                            <div className="flex items-center gap-2">
                                <ExclamationTriangleIcon className="h-4 w-4" />
                                <AlertTitle className="mb-0">{errors?.permissions?.root?.message ?? error}</AlertTitle>
                            </div>
                        </Alert>
                    )}
                    <div className="space-y-3">
                        <div className="space-y-3">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name} className="text-xs font-semibold">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input className="shadow-none" {...field} readOnly={!!user} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="firstname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className="text-xs font-semibold">
                                                First Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input className="shadow-none" {...field} readOnly={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className="text-xs font-semibold">
                                                Last Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input className="shadow-none" {...field} readOnly={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name} className="text-xs font-semibold">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input className="shadow-none" {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {permissions.map((item, index) => (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={item.field}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor={field.name}
                                                className="text-xs font-semibold capitalize"
                                            >
                                                {item.label}
                                            </FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={
                                                        item.field != "permissions.analytics" &&
                                                        item.field != "permissions.tracks"
                                                            ? [
                                                                  { label: "read", value: "read" },
                                                                  { label: "write", value: "write" },
                                                              ]
                                                            : [{ label: "read", value: "read" }]
                                                    }
                                                    selected={field.value || []}
                                                    selectAll={true}
                                                    onChange={field.onChange}
                                                    disabled={readOnly}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {submitButton ? submitButton : <Button type="submit">Submit</Button>}
            </form>
        </Form>
    );
};

export default AdminForm;
