import { Checkbox } from "@/components/ui/checkbox";
import { DataTableSearchableColumn } from "@/types/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import AdminDialog from "@/components/dialog/admin/AdminDialog";
import { z } from "zod";
import { displayAdmin } from "backend/validators/admin-validators";

export const AdminsSearchableColumns: DataTableSearchableColumn<any>[] = [
    { id: "email", title: "term" },
    { id: "createdAt", title: "Created At", isDate: true },
];

export const AdminsColumns: ColumnDef<z.infer<typeof displayAdmin>, unknown>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "firstname",
        header: "First Name",
    },
    {
        accessorKey: "lastname",
        header: "Last Name",
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: (info) => info.row.original.roles.map((adminRole) => adminRole.role.name).join(", "),
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) =>
            info.row.original.createdAt ? formatDate(info.row.original.createdAt, "dd/MM/yyyy HH:mm") : "N/A",
    },
    {
        header: "Actions",
        cell: (info) => <AdminDialog adminId={info.row.original.id} />,
    },
];
