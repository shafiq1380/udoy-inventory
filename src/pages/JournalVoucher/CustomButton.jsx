import React from 'react'
import { Button } from 'reactstrap'

const CustomButton = ({ text, onClick, color, disabled }) => {
    return (
        <Button
            type="button"
            color={`${color ? 'info' : "success"}`}
            className="btn-rounded px-4"
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </Button>
    )
}

export default CustomButton
