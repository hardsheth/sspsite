// SpeechToTextForm.tsx
import DatePickerMUI from "components/InputElements/DatePickerMUI";
import InputVoice from "components/InputElements/InputVoice";
import TextareaVoice from "components/InputElements/TextareaVoice";
import { SpeechProvider } from "components/InputElements/SpeechContext";
import ContactForm from "./ContactForm";
import ItemBookForm from "./ItemBookForm";
import moment from "moment";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PaymentOptionsList } from "utils/paymentOption";
import TotalForm from "./TotalForm";
import { useCreateOrder } from "hooks";
import { Alert } from "react-bootstrap";
import { useState } from "react";
import ConfirmAlert from "components/Alert";

interface FormValues {
  customerName: string;
  address: string;
  bookingDate: Date | null;
  deliveryDate: Date | null;
  returnDate: Date | null;
  paymentMethod: string;
  contactEmail: string;
  contactNumbers: string[];
  items: { itemName: string; quantity: string; pcs: string }[];
  rent?: number | string
  deposit?: number | string
  total?: number | string
}

export default function SpeechToTextForm() {
  const navigate = useNavigate();

  const { mutateAsync, isSuccess, isError } = useCreateOrder();
  const method = useForm<FormValues>({
    defaultValues: {
      customerName: "",
      paymentMethod: "",
      items: [{ itemName: '', quantity: '', pcs: '' }]
    }
  });
  const { control, formState: { errors }, reset } = method;
  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form submitted:", data);
      const restructureData = JSON.parse(JSON.stringify(data));
      restructureData.contactNumbers = restructureData.contactNumbers.filter((item: string) => (item !== null && item !== ''))
      await mutateAsync(restructureData);
      reset()
      reset({ items: [{ itemName: '', quantity: '', pcs: '' }], contactNumbers: ['', ''], rent: 0, deposit: 0 })
      // navigate('/orders/checkout', { state: { data: { amount: data.total, paymentMethod: data.paymentMethod } } });

    } catch (error) {

    }
  };

  return (
    <SpeechProvider>
      <FormProvider {...method}>
        <ConfirmAlert errorShow={isError} successShow={isSuccess} />
        <form onSubmit={method.handleSubmit(onSubmit)} className="p-3 row">
          {/* <div className="col-12 col-md-2">
          <InputVoice
            label="Order Name"
            name="orderName"
            placeholder="Speak or type order name..."
            control={control}
          />
          {errors.orderName && (
            <p className="invalid-feedback">Order name is required.</p>
          )}
        </div> */}
          {/* <div className="col-2">
        <FormDateTimeField
          control={control}
          name="startDate"
          label="Start Date"
        />
      </div> */}
          <div className="col-12 col-md-4 mb-3">
            <DatePickerMUI
              name="bookingDate"
              control={control}
              label="Booking Date"
              placeholder="Select booking date"
              require={true}
              minDate={moment("2025-12-1")}
            />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <DatePickerMUI
              name="deliveryDate"
              control={control}
              label="Delivery Date"
              placeholder="Select delivery date"
              require={true}
            />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <DatePickerMUI
              name="returnDate"
              control={control}
              label="Return Date"
              placeholder="Select return date"
              require={true}
            />
          </div>

          <div className="col-12 ">
            <InputVoice
              label="Customer Name"
              name="customerName"
              placeholder="Speak or type order name..."
              control={control}
              require={true}
            />
          </div>
          <div className="col-12 ">
            <TextareaVoice
              label="Address"
              name="address"
              placeholder="Speak or type order name..."
              control={control}
              require={true}
            />
          </div>

          {/* <div className="col ">
        <BasicDateTimePicker />
      </div> */}
          {/* <div className="col ">
          <label className="form-label fw-bold">Booking Date</label>
          <DateTimePicker />
        </div> */}
          <div className="col-12 mt-3">
            <ContactForm />
          </div>
          <div className="col-12 mt-3">
            <ItemBookForm />
          </div>
          <div className="row mt-3">
            <TotalForm />
          </div>
          <div className="col-12 col-md-4 mt-3">
            <label className="form-label fw-bold">Payment Method</label>
            <select
              className={`form-select ${errors.paymentMethod ? 'is-invalid' : ''}`}
              {...method.register("paymentMethod", { required: "Payment method is required" })}
            >
              <option value="">Select Payment Method</option>
              {
                PaymentOptionsList.map((ItemBookForm, index) => {
                  return (
                    <option value={ItemBookForm} key={index + 1} className='text-capitalize'>{ItemBookForm}</option>
                  )
                })
              }
            </select>
            {errors.paymentMethod && (
              <p className="invalid-feedback">{errors.paymentMethod.message}</p>
            )}
          </div>
          <div className="col-12 mt-3">
            <button type="submit" className="btn btn-success">
              Proceed to Checkout
            </button>
          </div>
        </form>
      </FormProvider>
    </SpeechProvider>
  );
}
