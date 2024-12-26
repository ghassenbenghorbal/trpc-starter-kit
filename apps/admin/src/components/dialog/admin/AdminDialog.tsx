import { useAuthenticatedUserQuery } from "@/api/queries/AuthQueries";
import Loading from "@/components/loading/Loading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
// import { useAdminMutation } from "@/api/mutations/AdminMutations";
import AdminForm from "@/components/forms/Admin";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Eye } from "lucide-react";

type Props = {
    adminId?: string;
    readOnly?: boolean;
    me?: boolean;
    children?: React.ReactNode;
};

const AdminDialog = ({ adminId, readOnly, me, children }: Props) => {
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: authenticatedUserData, isLoading: isLoadingAuthenticatedUser } = useAuthenticatedUserQuery(); 
    // const { data, isLoading } = useAdminQuery(adminId!, adminId && !me ? enabled : false);
    // const { mutate } = useAdminMutation(setEnabled, adminId, setLoading, setError);

    const onSubmit = (data: any) => {
        setLoading(true);
        const { permissions, ...rest } = data;
        const originalPermissions = Object.entries(permissions).reduce((acc: Record<string, any>, [key, value]) => {
            acc[key] = (value as string[])?.reduce((permObj: Record<string, boolean>, perm) => {
                permObj[perm] = true;
                return permObj;
            }, {});
            return acc;
        }, {});
        // mutate({ ...rest, permissions: originalPermissions });
    };
    return (
        <Dialog onOpenChange={(open) => setEnabled(open)} open={enabled}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button size="icon" variant="ghost" className="rounded-full w-6 h-6">
                        <Eye />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="p-1">
                    <DialogTitle>Admin Details</DialogTitle>
                </DialogHeader>
                {/* {(me ? isLoadingAuthenticatedUser : isLoading) ? (
                    <div className="h-[75vh]">
                        <Loading />
                    </div>
                ) : ( */}
                    {/* <AdminForm
                        admin={me ? authenticatedUserData?.admin : data?.data}
                        onSubmit={onSubmit}
                        readOnly={readOnly}
                        error={error}
                        submitButton={
                            <DialogFooter>
                                <Button type="submit">
                                    {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}{" "}
                                    {( data?.data) ? "Save changes" : "Submit" }
                                </Button>
                            </DialogFooter>
                        }
                    /> */}
                {/* )} */}
            </DialogContent>
        </Dialog>
    );
};

export default AdminDialog;
