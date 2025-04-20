import React, { useEffect } from 'react'
import { Col } from 'reactstrap'

const GpfCheckBox = ({ handleCheckBox, value, name }) => {

    return (
        <Col md={1} className="fs-4 d-flex align-items-center mb-sm-2">
            <label className="form-check-label">All</label>
            <input
                type="checkbox"
                className="form-check-input checkboxboder mx-2 p-3"
                name={name}
                checked={value}
                // defaultChecked={value}
                onClick={handleCheckBox}
            />
        </Col >
    )
}

export default GpfCheckBox