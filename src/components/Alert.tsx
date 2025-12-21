import React, { useState } from 'react'
import { Alert } from 'react-bootstrap'

type ConfirmALertProp = {
    successShow?: boolean;
    errorShow?: boolean
}

const ConfirmAlert = ({ errorShow = false, successShow = false }: ConfirmALertProp) => {
    const [success, setSuccess] = useState(successShow)
    const [error, setError] = useState(errorShow)
    if (success) {
        return (
            <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                Data Submitted
            </Alert>
        )
    } else if (error) {
        return (
            <Alert variant="danger" onClose={() => setError(false)} dismissible>
                Data Submission Unsuccessful
            </Alert>
        )
    }
}

export default ConfirmAlert