"use client";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { DateSelectionForm } from "./DateSelectionForm";
import Form from "../form/Form";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import VoiceInput from "../form/voice-input/VoiceInput";
import VoiceTextarea from "../form/voice-input/VoiceTextArea";
import ContactForm from "./ContactForm";
import ItemBookForm from "./ItemBookForm";
import TotalForm from "./TotalForm";
import Select from "../form/Select";
import { ReactNode } from "react";

interface FormValues {
  customerName: string;
  address: string;
  bookingDate: Date | null;
  deliveryDate: Date | null;
  returnDate: Date | null;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string
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

export default function OrderFormAdmin() {

  const method = useForm<FormValues>({
    defaultValues: {
      customerName: ""
    },
  });

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    const restructureData = JSON.parse(JSON.stringify(data));
    restructureData.contactNumbers = restructureData.contactNumbers.filter((item: string) => (item !== null && item !== ''))
    const apiCall = await fetch(`/api/order`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restructureData),
    });
    const response = apiCall.json();
    console.log(response, 'response ----------------------');

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
        <div className="grid grid-cols-1 md:grid-cols-3 mb-2">
          <div>
            <Controller
              name="paymentMethod"
              control={method.control}
              rules={{
                required: {
                  message: "Payment Method is required",
                  value: true
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Label>
                    Payment Method
                  </Label>
                  <Select
                    options={PaymentOptionsList}
                    placeholder="Select Option"
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
        </div>
        <button type="submit" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600">Submit</button>
      </Form>
    </FormProvider>
  );
}
