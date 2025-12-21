import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  fileName?: string;
  pageCount?: number;
  recordCount?: number;
  currentPage?: number;
  setPageView?: (pageNo: number) => void
  setCountRecords?: (countRecord: number) => void
  onExport?: () => Promise<T[]>;
};

export function DataTable<T>({
  data,
  columns,
  fileName = "table-data",
  pageCount = 0,
  recordCount = 10,
  currentPage = 1,
  setPageView = () => { },
  setCountRecords = () => { },
  onExport,
}: DataTableProps<T>) {
  console.log(data, "DataTable >>>>>>>> Data");

  const [columnVisibility, setColumnVisibility] = useState({});
  const handlePageClick = (paged: any) => {
    console.log('paged', paged);
    console.log('pageno', paged.selected)
    setPageView(Number(paged.selected) + 1)
  };
  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* ================= EXPORT ================= */

  // const exportRows = table
  //   .getFilteredRowModel()
  //   .rows.map(row => row.original);

  const exportCSV = async() => {
    if (!onExport) return;
    const exportRows = await onExport();
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const csv = XLSX.write(wb, { bookType: "csv", type: "array" });
    saveAs(new Blob([csv]), `${fileName}.csv`);
  };

  const exportExcel = async() => {
    if (!onExport) return;
    const exportRows = await onExport();
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <>
      {/* ===== Toolbar ===== */}
      <div className="d-flex justify-content-between mb-2">
        {/* Column Toggle */}
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Columns
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {table.getAllLeafColumns().map(column => (
              <div key={column.id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                <label className="form-check-label">
                  {column.columnDef.header as string}
                </label>
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {/* Export */}
        <div>
          <button
            className="btn btn-outline-success me-2"
            onClick={exportCSV}
          >
            Export CSV
          </button>
          <button
            className="btn btn-outline-success"
            onClick={exportExcel}
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* ===== Table ===== */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
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

      {/* ===== Pagination ===== */}
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mt-3">

        {/* Page Size */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small fw-semibold">Page size</span>

          <select
            className="form-select form-select-sm w-auto"
            value={recordCount}
            onChange={(e) => setCountRecords(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Pagination */}
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next ›"
          previousLabel="‹ Prev"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          forcePage={currentPage - 1}
          containerClassName="pagination pagination-sm mb-0"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item disabled"
          breakLinkClassName="page-link"
          activeClassName="active"
        />
      </div>

    </>
  );
}
