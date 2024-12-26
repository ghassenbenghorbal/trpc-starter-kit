"use client"

import * as React from "react"
import type {
  DataTableAdvancedFilterField,
  DataTableFilterField,
  DataTableRowAction,
} from "@/types"

import { toSentenceCase } from "@/lib/utils"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"


import { getColumns } from "./website-data-table-columns"
// import { WebsitesTableFloatingBar } from "./website-data-table-floating-bar"
import { WebsitesTableToolbarActions } from "./website-data-table-toolbar-actions"
import { Website } from "@/types/website"
import { getWebsites } from "@/app/queries/website"

interface WebsitesTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getWebsites>>,
    ]
  >
}

export function WebsitesTable({ promises }: WebsitesTableProps) {

  const [{ data, count: pageCount }] = React.use(promises)

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Website> | null>(null)

  const columns = React.useMemo(
    () => getColumns({ setRowAction }),
    [setRowAction]
  )

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<Website>[] = [
    {
      id: "name",
      label: "Website",
      placeholder: "Filter websites...",
    },
  ]

  /**
   * Advanced filter fields for the data table.
   * These fields provide more complex filtering options compared to the regular filterFields.
   *
   * Key differences from regular filterFields:
   * 1. More field types: Includes 'text', 'multi-select', 'date', and 'boolean'.
   * 2. Enhanced flexibility: Allows for more precise and varied filtering options.
   * 3. Used with DataTableAdvancedToolbar: Enables a more sophisticated filtering UI.
   * 4. Date and boolean types: Adds support for filtering by date ranges and boolean values.
   */
  const advancedFilterFields: DataTableAdvancedFilterField<Website>[] = [
    {
      id: "name",
      label: "Name",
      type: "text",
    },
    {
      id: "createdAt",
      label: "Embedded At",
      type: "date",
    },
  ]

  const enableAdvancedTable = false
  const enableFloatingBar = false

  const { table } = useDataTable<Website>({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: enableAdvancedTable,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  })

  return (
    <>
      <DataTable
        table={table}
        // floatingBar={
        //   enableFloatingBar ? <WebsitesTableFloatingBar table={table} /> : null
        // }
      >
        {enableAdvancedTable ? (
          <DataTableAdvancedToolbar
            table={table}
            filterFields={advancedFilterFields}
            shallow={false}
          >
            <WebsitesTableToolbarActions table={table} />
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            <WebsitesTableToolbarActions table={table} />
          </DataTableToolbar>
        )}
      </DataTable>
      {/* <UpdateWebsiteSheet
        open={rowAction?.type === "update"}
        onOpenChange={() => setRowAction(null)}
        task={rowAction?.row.original ?? null}
      />
      <DeleteWebsitesDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        tasks={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      /> */}
    </>
  )
}
