import React from 'react'
import { Col, FormGroup, Input, Label } from 'reactstrap'

const InvenItemInputField = ({ title, text, placeholder, onchangeInput, name, value, maxlength, disabled, defaultValue }) => {

    // console.log('Value', value)
    return (
        <Col md={3} sm={6} className='mt-2'>
            < Label for="dateTo" bsSize="md" className="me-2 text-nowrap " >
                {title} <span className='text-danger '>{text}</span>
            </Label >

            <div className='position-relative'>
                < Label className='position-absolute top-50 start-0 translate-middle-y ps-2' > {defaultValue}</Label >
                <Input
                    bsSize={"md"}
                    placeholder={placeholder}
                    name={name}
                    onChange={onchangeInput}
                    type='text'
                    value={defaultValue ? value?.toString().slice(-5) : value}
                    maxLength={maxlength}
                    disabled={disabled}
                    style={{ paddingLeft: `${defaultValue ? '55px' : ''}` }}
                />
            </div>
        </Col >

    )
}

export default InvenItemInputField