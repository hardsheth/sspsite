"use client";

import { useState } from "react";
import DataTableCard from "@/components/common/DataTableCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/tables/DataTable";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { FiEye } from "react-icons/fi";
import { Modal } from "@/components/ui/modal";
import { ReturnOrderForm } from "@/components/order/ReturnOrderForm";

type DateLabelProps = {
    value?: string | Date | null
}

const DateLabel = ({ value }: DateLabelProps) => {
    const date = value ? new Date(value) : new Date()

    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).replace(/\//g, "-")

    return (
        <span className="text-sm text-gray-700">
            {formattedDate}
        </span>
    )
}

export enum OrderStatusEnum {
    CREATED = "created",
    CONFIRED = "confirmed",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    RETURNED = "returned",
}

export enum PaymentStatusEnum {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded",
    CANCELLED = "cancelled",
    PARTIALLY_PAID = "partially_paid",
}



const allowReturnPayment = [PaymentStatusEnum.PAID, PaymentStatusEnum.PARTIALLY_REFUNDED, PaymentStatusEnum.PARTIALLY_PAID];
const allowReturnOrder = [OrderStatusEnum.CONFIRED, OrderStatusEnum.DELIVERED, OrderStatusEnum.SHIPPED];

const PAYMENT_STATUS_LABEL_CLASSES: Record<PaymentStatusEnum | OrderStatusEnum, string> = {
    [PaymentStatusEnum.PENDING]:
        "border border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 dark:text-yellow-400",

    [PaymentStatusEnum.PAID]:
        "border border-green-500 text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400",

    [PaymentStatusEnum.FAILED]:
        "border border-red-500 text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400",

    [PaymentStatusEnum.REFUNDED]:
        "border border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400",

    [PaymentStatusEnum.PARTIALLY_REFUNDED]:
        "border border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400",

    [PaymentStatusEnum.CANCELLED]:
        "border border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-500/10 dark:text-gray-400",

    [PaymentStatusEnum.PARTIALLY_PAID]:
        "border border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",

    [OrderStatusEnum.CREATED]:
        "border border-gray-400 text-gray-600 bg-gray-50 dark:bg-gray-500/10 dark:text-gray-400",

    [OrderStatusEnum.CONFIRED]:
        "border border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",

    [OrderStatusEnum.SHIPPED]:
        "border border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400",

    [OrderStatusEnum.DELIVERED]:
        "border border-green-500 text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400",

    [OrderStatusEnum.RETURNED]:
        "border border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400",
};

interface StatusLabelProps {
    status: PaymentStatusEnum | OrderStatusEnum;
}

function StatusLabel({ status }: StatusLabelProps) {
    const key = status.toLowerCase();

    return (
        <span
            className={`
        inline-flex items-center
        px-3 py-1
        text-sm font-medium
        rounded-md
        whitespace-nowrap capitalize
        ${PAYMENT_STATUS_LABEL_CLASSES[status]}
      `}
        >
            {status}
        </span>
    );
}

const Page = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [returnShow, setReturnShow] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const router = useRouter();
    // initial fetch will be triggered via DataTableCard onPageChange callback

    const header = [
        {
            header: "Booking Date",
            accessorKey: "BookingDate",
            cell: ({ getValue }: any) => (
                <DateLabel value={getValue()} />
            ),
        },
        {
            header: "Delivery Date",
            accessorKey: "DeliveryDate",
            cell: ({ getValue }: any) => (
                <DateLabel value={getValue()} />
            ),
        },
        {
            header: "Return Date",
            accessorKey: "ReturnDate",
            cell: ({ getValue }: any) => (
                <DateLabel value={getValue()} />
            ),
        },
        {
            header: "Customer Name",
            accessorKey: "CustomerId.Customername",
        },
        {
            header: "Address",
            accessorKey: "CustomerId.Address",
        },
        {
            header: "Phone",
            accessorKey: "CustomerId.Contact",
        },
        {
            header: "Rent",
            accessorKey: "PayDetails.rent",
        },
        {
            header: "Deposit",
            accessorKey: "PayDetails.deposit",
        },
        {
            header: "Amount",
            accessorKey: "Amount",
        },
        {
            header: "Payment Status",
            accessorKey: "PaymentStatus",
            cell: ({ getValue }: any) => (
                <StatusLabel status={getValue() as PaymentStatusEnum} />
            ),
        },
        {
            header: "Order Status",
            accessorKey: "Status",
            cell: ({ getValue }: any) => (
                <StatusLabel status={getValue() as OrderStatusEnum} />
            ),
        },
        {
            header: "Payment Received",
            accessorKey: "PaymentMethod",
        },
        {
            header: "Action",
            accessorKey: "_id",
            cell: ({ row }: any) => {
                const data = row.original;
                return (
                    <div className="flex gap-2">
                        <Button size="sm" variant="primary" startIcon={<FiEye />} onClick={() => {
                            router.push(`/dashboard/orderlist/${data._id}`)
                        }}>
                            {''}
                        </Button>
                        {allowReturnPayment.includes(data.PaymentStatus) &&
                            allowReturnOrder.includes(data.Status) && <Button size="sm" variant="danger" onClick={() => {
                                setReturnShow(true);
                            }}>
                                Return {data.Status}
                            </Button>}
                    </div>
                );
            }
        }
    ];

    return (
        <div>
            <PageBreadcrumb pageTitle="Orders" />
            <div className="space-y-6">
                <DataTableCard title="Order List" showPagination totalPages={totalPages} totalItems={totalItems} initialPageSize={10}
                    onPageChange={async (pageIndex, pageSize) => {
                        setLoading(true);
                        try {
                            const res = await fetch(`/api/order?page=${pageIndex + 1}&size=${pageSize}`, { cache: 'no-store' });
                            const json = await res.json();
                            const items = json.data ?? json.items ?? json;
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
            <Modal isOpen={returnShow} onClose={() => { setReturnShow(false) }} showCloseButton={true} className="max-w-md p-6">
                <div className="">
                    <ReturnOrderForm onCancel={() => setReturnShow(false)} onConfirm={() => setReturnShow(false)} />

                </div>
            </Modal>
        </div>
    );
};

export default Page;