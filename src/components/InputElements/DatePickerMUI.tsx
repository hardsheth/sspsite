import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FieldValues, Controller, useFormState } from "react-hook-form";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import moment from "moment";
import { SpeechInputProps } from './NumberToText';
import { CustomDay } from './CustomDay';
import { get } from 'lodash';

type DatePickerMUIProps<T extends FieldValues> = SpeechInputProps<T> & {
    minDate?: moment.Moment | null;
    maxDate?: moment.Moment | null;
};


const BasicDatePicker = <T extends FieldValues>({
    label = "Select Month End Date",
    name,
    control,
    placeholder = "Select date",
    require = false,
    minDate = null,
    disable = false,
    maxDate = null
}: DatePickerMUIProps<T>) => {

    const { errors } = useFormState({ control });
    const error = get(errors, name);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DemoContainer components={['DatePicker']}>

                <Controller
                    name={name}
                    control={control}
                    rules={{
                        required: require ? `${label} is required` : false,
                    }}
                    render={({ field }) => (
                        <DatePicker
                            label={label}
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    error: !!error,
                                    helperText: error ? String(error.message) : "",
                                    placeholder,
                                },
                            }}
                            format="DD/MM/YY"
                            minDate={minDate ?? undefined}
                            maxDate={maxDate ?? undefined}
                            slots={{
                                day: CustomDay,   // ← Enable holiday renderer
                            }}
                            // ⛔ Disable every Tuesday
                            shouldDisableDate={(date) => moment(date).day() === 2}
                        />
                    )}
                />

            </DemoContainer>
        </LocalizationProvider>
    );
};

export default BasicDatePicker;
