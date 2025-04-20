import React from 'react'
import { Input, Label } from 'reactstrap'

const RadioButton = ({ name, value, label, selectedOption, handleOptionChange }) => {
    return (
        <>
            <Label check className="fs-4 ">
                <Input type="radio"
                    value={value}
                    checked={selectedOption === value}
                    onChange={handleOptionChange}
                    className="fs-4 mx-2 border border-primary border-3 " />
                {label}
            </Label>
        </>
    )
}

export default RadioButton