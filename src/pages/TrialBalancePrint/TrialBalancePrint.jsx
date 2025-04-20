import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Common/Breadcrumb'
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap'

import Flatpickr from "react-flatpickr";
import RadioButton from '../../components/Common/RadioButton';
import CustomButton from '../JournalVoucher/CustomButton';
import CustomSpinner from '../../components/Common/CustomSpinner';
import { trialDownloadVoucherReport, trialShowPdfGenerator } from './trialBalancePdfGenerator';
import { authorization } from '../../components/Common/Authorization';
import { useSelector } from 'react-redux';

const TrialBalancePrint = () => {

    const [accountType, setAccountType] = useState('0');
    const [reportType, setReportType] = useState('1');
    const [btnDropdown, setBtnDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pdfLink, setpdfLink] = useState()

    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));



    const handleAccountType = (event) => {
        setAccountType(event.target.value);
    };

    const handleReportType = (event) => {
        setReportType(event.target.value);
    };


    const generatePdf = () => {
        setLoading(!loading)
        const pefLink = trialShowPdfGenerator(
            transactionFrom,
            transactionTo,
            accountType,
            reportType
        );
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const trialPdfDownload = (type) => {
        trialDownloadVoucherReport(
            transactionFrom,
            transactionTo,
            accountType,
            reportType,
            type
        )
    }

    //Authorization check
    useEffect(() => {
        authorization(35)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Trial Balance Print'} breadcrumbItem={' Trial Balance Print'} />

                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>

                                <FormGroup row>
                                    <Label for="periodFrom" md={3} sm={2} size="lg">Period From</Label>
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
                                    <Label for="periodTo" md={3} sm={2} size="lg">Period To</Label>
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
                                {/* Radion Button */}
                                <FormGroup row>
                                    <Label for="option" md={3} sm={2} size="lg">Account Group</Label>
                                    <Col sm={10} md={8}>
                                        <InputGroup size='lg'>
                                            <RadioButton
                                                value='0'
                                                selectedOption={accountType}
                                                handleOptionChange={handleAccountType}
                                                label={'All'}
                                            />
                                            <RadioButton
                                                value='1'
                                                selectedOption={accountType}
                                                handleOptionChange={handleAccountType}
                                                label={'Asset'}
                                            />
                                            <RadioButton
                                                value='2'
                                                selectedOption={accountType}
                                                handleOptionChange={handleAccountType}
                                                label={'Liability'}
                                            />
                                            <RadioButton
                                                value='3'
                                                selectedOption={accountType}
                                                handleOptionChange={handleAccountType}
                                                label={'Income'}
                                            />
                                            <RadioButton
                                                value='4'
                                                selectedOption={accountType}
                                                handleOptionChange={handleAccountType}
                                                label={'Expense'}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="option" md={3} sm={2} size="lg">Report Type </Label>
                                    <Col sm={10} md={8}>
                                        <InputGroup size='lg'>
                                            <RadioButton
                                                value='1'
                                                selectedOption={reportType}
                                                handleOptionChange={handleReportType}
                                                label={'Account Code Wise'}
                                            />
                                            <RadioButton
                                                value='2'
                                                selectedOption={reportType}
                                                handleOptionChange={handleReportType}
                                                label={'Category Wise'}
                                            />
                                            <RadioButton
                                                value='3'
                                                selectedOption={reportType}
                                                handleOptionChange={handleReportType}
                                                label={'Group Wise'}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>

                                {/* button  */}
                                <FormGroup row>
                                    <Label for="referenceTo" md={4} sm={2} size="lg"></Label>
                                    <Col sm={10} md={6}>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded px-4"
                                            onClick={generatePdf}
                                        >
                                            Preview
                                        </Button>
                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn-rounded px-4"
                                                >
                                                    Export Report
                                                </Button>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => trialPdfDownload('pdf')}>Export TO PDF</DropdownItem>
                                                <DropdownItem onClick={() => trialPdfDownload('doc')}>Export To Word</DropdownItem>
                                                <DropdownItem onClick={() => trialPdfDownload('xls')}>Export To Excel</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card >
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
        </div>
    )
}

export default TrialBalancePrint