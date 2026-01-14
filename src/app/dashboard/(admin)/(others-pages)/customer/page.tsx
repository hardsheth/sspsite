"use client";

import { useEffect, useState } from "react";
import DataTableCard from "@/components/common/DataTableCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/tables/DataTable";

const Page = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // initial fetch will be triggered via DataTableCard onPageChange callback

    const header = [
        {
            header: "Customer Name",
            accessorKey: "Customername",
        },
        {
            header: "Address",
            accessorKey: "Address",
        },
        {
            header: "Phone",
            accessorKey: "Contact",
        },
    ];

    return (
        <div>
            <PageBreadcrumb pageTitle="Customer" />
            <div className="space-y-6">
                <DataTableCard title="Customer List" showPagination totalPages={totalPages} totalItems={totalItems} initialPageSize={10}
                    onPageChange={async (pageIndex, pageSize) => {
                        setLoading(true);
                        try {
                            const res = await fetch(`/api/customer?page=${pageIndex + 1}&size=${pageSize}`, { cache: 'no-store' });
                            const json = await res.json();
                            const items = json.fetchingcustomerloans ?? json.items ?? json;
                            console.log(items, `next click page data`, json);

                            setData(items || []);
                            // try to read total pages count if available (pageCount or totalPages),
                            // otherwise compute from total items if provided
                            const serverPageCount = json.Totalpages ?? json.totalPages ?? json.page_count ?? undefined;
                            console.log(serverPageCount, `serverpagecoun`);
                            
                            if (typeof serverPageCount === 'number') {
                                setTotalPages(serverPageCount);
                            } else if (typeof json.total === 'number') {
                                setTotalPages(Math.max(1, Math.ceil(json.total / pageSize)));
                            } else {
                                // fallback: if items length returned and fewer than requested, approximate
                                setTotalPages(prev => Math.max(1, prev || Math.ceil((Array.isArray(items) ? items.length : 0) / pageSize)));
                            }
                            // total items (record count) if provided by API
                            const totalFromApi = json.TotalRecords ?? json.count ?? undefined;
                            if (typeof totalFromApi === 'number') setTotalItems(totalFromApi);
                            else if (Array.isArray(items)) setTotalItems(prev => prev || items.length);
                        } finally { setLoading(false); }
                    }}
                >
                    {({ pageIndex, pageSize, setPageIndex, setPageSize }: any) => (
                        <>
                            {loading ? <div>Loading...</div> : <DataTable columns={header} data={data} pagination pageIndex={pageIndex} pageSize={pageSize} onPageIndexChange={setPageIndex} onPageSizeChange={setPageSize} />}
                        </>
                    )}
                </DataTableCard>
            </div>
        </div>
    );
};

export default Page;