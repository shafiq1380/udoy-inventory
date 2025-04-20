import React, { useState } from 'react'
import { Col, FormGroup, Input, Label } from 'reactstrap'

const PayRollItem = ({ item, handleChange }) => {

    //handle arrow button 
    const handleArrowBtn = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const borderClass = (item?.forCode === 'House Rent Allownce' || item?.forCode === 'Basic')
        ? ' text-success border-success fw-bold'
        : '';

    const border3Class = (item?.forCode === 'Pension' || item?.forCode === 'Provision for Pension')
        ? ' text-primary border-primary fw-bold'
        : '';
    const border4Class = (item?.forCode === 'Leave Pay and Gratuity' || item?.forCode === 'Provision for Leave Pay and Gratuity')
        ? ' text-success border-success fw-bold'
        : '';



    // console.log(item)

    return (
        <div>
            <FormGroup row className={`text-start`}>

                <Label for="bankCode" md={4} size="md" className={`text-start ${borderClass} ${border3Class} ${border4Class}`}>{item?.forCode}</Label>

                <Col sm={10} md={4} >
                    <Input
                        id="bankCode"
                        type='text'
                        name={item?.forName}
                        // placeholder={`Enter ${item.forName}`}
                        className={`custom-input text-end text-start  ${borderClass}  ${border3Class} ${border4Class}`}
                        bsSize="md"
                        value={item?.amount > -1 ? item?.amount : 0}
                        // value={item?.forCode === 'Revenue stamp' ? (item.amount !== undefined && item.amount > 0 ? item.amount : 10) : item?.amount ?? 0}

                        onChange={(e) => handleChange(item?.id, e.target.value, item?.forCode)}
                        onKeyDown={handleArrowBtn}
                        onKeyUp={handleArrowBtn}

                    />

                </Col>
            </FormGroup>
        </div>
    )
}

export default PayRollItem