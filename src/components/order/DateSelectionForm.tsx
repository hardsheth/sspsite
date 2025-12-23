import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import DatePickerCustom from '../form/date-pickerCustom';

export const DateSelectionForm = () => {
    const { control, watch } = useFormContext()
    const bookingDate = watch('bookingDate')
    const deliveryDate = watch('deliveryDate')
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <Controller
                    name="bookingDate"
                    control={control}
                    rules={{
                        required: {
                            message: "Booking date is required",
                            value: true
                        }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <DatePickerCustom
                            id="date-picker"
                            label="Booking Date "
                            placeholder="Select a date"
                            required={true}
                            onChange={(dates, currentDateString) => {
                                field.onChange(currentDateString);
                            }}
                            error={error?.message}
                        />
                    )}
                />
            </div>
            <div>
                <Controller
                    name="deliveryDate"
                    control={control}
                    rules={{
                        required: {
                            message: "Delivery date is required",
                            value: true
                        }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <DatePickerCustom
                            id="date-picker-delivery"
                            label="Delivery Date"
                            placeholder="Select a date"
                            minDate={bookingDate}
                            required={true}
                            onChange={(dates, currentDateString) => {
                                field.onChange(currentDateString);
                            }}
                            error={error?.message}
                        />
                    )}
                />
            </div>
            <div>
                <Controller
                    name="returnDate"
                    control={control}
                    rules={{
                        required: {
                            message: "Return date is required",
                            value: true
                        }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <DatePickerCustom
                            id="date-picker-return"
                            label="Return Date "
                            placeholder="Select a date"
                            minDate={deliveryDate}
                            required={true}
                            onChange={(dates, currentDateString) => {
                                field.onChange(currentDateString);
                            }}
                            error={error?.message}
                        />
                    )}
                />
            </div>
        </div>
    )
}
