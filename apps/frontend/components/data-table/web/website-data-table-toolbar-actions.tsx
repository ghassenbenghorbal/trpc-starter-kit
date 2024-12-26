"use client";

import { type Table } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Website } from "@/types/website";

interface WebsitesTableToolbarActionsProps {
    table: Table<Website>;
}

export function WebsitesTableToolbarActions({ table }: WebsitesTableToolbarActionsProps) {
    return (
        <div className="flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <Button variant="destructive" size="sm" className="gap-2">
                    <Trash className="size-4" aria-hidden="true" />
                    Delete
                </Button>
            ) : null}
        </div>
    );
}
