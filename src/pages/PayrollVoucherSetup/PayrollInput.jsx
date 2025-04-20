import React from 'react'
import { Col, FormGroup, Input, InputGroup, Label } from 'reactstrap'

const PayrollInput = ({ lable, placeholder, value, onChangeHandler, name }) => {
    return (
        <FormGroup>
            <Label>{lable}</Label>
            <InputGroup size='md'>
                <Input
                    placeholder={placeholder}
                    name={name}
                    type="text"
                    value={value ? value : ""}
                    onChange={onChangeHandler}
                />
            </InputGroup>
        </FormGroup>
    )
}

export default PayrollInput