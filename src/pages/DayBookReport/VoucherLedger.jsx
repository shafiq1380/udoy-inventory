import React, { useEffect, useRef, useState } from 'react'

import Flatpickr from "react-flatpickr";
import {
    Button, ButtonDropdown, Card, CardBody, Col,
    Container,
    DropdownItem, DropdownMenu, DropdownToggle,
    FormGroup, Input, InputGroup, Label, Row
} from 'reactstrap';

import Breadcrumb from '../../components/Common/Breadcrumb';
import CustomSpinner from '../../components/Common/CustomSpinner';
import Select from 'react-select';
import { ledgerDownloadVoucherReport, ledgerShowPdfGenerator } from './ledgerPdfGenerator';
import { authorization } from '../../components/Common/Authorization';
import { useSelector } from 'react-redux';

const DayBookReport = () => {

    const [pdfLink, setpdfLink] = useState()
    const [btnDropdown, setBtnDropdown] = useState(false)
    const [loading, setLoading] = useState(false)

    const [selectedOption, setSelectedOption] = useState();

    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));


    const ledgerShowPdf = () => {
        setLoading(!loading)
        const pefLink = ledgerShowPdfGenerator(transactionFrom, transactionTo, selectedOption?.value);
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDownloadReport = (type) => {
        ledgerDownloadVoucherReport(
            transactionFrom,
            transactionTo,
            selectedOption?.value,
            type
        )

    }

    const options = [
        {
            value: 1,
            label: 'Both Cash & Bank'
        },
        {
            value: 2,
            label: 'Cash Only'
        },
        {
            value: 3,
            label: 'Bank only'
        },
    ]

    //Authorization check
    useEffect(() => {
        authorization(27)
    }, [])

    useEffect(() => {
        // getcoaCode()
    }, [])

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
        }),
    };


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Daybook Print'} breadcrumbItem={' Daybook Print'} />
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>

                                <FormGroup row>
                                    <Label for="transactionFrom" md={3} sm={2} size="lg">Transaction Date From</Label>
                                    <Col sm={10} md={4}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                // options={{
                                                //     altInput: true,
                                                //     altFormat: "F j, Y",
                                                //     dateFormat: "d/m/Y"
                                                // }}
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
                                    <Label for="dateTo" md={3} sm={2} size="lg">Transaction Date To</Label>
                                    <Col sm={10} md={4}>
                                        <InputGroup size='lg'>

                                            <Flatpickr

                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                // options={{
                                                //     altInput: true,
                                                //     altFormat: "F j, Y",
                                                //     dateFormat: "d/m/Y"
                                                // }}
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
                                            >

                                            </Flatpickr>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="journalType" md={3} sm={2} size="lg">Report Type</Label>
                                    <Col sm={10} md={4}>
                                        <Select
                                            value={selectedOption}
                                            onChange={setSelectedOption}
                                            options={options}
                                            styles={customStyles}
                                        />
                                    </Col>
                                </FormGroup>


                                {/* btn for show and export report */}
                                <Row className='mt-md-3 text-end'>
                                    <Col sm={12} md={7}>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded px-4"
                                            onClick={ledgerShowPdf}
                                            disabled={!selectedOption}
                                        >
                                            Preview
                                        </Button>
                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                            disabled={!selectedOption}
                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn-rounded px-4"
                                                    disabled={!selectedOption}
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
                                </Row>
                                {/* </FormGroup> */}
                            </CardBody>
                        </Card>
                    </Col>
                    <Row style={{ height: '100vh', marginBottom: '20px' }}>
                        {
                            loading ?
                                <CustomSpinner />
                                :
                                <iframe src={pdfLink} width="100%" height="100%"></iframe>
                        }
                    </Row>
                </Row>
            </Container>
        </div >
    )
}

export default DayBookReport