import React from 'react'
import { Col, } from 'reactstrap'

const CheckBox = ({ handleCheckBox, value }) => {

    return (
        <Col md={3} sm={6} className='align-self-end'>
            <div className="fs-4 px-2 d-flex align-items-center">
                <label className="form-check-label">Is Serial</label>
                <input
                    type="checkbox"
                    className="form-check-input checkboxboder mx-2 p-3"
                    // name='isSerial'
                    value={value}
                    defaultChecked={value}
                    onClick={handleCheckBox}
                />
            </div>
        </Col>
    )
}

export default CheckBox