"use client";
import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";
import { DateSelectionForm } from "./DateSelectionForm";
import Form from "../form/Form";
import Label from "../form/Label";
import VoiceInput from "../form/voice-input/VoiceInput";
import VoiceTextarea from "../form/voice-input/VoiceTextArea";
import ContactForm from "./ContactForm";
import ItemBookForm from "./ItemBookForm";
import TotalForm from "./TotalForm";
import Select from "../form/Select";
import { ReactNode, useEffect } from "react";
import { ViewFormValues } from "./ViewOrderFormAdmin";
import Input from "../form/input/InputField";
import CustomSelect from "../form/CustomSelect";

interface FormValues {
  customerName: string;
  address: string;
  bookingDate: Date | null;
  deliveryDate: Date | null;
  returnDate: Date | null;
  paymentMethod: string;
  OrderStatus: string;
  advancePaid: string | number;
  remainAmount: string | number;
  PaymentStatus: string
  contactEmail: string;
  contactNumbers: string[];
  items: { itemName: string; quantity: string; pcs: string }[];
  rent?: number | string
  deposit?: number | string
  total?: number | string
}

export const PaymentOptionsList = [
  { value: "UPI", label: "UPI" },
  { value: "Cash on Delivery", label: "Cash on Delivery" },
];

export const OrderStatusList = [
  { value: "created", label: "Created" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
  { value: "cancelled", label: "Cancelled" },
];

export const PaymentStatusList = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "partially_refunded", label: "Partially Refunded" },
  { value: "partially_paid", label: "Partially Paid" },
  { value: "cancelled", label: "Cancelled" },
];

interface UpdateOrderFormAdminProps {
  orderData: FormValues | ViewFormValues | null;
  submitData: (data: any) => void;
}

export default function UpdateOrderFormAdmin({ orderData, submitData }: UpdateOrderFormAdminProps) {

  const method = useForm<FormValues>({
    defaultValues: orderData as FormValues || {
      customerName: "",
      address: "",
      bookingDate: null,
      deliveryDate: null,
      returnDate: null,
      paymentMethod: "",
      orderStatus: "",
      paymentStatus: "",
      contactEmail: "",
      contactNumbers: [],
      items: [],
      rent: "",
      deposit: "",
      total: ""
    },
  });

  useEffect(
    () => {
      console.log(orderData, `orderData---------------`);
      const details = orderData as ViewFormValues
      console.log(details, `details of ordere data`);
      method.setValue('bookingDate', new Date(details.BookingDate as Date));
      method.setValue('deliveryDate', new Date(details.DeliveryDate as Date));
      method.setValue('returnDate', new Date(details.ReturnDate as Date));
      method.setValue('contactNumbers.0', details?.CustomerId?.Contact[0]);
      method.setValue('contactNumbers.1', details?.CustomerId?.Contact[1]);
      method.setValue('address', details?.CustomerId.Address[0]);
      method.setValue('customerName', details?.CustomerId.Customername);
      method.setValue('rent', details?.PayDetails.rent);
      method.setValue('deposit', details?.PayDetails.deposit);
      method.setValue('PaymentStatus', details?.PaymentStatus);
      method.setValue('OrderStatus', details?.Status);
      // if(details.transactions){
      const total = Number(details?.PayDetails.rent) + Number(details?.PayDetails.deposit);
      const paidAdvance = details.transactions.reduce((sum, item: any) => sum + item.totalAmount, 0);
      method.setValue('remainAmount', total - paidAdvance);
      method.setValue('advancePaid', paidAdvance);
      // }
      method.setValue(
        'items',
        details.Items.map(item => ({
          itemName: item.itemName,
          quantity: item.quantity,
          pcs: item.pcs,
        }))
      );
    },
    [orderData],
  )


  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    submitData(data);
  };

  return (
    <FormProvider {...method}>
      <Form onSubmit={method.handleSubmit(onSubmit)} className="p-6 w-full">
        <DateSelectionForm />
        <div className="mb-2">
          <ContactForm />
        </div>
        <div className="mb-2">
          <Controller
            name="customerName"
            control={method.control}
            rules={{
              required: {
                message: "Customer name is required",
                value: true
              }
            }}
            render={({ field, fieldState: { error } }) => (
              <VoiceInput placeholder="Email" label="Customer Name" require={true} {...field} type="text" hint={error?.message} error={!!error} />
            )}
          />
        </div>
        <div className="mb-2">
          <Controller
            name="address"
            control={method.control}
            rules={{
              required: {
                message: "Address is required",
                value: true
              }
            }}
            render={({ field, fieldState: { error } }) => (
              <VoiceTextarea placeholder="Address" label="Address" require={true} {...field} hint={error?.message} error={!!error} />
            )}
          />
        </div>
        <div className="mb-2">
          <ItemBookForm />
        </div>
        <div className="mb-2">
          <TotalForm />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div>
            <Label>
              Advance Payment <span className="text-error-500">*</span>
            </Label>
            <Controller
              name="advancePaid"
              control={method.control}
              rules={{
                required: {
                  message: "Advance Payment is required",
                  value: true
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <Input placeholder="Advance Paid Amount" type="number" hint={error?.message} error={error ? true : false} {...field} defaultValue={field.value} />
              )}
            />
          </div>
          <div>
            <Label>
              Order Status <span className="text-error-500">*</span>
            </Label>
            <Controller
              name="OrderStatus"
              control={method.control}
              rules={{
                required: {
                  message: "Order Status is required",
                  value: true
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <CustomSelect
                    options={OrderStatusList}
                    placeholder="Select Option"
                    defaultValue={field.value}
                    {...field}
                    className="dark:bg-dark-900"
                  />
                  {error && <p
                    className={`mt-1.5 text-xs text-error-500`}
                  >
                    {error as ReactNode}
                  </p>}
                </>
              )}
            />
          </div>
          <div>
            <Label>
              Payment Status
            </Label>
            <Controller
              name="PaymentStatus"
              control={method.control}
              rules={{
                required: {
                  message: "Payment Method is required",
                  value: true
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <CustomSelect
                    options={PaymentStatusList}
                    placeholder="Select Option"
                    defaultValue={field.value}
                    {...field}
                    className="dark:bg-dark-900"
                  />
                  {error && <p
                    className={`mt-1.5 text-xs text-error-500`}
                  >
                    {error as ReactNode}
                  </p>}
                </>
              )}
            />
          </div>
          <div>
            <Label>
              Remaining Amount <span className="text-error-500">*</span>
            </Label>
            <Controller
              name="remainAmount"
              control={method.control}
              rules={{
                required: {
                  message: "Remain Amount is required",
                  value: true
                },
                min: 0,
                max: {
                  value: (Number(method.watch('total')) - (Number(method.watch('advancePaid') || 0))),
                  message: `Max Amount can be accepted is ${(Number(method.watch('total')) - (Number(method.watch('advancePaid') || 0)))}`
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <Input placeholder="Remaining Amount" type="number" hint={error?.message} error={error ? true : false} {...field} defaultValue={field.value} />
              )}
            />
          </div>
          {/* <div>
            <Label>
              Pay Amount <span className="text-error-500">*</span>
            </Label>
            <Controller
              name="PayAmount"
              control={method.control}
              rules={{
                required: {
                  message: "Remain Amount is required",
                  value: true
                },
                min: 0,
                max: {
                  value: (Number(method.watch('total')) - (Number(method.watch('advancePaid') || 0))),
                  message: `Please Enter`
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <Input placeholder="Remaining Amount" type="number" hint={error?.message} error={error ? true : false} {...field} defaultValue={field.value} />
              )}
            />
          </div> */}

        </div>
        <div className="flex justify-center gap-4">
          <button type="submit" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600">Submit</button>
          <button type="reset" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600">Cancel</button>
        </div>
      </Form>
    </FormProvider>
  );
}
