import React, { ReactNode } from 'react'
import { CustomFormProps } from '../whatsapp/WhatsAppMessageForm';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Form from '../form/Form';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import CustomSelect from '../form/CustomSelect';

enum RefundStatus {
    PENDING = "pending",
    APPROVED = 'approved',
    REFUNDED = "refunded",
    REJECTED = "rejected",
}

export const ReturnStatusList = [
    { value: RefundStatus.PENDING, label: "Pending" },
    { value: RefundStatus.APPROVED, label: "Approved" },
    { value: RefundStatus.REFUNDED, label: "Refunded" },
    { value: RefundStatus.REJECTED, label: "Rejected" },
];

export const ReturnOrderForm = ({ onCancel, onConfirm }: CustomFormProps) => {
    const method = useForm();
    const onSubmit = (data: any) => {
        console.log(data);
        onConfirm(data);
    };
    return (
        <FormProvider {...method}>
            <Form onSubmit={method.handleSubmit(onSubmit)} className="p-6 w-full">
                <div className="mb-2">
                    <Label>
                        Reason <span className='text-error-500'>*</span>
                    </Label>
                    <Controller
                        name="reason"
                        control={method.control}
                        rules={{
                            required: {
                                message: "Please enter the Reason",
                                value: false
                            }
                        }}
                        render={({ field, fieldState: { error } }) => {
                            return (
                                <Input placeholder="Enter Reason" type="text" hint={error?.message} error={error ? true : false} {...field} />
                            )
                        }}
                    />
                </div>
                <div className="mb-2">
                    <Label>
                        Amount <span className='text-error-500'>*</span>
                    </Label>
                    <Controller
                        name="returnAmount"
                        control={method.control}
                        rules={{
                            required: {
                                message: "Please enter the Amount",
                                value: false
                            }
                        }}
                        render={({ field, fieldState: { error } }) => {
                            return (
                                <Input placeholder="Enter Amount" type="number" hint={error?.message} error={error ? true : false} {...field} />
                            )
                        }}
                    />
                </div>
                <div className="mb-2">
                    <Label>
                        Refund Status <span className='text-error-500'>*</span>
                    </Label>
                    <Controller
                        name="returnStatus"
                        control={method.control}
                        rules={{
                            required: {
                                message: "Please enter the Return Status",
                                value: false
                            }
                        }}
                        render={({ field, fieldState: { error } }) => {
                            return (
                                <>
                                    <CustomSelect
                                        options={ReturnStatusList}
                                        placeholder="Select Return Order Option"
                                        defaultValue={field.value}
                                        {...field}
                                        className="dark:bg-dark-900"
                                    />
                                    {error && <p
                                        className={`mt-1.5 text-xs text-error-500`}
                                    >
                                        {error as ReactNode}
                                    </p>}
                                </>
                            )
                        }}
                    />
                </div>
                <div className="flex items-center justify-center w-full gap-3 mt-6">
                    <Button variant='light'
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button variant='danger'
                        onClick={() => onSubmit}
                    >
                        Proceed To Return
                    </Button>
                </div>
            </Form>
        </FormProvider>
    )
}
