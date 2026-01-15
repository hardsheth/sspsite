// components/DataTable.tsx
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";

interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  /** enable client-side pagination */
  pagination?: boolean;
  initialPageSize?: number;
  // controlled pagination (optional)
  pageIndex?: number;
  pageSize?: number;
  onPageIndexChange?: (n: number) => void;
  onPageSizeChange?: (n: number) => void;
}

function DataTable<T>({ columns, data, pagination = true, initialPageSize = 10, pageIndex: controlledPageIndex, pageSize: controlledPageSize, onPageIndexChange, onPageSizeChange }: DataTableProps<T>) {
  const pagedData = useMemo(() => {
    if (!pagination) return data;
    return data;
  }, [data]);

  const table = useReactTable({
    data: pagedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <table className="min-w-[900px] w-full text-sm">
        <thead className="">
          {table.getHeaderGroups().map(group => (
            <tr key={group.id}>
              {group.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {table.getRowModel().rows.length > 0 ? (table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))) : (<tr>
            <td
              colSpan={table.getAllLeafColumns().length}
              className="px-4 py-6 text-center text-gray-500 text-theme-sm dark:text-gray-400"
            >
              No Data Available
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}
export default DataTable;