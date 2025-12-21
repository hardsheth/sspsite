// import { ReactNode } from "react";
// import DatePicker from "react-datepicker";
// import { Form } from "react-bootstrap";
// import { Controller, FieldValues, useFormState } from "react-hook-form";
// // import "./datepicker.css";
// import { SpeechInputProps } from "./NumberToText";
// import "react-datepicker/dist/react-datepicker.css";

// const BasicDatePicker = <T extends FieldValues>({
//   label = "Select Month End Date",
//   name,
//   control,
//   placeholder = "Select date",
//   require = false
//   disable = false,
// }: SpeechInputProps<T>) => {
//   const { errors } = useFormState({ control });
//   const error = errors[name];
//   return (
//     <div className="d-flex flex-column mb-3">
//       <Form.Label className="">{label} {require && <span className="text-danger">*</span>}</Form.Label>
//       <Controller
//         name={name}
//         control={control}
//         rules={require ? {
//           required: {
//             value: require,
//             message: `${label || name} is required`
//           }
//         } : {}}
//         render={({ field }) => (
//           <DatePicker
//             selected={field.value}
//             onChange={(date) => field.onChange(date)}
//             placeholderText={placeholder}
//             className={`form-control mui-input ${error ? "is-invalid" : ""}`}
//           // filterDate={(date) => date.getDay() !== 2}
//           />
//         )}
//       />
//       {error && <p className="invalid-feedback">{error.message as ReactNode}</p>}
//     </div>
//   );
// };

// export default BasicDatePicker;
