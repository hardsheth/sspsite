// SpeechToTextForm.tsx
import DatePickerMUI from "components/InputElements/DatePickerMUI";
import InputVoice from "components/InputElements/InputVoice";
import TextareaVoice from "components/InputElements/TextareaVoice";
import { SpeechProvider } from "components/InputElements/SpeechContext";
import ContactForm from "./ContactForm";
import ItemBookForm from "./ItemBookForm";
import moment from "moment";
import { FormProvider, useForm } from "react-hook-form";
import { OrderPaymentStatusList, OrderStatusList, PaymentOptionsList } from "utils/paymentOption";
import TotalForm from "./TotalForm";
import { useParams } from "react-router-dom";
import { useFetchOrderDetail } from "hooks";
import OrderPaymentForm from "./OrderPaymentForm";
import { useEffect } from "react";

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

export default function EditSpeechToTextForm() {
  const { orderId } = useParams<{ orderId: string }>();
  console.log(orderId, `orderId-orderId-orderId`);
  const { data, isLoading } = useFetchOrderDetail(orderId as string)
  console.log(data, `Edit order form`);


  const method = useForm<FormValues>({
    defaultValues: {
      customerName: "",
      paymentMethod: "",
      items: [{ itemName: '', quantity: '', pcs: '' }]
    }
  });
  const { control, setValue } = method;
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
  };
  useEffect(() => {
    if (data) {
      console.log(data?.bookingDate, `booking date`);

      setValue('bookingDate', moment(data?.bookingDate))
      setValue('deliveryDate', moment(data?.bookingDate))
      setValue('returnDate', moment(data?.returnDate))
      setValue('customerName', data.customerInfo.Customername)
      setValue('address', data.customerInfo.Address[0])
      setValue('paymentMethod', data.paymentMethod)
      setValue('paymentStatus', data.paymentStatus)
      setValue('orderStatus', data.status)
      setValue('rent', data.payDetails.rent)
      setValue('deposit', data.payDetails.deposit)
      setValue("items", data.items, {
        shouldValidate: true,
        shouldDirty: false,
      })
      setValue("contactNumbers", data.customerInfo.Contact, {
        shouldValidate: true,
        shouldDirty: false,
      })
    }
  }, [data])


  return (
    <SpeechProvider>
      <FormProvider {...method}>
        <form onSubmit={method.handleSubmit(onSubmit)} className="p-3 row">
          {/* <div className="col-12 col-md-2">
          <InputVoice
            label="Order Name"
            name="orderName"
            placeholder="Speak or type order name..."
            control={control}
          />
          {errors.orderName && (
            <p className="text-danger">Order name is required.</p>
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
          <div className="row">
            <OrderPaymentForm />
          </div>


          <div className="col-12 mt-3">
            <button type="submit" className="btn btn-success">
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </SpeechProvider>
  );
}
