import { Controller, useFormContext } from "react-hook-form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import VoiceInput from "../form/voice-input/VoiceInput";
import { toWords } from "number-to-words";
import { useMemo } from "react";


const TotalForm = () => {
  const method = useFormContext();
  const rent = method.watch('rent')
  const deposit = method.watch('deposit')
  useMemo(() => {
    if (rent || deposit) {
      method.setValue('total', (Number(rent) || 0) + (Number(deposit) || 0))
    }
  }, [rent, deposit])
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* <Label>
        Rent <span className="text-error-500">*</span>
      </Label> */}
      <Controller
        name={`rent`}
        control={method.control}
        rules={{
          required: {
            message: "Rent is required",
            value: true
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <VoiceInput placeholder="Enter Rent" label="Rent" require={true} {...field} type="text" hint={error?.message} error={!!error} />
        )}
      />
      <Controller
        name={`deposit`}
        control={method.control}
        rules={{
          required: {
            message: "Deposit is required",
            value: true
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <VoiceInput placeholder="Enter Deposit" label="Deposit" require={true} {...field} type="text" hint={error?.message} error={!!error} />
        )}
      />
      {/* <Controller
        name={`total`}
        control={method.control}
        rules={{
          required: {
            message: "Deposit is required",
            value: true
          }
        }}
         render={({ field, fieldState: { error } }) => (
              <VoiceInput placeholder="Total Amount" label="Deposit" require={true} {...field} type="text" hint={error?.message} error={!!error} />
            )}
      /> */}
      <div className="mb-2">
        <Label>
          Total
        </Label>
        <Controller
          name={`total`}
          control={method.control}
          rules={{
          }}
          render={({ field, fieldState: { error } }) => {
            return (
              <Input placeholder="Total" type="number" hint={toWords(field.value || 0)} error={error ? true : false} {...field} disabled={true} defaultValue={field.value} />
            )
          }}
        />
      </div>
    </div>
  )
}
export default TotalForm;