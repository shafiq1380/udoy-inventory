import React from 'react'

import { Card, CardBody, Row, Col, Label, InputGroup, } from 'reactstrap';
import Flatpickr from "react-flatpickr";

const PrchScenContent = ({ tranDate, setTranDate, deptSelect, setDeptSelect, reasonSelect, setReasonSelect }) => {

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md={4}>
                        <Row>
                            <Col >
                                <Label for="transactionDate" size='lg'>Transaction Date</Label>
                            </Col>
                            <Col md={12}>
                                <InputGroup >
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd M,yyyy"
                                        options={{
                                            altInput: true,
                                            dateFormat: "d/m/Y"
                                        }}
                                        onChange={(e, date) => setTranDate(date)}
                                        value={tranDate}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4}>
                        <Row>
                            <Col >
                                <Label for="department" size='lg'>Department</Label>
                            </Col>

                            <Col md={12}>
                                <select className="form-control">
                                    <option>Select Department</option>
                                    {/* {allVoucherType.map((item, index) => (
                                        <option key={index} value={item.jrnType}>
                                            {item.jrnDescription}
                                        </option>
                                    ))} */}
                                </select>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* reason/ */}
                <Row className='mt-1'>
                    <Col md={8}>
                        <Label for="reason" size='lg'>Reason</Label>
                    </Col>
                    <Col md={8}>
                        <textarea
                            className="form-control"
                            id="reason"
                            rows="2"
                            placeholder="Reason"
                            value={reasonSelect}
                            onChange={(e) => setReasonSelect(e.target.value)}
                        ></textarea>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default PrchScenContent