"use client";
import Label from "../form/Label";
import Select from "../form/Select";
import DataTable from "../tables/DataTable";

export interface ViewFormValues {
  CustomerName: string;
  Address: string;
  BookingDate: Date | null;
  DeliveryDate: Date | null;
  ReturnDate: Date | null;
  PaymentMethod: string;
  Status: string;
  PaymentStatus: string
  ContactEmail: string;
  ContactNumbers: string[];
  Items: { ItemName: string; Quantity: string; Pcs: string, itemName: string; quantity: string; pcs: string }[];
  Rent?: number | string
  Deposit?: number | string
  Total?: number | string
  CustomerId: {
    Contact: string[],
    Address: string[],
    Customername: string,
  }
  PayDetails: {
    rent: number,
    deposit: number
  },
  transactions: [];
  Amount: number;
}

export const PaymentOptionsList = [
  { value: "UPI", label: "UPI" },
  { value: "Cash on Delivery", label: "Cash on Delivery" },
];

interface ViewOrderFormAdminProps {
  orderData: ViewFormValues | null;
}

export default function ViewOrderFormAdmin({ orderData }: ViewOrderFormAdminProps) {
  const header = [
    {
      header: "Name",
      accessorKey: "itemName",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Pcs",
      accessorKey: "pcs",
    }
  ];
  return (
    <div className="p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div>
          <Label> Booking Date</Label>
          <p>{orderData?.BookingDate ? new Date(orderData.BookingDate).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className=''>
          <Label> Delivery Date</Label>
          <p>{orderData?.DeliveryDate ? new Date(orderData.DeliveryDate).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className=''>
          <Label> Return Date</Label>
          <p>{orderData?.ReturnDate ? new Date(orderData.ReturnDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
      <div className="mb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>
              Phone Number
            </Label>
            <p>{orderData?.CustomerId?.Contact[0] || 'N/A'}</p>
          </div>
          <div>
            <Label>
              Phone Number
            </Label>
            <p>{orderData?.CustomerId.Contact[1] || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <Label>
          Customer Name
        </Label>
        <p>{orderData?.CustomerId.Customername || 'N/A'}</p>
      </div>
      <div className="mb-2">
        <Label>
          Address
        </Label>
        <p>
          {/* {JSON.stringify(orderData?.CustomerId)} */}
          {orderData?.CustomerId.Address[0] || 'N/A'}</p>
      </div>
      <div className="mb-2">
        <Label>
          Items Delivery
        </Label>
        <div className="mb-2 mt-2">
          <DataTable columns={header} data={orderData?.Items as []} pagination={false} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div>
          <Label>
            Payment Method
          </Label>
          <p>{orderData?.PaymentMethod || 'N/A'}</p>
        </div>
        <div>
          <Label>
            Payment Status
          </Label>
          <p className="capitalize">{orderData?.PaymentStatus || 'N/A'}</p>
        </div>
        <div>
          <Label>
            Order Status
          </Label>
          <p className="capitalize">{orderData?.Status || 'N/A'}</p>
        </div>
         <div>
          <Label>
            Total
          </Label>
          <p className="capitalize">{orderData?.Amount || 'N/A'}</p>
        </div>
         <div>
          <Label>
            Paid Amount
          </Label>
          <p className="capitalize">{orderData?.transactions.reduce((sum, item: any) => sum + item.totalAmount, 0) }</p>
        </div>
        <div>
          <Label>
            Remain Amount
          </Label>
          <p className="capitalize">{(orderData?.Amount||0) - (orderData?.transactions.reduce((sum, item: any) => sum + item.totalAmount, 0)||0) }</p>
        </div>
      </div>
    </div>
  );
}
