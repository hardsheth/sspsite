"use client";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { DateSelectionForm } from "./DateSelectionForm";
import Form from "../form/Form";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import VoiceInput from "../form/voice-input/VoiceInput";
import VoiceTextarea from "../form/voice-input/VoiceTextArea";

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

export default function OrderForm() {

  const method = useForm<FormValues>({
    defaultValues: {
      customerName: ""
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <FormProvider {...method}>
      <Form onSubmit={method.handleSubmit(onSubmit)} className="p-6 w-full">
        <DateSelectionForm />
        <div>
         
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
         <div>
         
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
              <VoiceTextarea placeholder="Address" label="Address" require={true} {...field}  hint={error?.message} error={!!error} />
            )}
          />
        </div>
          {/* <Input placeholder="Email" {...register("email")} /> */}
        {/* 
        <Input placeholder="Booking Date" {...register("bookingDate")} />
        <Input placeholder="Delivery Date" {...register("deliveryDate")} />
        <Input placeholder="Return Date" {...register("returnDate")} />
        */}
        <button type="submit" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600">Submit</button>
      </Form>
    </FormProvider>
  );
}
