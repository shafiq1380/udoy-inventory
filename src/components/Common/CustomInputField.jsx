import React from 'react'
import { Col, Input, Label } from 'reactstrap'

const CustomInputField = ({ label, name, placeholder, handleInput, value, notEditable }) => {
    return (
        <Col className="col-12">
            <div className="mb-3">
                <Label className="form-label">
                    {label}
                </Label>
                <Input
                    name={name}
                    type="text"
                    placeholder={placeholder}
                    onChange={(e) => handleInput(e)}
                    onBlur={handleInput}
                    value={value}
                    readOnly={notEditable}
                    className={notEditable ? 'bg-secondary text-white' : ''}
                />
            </div>
        </Col>
    )
}

export default CustomInputField