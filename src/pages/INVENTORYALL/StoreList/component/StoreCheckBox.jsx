import React from 'react'
import { Col, Input, Label } from 'reactstrap'

const StoreCheckBox = ({ title, name, handleCheckBox, value }) => {


    return (
        <Col md={6} className='my-2'>
            <div>
                <Label className='cursor-pointer p-2 fs-5 d-inline'>
                    {title} ?
                    <Input
                        type="checkbox"
                        className="form-check-input mx-2 p-2 border border-3   border-success"
                        name={name}
                        value={value}
                        checked={value === 1 ? true : false}
                        onChange={(e) => handleCheckBox(e)}
                    />
                </Label>
            </div>

        </Col>
    )
}

export default StoreCheckBox