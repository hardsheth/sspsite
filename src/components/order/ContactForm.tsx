import { Controller, useFormContext } from "react-hook-form"
import Input from "../form/input/InputField";
import Label from "../form/Label";

const ContactForm = () => {
    const method = useFormContext();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label>
                    Phone Number
                </Label>
                <Controller
                    name={`contactNumbers.0`}
                    control={method.control}
                    render={({ field, fieldState: { error } }) => (
                        <Input placeholder="Enter Phone Number" type="text" hint={error?.message} error={error ? true : false} {...field} />
                    )}
                />
            </div>
            <div>
                <Label>
                    Phone Number
                </Label>
                <Controller
                    name={`contactNumbers.1`}
                    control={method.control}
                    render={({ field, fieldState: { error } }) => (
                        <Input placeholder="Enter Phone Number" type="text" hint={error?.message} error={error ? true : false} {...field} />
                    )}
                />
            </div>
        </div>
    )
}

export default ContactForm
