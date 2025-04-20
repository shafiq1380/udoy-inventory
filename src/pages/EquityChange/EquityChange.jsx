import React, { useEffect, useState } from 'react'

import Flatpickr from "react-flatpickr";
import {
    Button, ButtonDropdown, Card, CardBody, Col,
    Container,
    DropdownItem, DropdownMenu, DropdownToggle,
    FormGroup, Input, InputGroup, Label, Row
} from 'reactstrap';

import Breadcrumb from '../../components/Common/Breadcrumb';

import { equityDownloadVoucherReport, equityShowPdfGenerator } from './EquityChnage';
import CustomSpinner from '../../components/Common/CustomSpinner';
import { useSelector } from 'react-redux';
import { authorization } from '../../components/Common/Authorization';

const EquityChange = () => {


    const [loading, setLoading] = useState(false)
    const [pdfLink, setpdfLink] = useState()
    const [btnDropdown, setBtnDropdown] = useState(false)
    const [equityType, setEquityType] = useState(1)
    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));

    const incomeShowPdf = () => {
        setLoading(!loading)
        const pefLink = equityShowPdfGenerator(transactionFrom, transactionTo, equityType);
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDownloadReport = (type) => {
        equityDownloadVoucherReport(
            transactionFrom,
            transactionTo,
            type,
            equityType
        )

    }

    // const handleChange = (e) => {
    //     setEquity(e.target.value)
    // }

    //Authorization check
    useEffect(() => {
        authorization(55)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Equity Change'} breadcrumbItem={' Equity Change'} />
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>

                                <FormGroup row>
                                    <Label for="transactionFrom" md={3} sm={2} size="lg">Period From</Label>
                                    <Col sm={10} md={4}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "d/m/Y",
                                                    altInput: true,
                                                    altFormat: "d/m/Y",
                                                    allowInput: true,
                                                }}
                                                id="date"
                                                name="date"
                                                onChange={(selectedDates, dateStr) => settransactionFrom(dateStr)}
                                                onClose={(selectedDates, dateStr) => settransactionFrom(dateStr)}
                                                onReady={(selectedDates, dateStr, instance) => {
                                                    const inputElement = instance.altInput;
                                                    if (inputElement) {
                                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                                    }
                                                }}
                                                value={transactionFrom}
                                            />
                                        </InputGroup>

                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="dateTo" md={3} sm={2} size="lg">Period To</Label>
                                    <Col sm={10} md={4}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "d/m/Y",
                                                    altInput: true,
                                                    altFormat: "d/m/Y",
                                                    allowInput: true,
                                                }}
                                                id="date"
                                                name="date"
                                                onChange={(selectedDates, dateStr) => settransactionTo(dateStr)}
                                                onClose={(selectedDates, dateStr) => settransactionTo(dateStr)}
                                                onReady={(selectedDates, dateStr, instance) => {
                                                    const inputElement = instance.altInput;
                                                    if (inputElement) {
                                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                                    }
                                                }}
                                                value={transactionTo}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>


                                <FormGroup row className='mt-3 mb-3'>
                                    <Label for="option" md={3} sm={2} size="lg"></Label>
                                    <Col sm={10} md={8}>
                                        <InputGroup size='lg'>
                                            <Label check className="fs-4 ">
                                                <Input type="radio"
                                                    value={equityType}
                                                    checked={equityType === 1}
                                                    onChange={() => setEquityType(1)}
                                                    className="fs-4 mx-2 border border-primary border-3 " />
                                                New Version
                                            </Label>
                                            <Label check className="fs-4 ms-2">
                                                <Input type="radio"
                                                    value={equityType}
                                                    checked={equityType === 0}
                                                    onChange={() => setEquityType(0)}
                                                    className="fs-4 mx-2 border border-primary border-3 " />
                                                Old Vesion
                                            </Label>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>



                                {/* btn for show and export report */}
                                <FormGroup row>
                                    <Label for="referenceTo" md={4} sm={2} size="lg"></Label>
                                    <Col sm={10} md={3} className='text-end'>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded px-4"
                                            onClick={incomeShowPdf}
                                        >
                                            Preview
                                        </Button>

                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                        // disabled={!selectedOption}
                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn-rounded px-4"
                                                // disabled={!selectedOption}
                                                >
                                                    Export Report
                                                </Button>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => handleDownloadReport('pdf')}>Export TO PDF</DropdownItem>
                                                <DropdownItem onClick={() => handleDownloadReport('doc')}>Export To Word</DropdownItem>
                                                <DropdownItem onClick={() => handleDownloadReport('xls')}>Export To Excel</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Col>
                    <Row style={{ height: '100vh', marginBottom: '20px' }}>
                        {
                            loading ?
                                <CustomSpinner />
                                :
                                <iframe src={pdfLink} width="100%" height="100%" frameBorder="0"></iframe>

                        }
                    </Row>
                </Row>
            </Container>
        </div >
    )
}

export default EquityChange