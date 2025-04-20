import React from 'react'
import { Col, FormGroup, Label } from 'reactstrap'

const TotalValue = ({ value, color }) => {
    return (
        <FormGroup row className='align-items-center'>
            <Label for="bankCode" md={4} size="lg">Total </Label>
            <Col sm={10} md={4}>
                <h3 className={`text-${color} text-end pe-3 mb-0`}>{value}</h3>
            </Col>
        </FormGroup>
    )
}

export default TotalValue