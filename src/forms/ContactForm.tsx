import { useFormContext } from 'react-hook-form'
import InputVoice from 'components/InputElements/InputVoice'

const ContactForm = () => {
    const { control } = useFormContext()

    return (
        <div className="row">
            <div className="col-12 col-md-6 mb-3">
                <InputVoice
                    label="Phone Number 1"
                    name="contactNumbers.0"
                    placeholder="Enter phone number 1"
                    control={control}
                    require={true}
                />
            </div>
            <div className="col-12 col-md-6 mb-3">
                <InputVoice
                    label="Phone Number 2"
                    name="contactNumbers.1"
                    placeholder="Enter phone number 2"
                    control={control}
                />
            </div>
        </div>
    )
}

export default ContactForm
