import React, { useState } from "react";

interface DataTableCardProps {
  title: string;
  /** children can be normal nodes or a render-function that receives pagination props */
  children: React.ReactNode | ((props: {
    pageIndex: number;
    pageSize: number;
    setPageIndex: (n: number) => void;
    setPageSize: (n: number) => void;
  }) => React.ReactNode);
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  headerActions?: React.ReactNode;
  /** show pagination footer */
  showPagination?: boolean;
  /** total items (required for pagination math) */
  totalItems?: number;
  /** total pages (optional). If provided, this value is used instead of computing from totalItems */
  totalPages?: number;
  initialPageSize?: number;
  /** callback when page or size changes */
  onPageChange?: (pageIndex: number, pageSize: number) => void;
}

function ExportDropdown({ accountId, data }: { accountId: string; data: any | null }) {
  const [open, setOpen] = useState(false);

  const exportCSV = (rows: any[], filename = 'export.csv') => {
    if (!rows || rows.length === 0) {
      const blob = new Blob([""], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = (rows: any[], filename = 'export.xlsx') => {
    // Fallback: generate CSV but use .xlsx extension so Excel can open it
    exportCSV(rows, filename.replace(/\.xlsx?$/, '') + '.csv');
  };

  const exportPDF = (rows: any[], filename = 'export.pdf') => {
    // Simple print-to-PDF fallback: open a new window with table and trigger print
    const html = `
      <html>
        <head>
          <title>Export</title>
        </head>
        <body>
          <pre>${JSON.stringify(rows, null, 2)}</pre>
        </body>
      </html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    // let user print/save as PDF
  };

  const buildExportRows = () => {
    // Build rows from available data; keep minimal and non-invasive
    if (!data) return [{ accountId: accountId || 'N/A', status: 'NO_DATA', qr: '' }];
    return [{ accountId: accountId || 'N/A', status: data.status, qr: data.qr || '' }];
  };

  const rows = buildExportRows();

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(v => !v)}
        className="px-3 py-2 rounded border bg-white text-sm"
      >
        Export ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50">
          <div className="py-1">
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => { exportPDF(rows); setOpen(false); }}>Export PDF</button>
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => { exportCSV(rows, 'whatsapp-export.csv'); setOpen(false); }}>Export CSV</button>
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => { exportExcel(rows, 'whatsapp-export.xlsx'); setOpen(false); }}>Export Excel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const DataTableCard: React.FC<DataTableCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  headerActions = null,
  showPagination = false,
  totalItems = 0,
  totalPages: totalPagesProp,
  initialPageSize = 10,
  onPageChange,
}) => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const totalPages = typeof totalPagesProp === 'number' && totalPagesProp > 0
    ? Math.max(1, Math.floor(totalPagesProp))
    : Math.max(1, Math.ceil(totalItems / pageSize));

  const onPageChangeRef = React.useRef<typeof onPageChange | null>(null);
  React.useEffect(() => {
    onPageChangeRef.current = onPageChange ?? null;
  }, [onPageChange]);

  React.useEffect(() => {
    // call external handler when pagination changes (use ref to avoid effect firing when
    // parent recreates the onPageChange function identity each render)
    if (onPageChangeRef.current) onPageChangeRef.current(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const renderChildren = () => {
    if (typeof children === "function") {
      return (children as any)({ pageIndex, pageSize, setPageIndex, setPageSize });
    }
    return children;
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      {/* Card Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
          {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
        </div>
        <div className="flex items-center gap-3">{headerActions}</div>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{renderChildren()}</div>
      </div>

      {/* Pagination Footer */}
      {showPagination && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-2xl">
            <div className="max-w-full mx-auto flex items-center justify-between gap-4">
              {/* Left: showing range */}
              <div className="flex items-center gap-3">
                {typeof totalItems === 'number' && totalItems > 0 ? (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <div className="text-sm">Showing <span className="font-medium text-gray-800 dark:text-white">{Math.min(totalItems, pageIndex * pageSize + 1)}-{Math.min(totalItems, (pageIndex + 1) * pageSize)}</span></div>
                    <div className="text-xs text-gray-500">of {totalItems} documents</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">{pageSize} Documents</div>
                )}
              </div>

              {/* Center: page numbers */}
              <div className="flex items-center gap-3">
              {(() => {
                const current = pageIndex + 1;
                const pages: (number | string)[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  if (current <= 4) {
                    for (let i = 1; i <= 5; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                  } else if (current >= totalPages - 3) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    pages.push('...');
                    pages.push(current - 1);
                    pages.push(current);
                    pages.push(current + 1);
                    pages.push('...');
                    pages.push(totalPages);
                  }
                }
                  return pages.map((p, idx) => {
                    if (p === '...') return <div key={'dot-' + idx} className="px-2 text-sm text-gray-400">…</div>;
                    const pn = p as number;
                    const active = pn === current;
                    return (
                      <button
                        key={pn}
                        onClick={() => setPageIndex(pn - 1)}
                        className={`min-w-[36px] h-9 flex items-center justify-center px-3 text-sm rounded-full ${active ? 'bg-brand-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                      >
                        {pn}
                      </button>
                    );
                  });
              })()}
              </div>

            {/* Right: prev/next */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                disabled={pageIndex === 0}
                className="flex items-center gap-2 px-3 py-2 rounded-full border text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="hidden sm:inline">Previous</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                onClick={() => setPageIndex(p => Math.min(totalPages - 1, p + 1))}
                disabled={pageIndex >= totalPages - 1}
                className="flex items-center gap-2 px-3 py-2 rounded-full border text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTableCard;
