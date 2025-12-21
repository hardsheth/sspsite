import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import InputVoice from 'components/InputElements/InputVoice'
import InputNumberVoice from 'components/InputElements/InputNumberVoice'

interface Item {
  itemName: string
  quantity: string
}

const ItemBookForm = () => {
  const { control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const addItem = () => {
    append({ itemName: '', quantity: '1', pcs: '1' })
  }

  const removeItem = (index: number) => {
    remove(index)
  }

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <h5>Items</h5>
        {fields.map((field, index) => (
          <div key={field.id} className="row mb-3 align-items-top">
            <div className="col-12 col-md-4">
              <InputVoice
                label={`Item Name `}
                name={`items.${index}.itemName`}
                placeholder="Enter item name"
                control={control}
                require={true}
              />
            </div>
            <div className="col-12 col-md-3">
              <InputNumberVoice
                label={`Quantity `}
                name={`items.${index}.quantity`}
                placeholder="Enter quantity"
                control={control}
                require={true}
              />
           
            </div>
            <div className="col-12 col-md-3">
              <InputNumberVoice
                label={`Pcs `}
                name={`items.${index}.pcs`}
                placeholder="Enter pcs"
                control={control}
                require={true}
              />
            
            </div>
            <div className="col-12 col-md-2 my-auto">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={addItem}>
          Add Item
        </button>
      </div>
    </div>
  )
}

export default ItemBookForm
