/* eslint-disable react/prop-types */
import React from 'react'
import Flatpickr from "react-flatpickr";
import { Row, Col, Form, FormGroup, Label, Button } from "reactstrap";


const ReverseForm = ({ voucherRef, setVoucherRef,
    voucherDate, setVoucherDate, voucherAmount,
    setVoucherAmount, reason, setReason, reverseVoucher
}) => {

    // console.log(voucherDate)

    return (
        <div>
            <Form>
                <FormGroup className='mb-4'>
                    <Row>
                        <Col sm={12} md={6} lg={3}>
                            <Label for="voucherRef" size="md">Voucher Ref</Label>
                        </Col>
                        <Col sm={12} md={6} lg={9}>
                            <input
                                type="text"
                                id="voucherRef"
                                name="voucherRef"
                                placeholder='Enter Voucher Reference'
                                className='form-control'
                                value={voucherRef}
                                onChange={(e) => setVoucherRef(e.target.value)}
                            />
                        </Col>
                    </Row>
                </FormGroup>

                <FormGroup className='mb-4'>
                    <Row>
                        <Col sm={12} md={6} lg={3}>
                            <Label for="voucherDate" size="md">Voucher Date</Label>
                        </Col>
                        <Col sm={12} md={6} lg={9}>
                            <Flatpickr
                                className="form-control"
                                placeholder="dd/mm/yyyy"
                                options={{
                                    altInput: true,
                                    altFormat: "d/m/Y",
                                    allowInput: true,
                                }}
                                id="date"
                                name="date"
                                value={voucherDate}
                                onChange={(e, date) => setVoucherDate(date)}
                                onClose={(e, date) => setVoucherDate(date)}
                                onReady={(selectedDates, dateStr, instance) => {
                                    const inputElement = instance.altInput;
                                    if (inputElement) {
                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </FormGroup>

                <FormGroup className='mb-4'>
                    <Row>
                        <Col sm={12} md={6} lg={3}>
                            <Label for="voucherAmount" size="md">Voucher Amount</Label>
                        </Col>
                        <Col sm={12} md={6} lg={9}>
                            <input
                                type="number"
                                id="voucherAmount"
                                name="voucherAmount"
                                placeholder='Enter Voucher Amount'
                                className='form-control'
                                value={voucherAmount}
                                onChange={(e) => setVoucherAmount(e.target.value)}
                            />
                        </Col>
                    </Row>
                </FormGroup>

                <FormGroup className='mb-4'>
                    <Row>
                        <Col sm={12} md={6} lg={3}>
                            <Label for="reason" size="md">Reason</Label>
                        </Col>
                        <Col sm={12} md={6} lg={9}>
                            <input
                                className="form-control"
                                id="reason"
                                name="reason"
                                placeholder='Why do you want to reverse this voucher?'
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </Col>
                    </Row>
                </FormGroup>

                <FormGroup className='text-end'>
                    <Button
                        type="button"
                        color="success"
                        className="mt-3 px-5"
                        onClick={reverseVoucher}
                    >
                        Reverse
                    </Button>
                </FormGroup>
            </Form>
        </div>
    )
}

export default ReverseForm