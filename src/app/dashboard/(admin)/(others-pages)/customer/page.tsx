import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/tables/DataTable"

async function getCustomers() {
    const res = await fetch(`${process.env.APP_BASE_URL}/api/customer`, {
        cache: "no-store",
    });
    const response = await res.json();

    return response.fetchingcustomerloans;
}

const page = async () => {
    const data = await getCustomers();
    const header = [

        {
            header: "Customer Name",
            accessorKey: "Customername",
        },
        {
            header: "Address",
            accessorKey: "Address",
            // cell: info => (
            //     <span className="hidden md:inline">
            //         {info.getValue() as string}
            //     </span>
            // ),
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
                <ComponentCard title="Customer List">
                    <DataTable columns={header} data={data} />
                </ComponentCard>
            </div>
        </div>
    )
}


export default page