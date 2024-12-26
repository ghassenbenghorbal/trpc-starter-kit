import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import from react-router-dom
import type { DataTableFilterableColumn, DataTableSearchableColumn } from "@/types/DataTable";
import {
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    TableState,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { useDebounce } from "@/hooks/useDebounce";
import { useMemo } from "react";

interface UseDataTableProps<TData, TValue> {
    /**
     * The data for the table
     * @default []
     * @type TData[]
     */
    data: TData[];

    /**
     * The columns of the table
     * @default []
     * @type ColumnDef<TData, TValue>[]
     */
    columns: ColumnDef<TData, TValue>[];

    /**
     * The number of pages in the table
     * @type number
     */
    pageCount: number;

    /**
     * The searchable columns of the table
     * @default []
     * @type {id: keyof TData, title: string}[]
     * @example searchableColumns={[{ id: "title", title: "titles" }]}
     */
    searchableColumns?: DataTableSearchableColumn<TData>[];

    /**
     * The filterable columns of the table. When provided, renders dynamic faceted filters, and the advancedFilter prop is ignored.
     * @default []
     * @type {id: keyof TData, title: string, options: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[]}[]
     * @example filterableColumns={[{ id: "status", title: "Status", options: ["todo", "in-progress", "done", "canceled"]}]}
     */
    filterableColumns?: DataTableFilterableColumn<TData>[];

    state?: Omit<Partial<TableState>, "sorting"> & {
        sorting?: {
            id: Extract<keyof TData, string>;
            desc: boolean;
        }[];
    };
}

const schema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
});

export function useDataTable<TData, TValue>({
    data,
    columns,
    pageCount,
    searchableColumns = [],
    filterableColumns = [],
    state,
}: UseDataTableProps<TData, TValue>) {
    const location = useLocation(); // Instead of usePathname and useSearchParams
    const navigate = useNavigate(); // Instead of useRouter
    // Search params
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    // Search params
    const { page, per_page: perPage, sort } = schema.parse(Object.fromEntries(searchParams));
    const [column, order] = sort?.split(".") ?? [];

    // Create query string
    const createQueryString = React.useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams?.toString());

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            }

            return newSearchParams.toString();
        },
        [searchParams]
    );
    // Initial column filters
    const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
        return Array.from(searchParams.entries()).reduce<ColumnFiltersState>((filters, [key, value]) => {
            const filterableColumn = filterableColumns.find((column) => column.id === key);
            const searchableColumn = searchableColumns.find((column) => column.id === key);

            if (filterableColumn) {
                filters.push({
                    id: key,
                    value: value.split("."),
                });
            } else if (searchableColumn) {
                filters.push({
                    id: key,
                    value: [value],
                });
            }

            return filters;
        }, []);
    }, [filterableColumns, searchableColumns, searchParams]);

    // Table states
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialColumnFilters);

    // Handle server-side pagination
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: page - 1,
        pageSize: perPage,
    });

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    React.useEffect(() => {
        setPagination({
            pageIndex: page - 1,
            pageSize: perPage,
        });
    }, [page, perPage]);

    // Handle server-side sorting
    const [sorting, setSorting] = React.useState<SortingState>([
        {
            id: column ?? "",
            desc: order === "desc",
        },
    ]);

    React.useEffect(() => {
        navigate(
            `${location.pathname}?${createQueryString({
                page: pageIndex + 1,
                per_page: pageSize,
                sort: sorting[0]?.id ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}` : null,
            })}`,
            {
                preventScrollReset: true,
            }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting]);

    // React.useEffect(() => {
    //     navigate(
    //         `${location.pathname}?${createQueryString({
    //             page,
    //             sort: sorting[0]?.id ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}` : null,
    //         })}`
    //     );

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [sorting]);

    // Handle server-side filtering
    const debouncedSearchableColumnFilters = JSON.parse(
        useDebounce(
            JSON.stringify(
                columnFilters.filter((filter) => {
                    return searchableColumns.find((column) => column.id === filter.id);
                })
            )
        )
    ) as ColumnFiltersState;

    const filterableColumnFilters = columnFilters.filter((filter) => {
        return filterableColumns.find((column) => column.id === filter.id);
    });

    React.useEffect(() => {
        const newFilterParams = {} as any;

        // Combine and process both filter types
        const combinedFilters = [...debouncedSearchableColumnFilters, ...filterableColumnFilters];
        combinedFilters.forEach((column) => {
            if (typeof column.value === "string") {
                newFilterParams[column.id] = column.value.trim();
            } else if (Array.isArray(column.value)) {
                newFilterParams[column.id] = column.value.join(".");
            }
        });

        // Check if filters have changed and remove non-existent columns from URL
        let filtersChanged = false;
        const allKeys = new Set([...Object.keys(newFilterParams), ...Array.from(searchParams.keys())]);
        allKeys.forEach((key) => {
            // Skip the page parameter
            if (key === "page" || key === "per_page" || key === "sort") return;

            const newValue = newFilterParams[key];
            const oldValue = searchParams.get(key);
            if (newValue !== oldValue) {
                filtersChanged = true;
                if (newValue === undefined) {
                    searchParams.delete(key);
                } else {
                    searchParams.set(key, newValue);
                }
            }
        });

        // Update URL if filters have changed
        if (filtersChanged) {
            searchParams.set("page", "1");
            const filterParams = createQueryString(Object.fromEntries(searchParams.entries()));
            navigate(`${location.pathname}?${filterParams}`);
        }
    }, [
        debouncedSearchableColumnFilters,
        filterableColumnFilters,
        navigate,
        location.pathname,
        createQueryString,
        searchParams,
    ]);

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount ?? -1,
        state: {
            ...state,
            pagination,
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    return { table };
}
