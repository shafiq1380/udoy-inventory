import React, { useEffect, useState } from 'react'

import Flatpickr from "react-flatpickr";
import {
    Button, ButtonDropdown, Card, CardBody, Col,
    Container,
    DropdownItem, DropdownMenu, DropdownToggle,
    FormGroup, Input, InputGroup, Label, Row
} from 'reactstrap';

import Breadcrumb from '../../components/Common/Breadcrumb';
import CustomSpinner from '../../components/Common/CustomSpinner';
import { Post } from '../../utils/https';
import Select from 'react-select';
import { ledgerDownloadVoucherReport, ledgerShowPdfGenerator } from './ledgerPdfGenerator';
import { authorization } from '../../components/Common/Authorization';
import { useSelector } from 'react-redux';

const VoucherLedger = () => {

    const [pdfLink, setpdfLink] = useState()
    const [btnDropdown, setBtnDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    // const [coaCode, setcoaCode] = useState()
    const [options, setOptions] = useState()

    const [accontCodeFrom, setAccontCodeFrom] = useState(null);

    const [accontCodeTo, setAccontCodeTo] = useState(null);

    const [reportformat, setReportformat] = useState(0)

    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));




    const ledgerShowPdf = () => {
        setLoading(!loading)
        const pefLink = ledgerShowPdfGenerator(transactionFrom, transactionTo, accontCodeFrom?.value, accontCodeTo?.value
            , reportformat
        );
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDownloadReport = (type) => {
        ledgerDownloadVoucherReport(
            transactionFrom,
            transactionTo,
            accontCodeFrom?.value,
            accontCodeTo?.value,
            type,
            reportformat
        )

    }

    const getcoaCode = () => {
        try {
            Post('/api/CoaSetup/GetAllCoaAccount')
                .then(res => {
                    // console.log(res.data.data)
                    optionss(res.data.data)
                })

        } catch (error) {

        }
    }
    const optionss = (coaData) => {
        const data = coaData?.map(coa => {
            return {
                value: coa.coaCode,
                label: `${coa.coaCode}:${coa.coaName}`
            }
        })
        setOptions(data)
    }

    //Authorization check
    useEffect(() => {
        authorization(29)
    }, [])


    useEffect(() => {
        getcoaCode()
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
                <Breadcrumb title={'General Ledger Print'} breadcrumbItem={' General Ledger Print'} />
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
                                <FormGroup row>
                                    <Label for="Account Code From" md={3} sm={2} size="lg">Account Code From</Label>
                                    <Col sm={10} md={4}>
                                        <Select
                                            value={accontCodeFrom}
                                            onChange={setAccontCodeFrom}
                                            options={options}
                                            styles={customStyles}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="Account Code From" md={3} sm={2} size="lg">Account Code To</Label>
                                    <Col sm={10} md={4}>
                                        <Select
                                            value={accontCodeTo}
                                            onChange={setAccontCodeTo}
                                            options={options}
                                            styles={customStyles}
                                        />
                                    </Col>
                                </FormGroup>


                                <FormGroup row className='mt-3 mb-3'>
                                    <Label for="option" md={3} sm={2} size="lg"></Label>
                                    <Col sm={10} md={8}>
                                        <InputGroup size='lg'>
                                            <Label check className="fs-4 ">
                                                <Input type="radio"
                                                    value={reportformat}
                                                    checked={reportformat === 0}
                                                    onChange={() => setReportformat(0)}
                                                    className="fs-4 mx-2 border border-primary border-3 " />
                                                New Version
                                            </Label>
                                            <Label check className="fs-4 ms-2">
                                                <Input type="radio"
                                                    value={reportformat}
                                                    checked={reportformat === 1}
                                                    onChange={() => setReportformat(1)}
                                                    className="fs-4 mx-2 border border-primary border-3 " />
                                                Old Vesion
                                            </Label>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>



                                {/* btn for show and export report */}
                                <FormGroup row>
                                    <Label for="referenceTaccontCodeToo" md={4} sm={2} size="lg"></Label>
                                    <Col sm={10} md={6}>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded px-4"
                                            onClick={ledgerShowPdf}
                                            disabled={!accontCodeFrom || !accontCodeTo}
                                        >
                                            Preview
                                        </Button>
                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                            disabled={!accontCodeFrom || !accontCodeTo}
                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn-rounded px-4"
                                                    disabled={!accontCodeFrom || !accontCodeTo}
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

export default VoucherLedger