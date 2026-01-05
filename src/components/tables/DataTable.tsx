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
  const [internalPageIndex, setInternalPageIndex] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize);

  const pageIndex = controlledPageIndex ?? internalPageIndex;
  const pageSize = controlledPageSize ?? internalPageSize;

  const setPageIndex = (n: number) => {
    if (onPageIndexChange) onPageIndexChange(n);
    else setInternalPageIndex(n);
  };

  const setPageSize = (n: number) => {
    if (onPageSizeChange) onPageSizeChange(n);
    else setInternalPageSize(n);
    // reset to first page when size changes
    if (!controlledPageIndex && !onPageIndexChange) setInternalPageIndex(0);
    if (onPageIndexChange) onPageIndexChange(0);
  };

  const pagedData = useMemo(() => {
    if (!pagination) return data;
    return data;
  }, [data]);

  const table = useReactTable({
    data: pagedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  console.log(pagedData, `page data for react table`);

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
          {table.getRowModel().rows.map(row => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default DataTable;