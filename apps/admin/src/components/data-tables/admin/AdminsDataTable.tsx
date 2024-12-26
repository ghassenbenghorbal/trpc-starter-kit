import { DataTable } from "@/components/data-tables/data-table";
import { AdminsColumns, AdminsSearchableColumns } from "./AdminsDataTableColumns";
import { useDataTable } from "@/hooks/useDataTable";
import AdminDialog from "@/components/dialog/admin/AdminDialog";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
// import { useDeleteAdminMutation } from "@/api/mutations/AdminMutations";
import { displayAdmins } from "backend/validators/admin-validators";
import { z } from "zod";

type AdminsDataTableProps = {
    data: z.infer<typeof displayAdmins>;
    count: number;
};

const AdminsDataTable = ({ data, count }: AdminsDataTableProps) => {
    const { table } = useDataTable({
        columns: AdminsColumns,
        data,
        pageCount: count,
        searchableColumns: AdminsSearchableColumns,
    });
    const rows = table.getSelectedRowModel();
    // const { mutate } = useDeleteAdminMutation(rows.flatRows.map((row) => row.original._id) as string[]);
    // const handleDeleteAdmins = () => {
    //     confirm("Are you sure you want to delete these admins?") && mutate();
    // };
    return (
        <DataTable
            table={table}
            columns={AdminsColumns}
            searchableColumns={AdminsSearchableColumns}
            newRowButton={
                <AdminDialog>
                    <Button variant="outline" size="sm" className="h-8">
                        <PlusCircledIcon className="mr-2 size-4" aria-hidden="true" />
                        New
                    </Button>
                </AdminDialog>
            }
            // deleteRowsAction={handleDeleteAdmins}
        />
    );
};

export default AdminsDataTable;
