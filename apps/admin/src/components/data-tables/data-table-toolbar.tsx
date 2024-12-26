import * as React from "react";
import { Link } from "react-router-dom";
import type { DataTableFilterableColumn, DataTableSearchableColumn } from "@/types/DataTable";
import { Cross2Icon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-tables/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/data-tables/data-table-view-options";
import { DatePickerWithRange } from "../ui/date-range-picker";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterableColumns?: DataTableFilterableColumn<TData>[];
    searchableColumns?: DataTableSearchableColumn<TData>[];
    newRowLink?: string;
    deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
    newRowButton?: React.ReactNode;
    actionButton?: React.ReactNode;
}

export function DataTableToolbar<TData>({
    table,
    filterableColumns = [],
    searchableColumns = [],
    newRowLink,
    deleteRowsAction,
    newRowButton,
    actionButton,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const [isDeletePending, startDeleteTransition] = React.useTransition();

    return (
        <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
            <div className="flex flex-1 items-center space-x-2">
                {searchableColumns.length > 0 &&
                    searchableColumns.map((column) =>
                        table.getColumn(column.id ? String(column.id) : "") && !column.isDate ? (
                            <Input
                                key={String(column.id)}
                                placeholder={`Filter ${column.title}...`}
                                value={(table.getColumn(String(column.id))?.getFilterValue() as string) ?? ""}
                                onChange={(event) => {
                                    table.getColumn(String(column.id))?.setFilterValue(event.target.value);
                                }}
                                className="h-8 w-[150px] lg:w-[200px]"
                            />
                        ) : table.getColumn(column.id ? String(column.id) : "") && column.isDate ? (
                            <DatePickerWithRange
                                key={String(column.id)}
                                className="h-8 w-[150px] overflow-hidden lg:w-[240px]"
                                defaultValue={
                                    (table.getColumn(String(column.id))?.getFilterValue() as any)
                                        ? (table.getColumn(String(column.id))?.getFilterValue() as string[])[0]
                                        : undefined
                                }
                                onChange={(date) => {
                                    table.getColumn(String(column.id))?.setFilterValue(date);
                                }}
                                placeholder={`Pick ${column.title}`}
                            />
                        ) : null
                    )}
                {filterableColumns.length > 0 &&
                    filterableColumns.map(
                        (column) =>
                            table.getColumn(column.id ? String(column.id) : "") && (
                                <DataTableFacetedFilter
                                    key={String(column.id)}
                                    column={table.getColumn(column.id ? String(column.id) : "")}
                                    title={column.title}
                                    options={column.options}
                                />
                            )
                    )}
                {isFiltered && (
                    <Button
                        aria-label="Reset filters"
                        variant="ghost"
                        className="h-8 px-2 lg:px-3"
                        onClick={() => {
                            table.resetColumnFilters();
                            setTimeout(() => {
                                const enterKeyPressEvent = new KeyboardEvent("keydown", {
                                    key: "Enter",
                                    bubbles: true,
                                });
                                document.dispatchEvent(enterKeyPressEvent);
                            }, 100);
                        }}
                    >
                        Reset
                        <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {!!actionButton && table.getSelectedRowModel().rows.length > 0 && actionButton}
                {deleteRowsAction && table.getSelectedRowModel().rows.length > 0 ? (
                    <Button
                        aria-label="Delete selected rows"
                        variant="destructive"
                        size="sm"
                        className="h-8"
                        onClick={(event) => {
                            startDeleteTransition(() => {
                                table.toggleAllPageRowsSelected(false);
                                deleteRowsAction(event);
                            });
                        }}
                        disabled={isDeletePending}
                    >
                        <TrashIcon className="mr-2 size-4" aria-hidden="true" />
                        Delete
                    </Button>
                ) : newRowButton ? (
                    newRowButton
                ) : newRowLink ? (
                    <Link aria-label="Create new row" to={newRowLink}>
                        <div
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                    size: "sm",
                                    className: "h-8",
                                })
                            )}
                        >
                            <PlusCircledIcon className="mr-2 size-4" aria-hidden="true" />
                            New
                        </div>
                    </Link>
                ) : null}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
