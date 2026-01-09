import React from 'react'
import Label from '../form/Label'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import Input from '../form/input/InputField'

const ItemBookForm = () => {
    const method = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control: method.control,
        name: 'items'
    });
    const addItem = () => {
        append({ itemName: '', quantity: '1', pcs: '1' })
    }

    const removeItem = (index: number) => {
        remove(index)
    }

    return (
        <div className="space-y-4">
            <h5 className="text-lg font-semibold">Items</h5>

            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4">
                        <Label>
                            Item Name <span className="text-error-500">*</span>
                        </Label>
                        <Controller
                            name={`items.${index}.itemName`}
                            control={method.control}
                            rules={{
                                required: {
                                    message: "Item Name is required",
                                    value: true
                                }
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <Input placeholder="Enter Item Name" type="text" hint={error?.message} error={error ? true : false} {...field} />
                            )}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Label>
                            Quantity <span className="text-error-500">*</span>
                        </Label>
                        <Controller
                            name={`items.${index}.quantity`}
                            control={method.control}
                            rules={{
                                required: {
                                    message: "Quantity is required",
                                    value: true
                                }
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <Input placeholder="Enter Quantity" type="text" hint={error?.message} error={error ? true : false} {...field} />
                            )}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Label>
                            Pcs <span className="text-error-500">*</span>
                        </Label>
                        <Controller
                            name={`items.${index}.pcs`}
                            control={method.control}
                            rules={{
                                required: {
                                    message: "Pcs is required",
                                    value: true
                                }
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <Input placeholder="Enter Pcs" type="text" hint={error?.message} error={error ? true : false} {...field} />
                            )}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="w-full bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
                Add Item
            </button>
        </div>
    )
}

export default ItemBookForm



