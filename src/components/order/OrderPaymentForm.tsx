import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { OrderPaymentStatusList, OrderStatusList, PaymentOptionsList } from 'utils/paymentOption'

const OrderPaymentForm = () => {
  const { control } = useFormContext()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Payment Method */}
      <div>
        <label className="block font-semibold mb-1">
          Payment Method <span className="text-red-500">*</span>
        </label>

        <Controller
          name="paymentMethod"
          control={control}
          rules={{ required: 'Payment Method is required' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <select
                {...field}
                className={`w-full rounded-md border px-3 py-2 capitalize focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${error ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Payment Method</option>
                {PaymentOptionsList.map((item, index) => (
                  <option key={index} value={item} className="capitalize">
                    {item}
                  </option>
                ))}
              </select>
              {error && <p className="text-red-500 text-sm mt-1">{error.message as ReactNode}</p>}
            </>
          )}
        />
      </div>

      {/* Order Status */}
      <div>
        <label className="block font-semibold mb-1">
          Order Status <span className="text-red-500">*</span>
        </label>

        <Controller
          name="orderStatus"
          control={control}
          rules={{ required: 'Order Status is required' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <select
                {...field}
                className={`w-full rounded-md border px-3 py-2 capitalize
                  ${error ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Order Status</option>
                {OrderStatusList.map((item, index) => (
                  <option key={index} value={item} className="capitalize">
                    {item}
                  </option>
                ))}
              </select>
              {error && <p className="text-red-500 text-sm mt-1">{error.message as ReactNode}</p>}
            </>
          )}
        />
      </div>

      {/* Payment Status */}
      <div>
        <label className="block font-semibold mb-1">
          Payment Status <span className="text-red-500">*</span>
        </label>

        <Controller
          name="paymentStatus"
          control={control}
          rules={{ required: 'Payment Status is required' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <select
                {...field}
                className={`w-full rounded-md border px-3 py-2 capitalize
                  ${error ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Payment Status</option>
                {OrderPaymentStatusList.map((item, index) => (
                  <option key={index} value={item} className="capitalize">
                    {item}
                  </option>
                ))}
              </select>
              {error && <p className="text-red-500 text-sm mt-1">{error.message as ReactNode}</p>}
            </>
          )}
        />
      </div>
    </div>
  )
}

export default OrderPaymentForm
