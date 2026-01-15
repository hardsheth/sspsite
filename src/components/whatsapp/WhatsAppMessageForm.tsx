"use client";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Form from "../form/Form";
import { MultiInput } from "../ui/InputMulti";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import FileInputExample from "../form/form-elements/FileInputExample";

type Option = {
  label: string;
  value: string;
};
interface FormValues {
  message: string;
  contactNumbers: Option[];
  file?: File;
}

export interface CustomFormProps {
  onConfirm: (data: any) => void;
  onCancel: () => void;
}


export default function WhatsAppMessageForm({ onCancel, onConfirm }: CustomFormProps) {

  const method = useForm<FormValues>({
    defaultValues: {
      message: "",
      contactNumbers: []
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    onConfirm(data);
  };

  return (
    <FormProvider {...method}>
      <Form onSubmit={method.handleSubmit(onSubmit)} className="p-6 w-full">
        <div className="mb-6">
          <Controller
            name="contactNumbers"
            control={method.control}
            rules={{
              required: {
                message: "At least one contact number is required",
                value: true
              }
            }}
            render={({ field, fieldState: { error } }) => {
              console.log(field.value, `field.value`);
              return (

                <>
                  <Label>
                    Contact Numbers <span className="text-error-500">*</span>
                  </Label>
                  <MultiInput
                    placeholder="Contact No"
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                  />
                  {error && (
                    <p className={`mt-1.5 text-xs text-error-500`}>
                      {error?.message}
                    </p>
                  )}
                </>
              )
            }}
          />
        </div>
        <div className="mb-6">
          <Label>
            Message
          </Label>
          <Controller
            name="message"
            control={method.control}
            rules={{
              required: {
                message: "Please enter the message",
                value: false
              }
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <Input placeholder="Enter Message" type="text" hint={error?.message} error={error ? true : false} {...field} />
              )
            }}
          />
        </div>
        <div className="mb-6">
          <Controller
            name="file"
            control={method.control}
            render={({ field, fieldState: { error } }) => {
              return (
                <input
                  type="file"
                  className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 custom-class`}
                  multiple={true}
                  onChange={(e) => {
                    // Pass the first file or the whole FileList to React Hook Form
                    const files = e.target.files;
                    if (files && files.length > 0 && files.length === 1) {
                      field.onChange(files[0]); // Use files for multiple, files[0] for single
                    } else if (files && files.length > 0) {
                      field.onChange(files);
                    } else {
                      field.onChange(null);
                    }
                  }}
                />
              )
            }}
          />
        </div>
        {/* <button type="submit" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600">Submit</button> */}
        <div className="flex items-center justify-center w-full gap-3 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={()=>onSubmit}
          >
            Send Message
          </button>
        </div>
      </Form>
    </FormProvider>
  );
}
