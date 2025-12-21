import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { OrderPaymentStatusList, OrderStatusList, PaymentOptionsList } from 'utils/paymentOption';

const OrderPaymentForm = () => {
    const { control, } = useFormContext()

    return (
        <div className="row">
            <div className="col-12 col-md-4 mt-3">
                <label className="form-label fw-bold">Payment Method <span className="text-danger"> *</span></label>

                <Controller
                    name={`paymentMethod`}
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: `Payment Method is required`
                        }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <>
                            <select className={`form-select ${error ? 'is-invalid' : ''} text-capitalize`} {...field}>
                                <option value="">Select Payment Method</option>
                                {
                                    PaymentOptionsList.map((ItemBookForm, index) => {
                                        return (
                                            <option value={ItemBookForm} key={index + 1} className = 'text-capitalize'>{ItemBookForm}</option>
                                        )
                                    })
                                }
                            </select>
                            {error && <p className="invalid-feedback">{error.message as ReactNode}</p>}
                        </>
                    )}
                />
            </div>
            <div className="col-12 col-md-4 mt-3">
                <label className="form-label fw-bold">Order Status <span className="text-danger"> *</span></label>

                <Controller
                    name={`orderStatus`}
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: `Order Status is required`
                        }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <>
                            <select className={`form-select ${error ? 'is-invalid' : ''} text-capitalize`} {...field}>
                                <option value="">Select Order Status</option>
                                {
                                    OrderStatusList.map((ItemBookForm, index) => {
                                        return (
                                            <option value={ItemBookForm} key={index + 1} className = 'text-capitalize'>{ItemBookForm}</option>
                                        )
                                    })
                                }
                            </select>
                            {error && <p className="invalid-feedback">{error.message as ReactNode}</p>}
                        </>
                    )}
                />
            </div>
            <div className="col-12 col-md-4 mt-3">
                <label className="form-label fw-bold">Payment Status <span className="text-danger"> *</span></label>
                <Controller
                    name={`paymentStatus`}
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: `Payment Method is required`
                        }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <>
                            <select className={`form-select ${error ? 'is-invalid' : ''} text-capitalize`} {...field}>
                                <option value="">Select Payment Status</option>
                                {
                                    OrderPaymentStatusList.map((ItemBookForm, index) => {
                                        return (
                                            <option value={ItemBookForm} key={index + 1} className = 'text-capitalize'>{ItemBookForm}</option>
                                        )
                                    })}
                            </select>
                            {error && <div className="invalid-feedback">{error.message as ReactNode}</div>}
                        </>
                    )
                    }
                />
            </div>
        </div>
    )
}

export default OrderPaymentForm
