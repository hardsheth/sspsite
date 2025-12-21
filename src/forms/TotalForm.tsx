import { useFormContext } from 'react-hook-form'
import InputNumberVoice from 'components/InputElements/InputNumberVoice'
import NumberToText from 'components/InputElements/NumberToText'
import { useEffect } from 'react'

const TotalForm = () => {
    const { control, setValue, watch } = useFormContext()
    const rentAmount = watch("rent");
    const depositAmount = watch("deposit");

    useEffect(() => {
        setValue("total", ((Number(rentAmount) || 0) + (Number(depositAmount) || 0)))
    }, [rentAmount, depositAmount])

    return (
        <div className="row">
            <div className="col-12 col-md-4 mb-3">
                <InputNumberVoice
                    label="Rent"
                    name="rent"
                    placeholder="Enter Rent Amount"
                    control={control}
                    require={true}
                />
            </div>
            <div className="col-12 col-md-4 mb-3">
                <InputNumberVoice
                    label="Deposit"
                    name="deposit"
                    placeholder="Enter Deposite Amount"
                    control={control}
                    require={true}
                />
            </div>
            <div className="col-12 col-md-4 mb-3">
                <NumberToText
                    label="Total"
                    name="total"
                    placeholder="Total Amount"
                    control={control}
                    disable={true}
                />
            </div>
        </div>
    )
}

export default TotalForm
