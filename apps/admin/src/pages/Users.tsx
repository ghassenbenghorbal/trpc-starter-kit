import { DataTableSkeleton } from "@/components/data-tables/data-table-skeleton";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import UsersDataTable from "@/components/data-tables/admin/AdminsDataTable";
import { useUsersQuery } from "@/api/queries/UserQueries";

const Users = () => {
    // get query params from the URL.
    const [URLSearchParams] = useSearchParams();

    const { page = "1", per_page = "10", ...params } = Object.fromEntries(URLSearchParams.entries());
    const { data, isLoading } = useUsersQuery({ page, per_page, ...params });
    const count = useMemo(() => data && Math.ceil(data.count / parseInt(per_page)), [data, per_page]);

    return (
        <div className="container flex-1 flex-col flex-wrap items-center px-2 py-0 md:px-3 lg:px-3">
            {/* title and subtitle for Users page */}
            {/* <div className="mt-4 flex flex-col gap-2">
                <div className="flex flex-col gap-2 p-1">
                    <h1 className="text-2xl font-bold">Users 👤</h1>
                    <p className="text-base text-gray-500">View all Super Admins</p>
                </div> */}
                {isLoading ? (
                    <DataTableSkeleton
                        rowCount={10}
                        columnCount={5}
                        searchableColumnCount={2}
                        filterableColumnCount={0}
                    />
                ) : (
                    <UsersDataTable data={data?.data || []} count={count || 0} />
                )}
            {/* </div> */}
        </div>
    );
};

export default Users;