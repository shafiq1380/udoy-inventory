import React, { useEffect, useState } from 'react'

import Flatpickr from "react-flatpickr";
import {
    Button, ButtonDropdown, Card, CardBody, Col,
    Container,
    DropdownItem, DropdownMenu, DropdownToggle,
    FormGroup, InputGroup, Label, Row
} from 'reactstrap';

import Breadcrumb from '../../components/Common/Breadcrumb';
import CustomSpinner from '../../components/Common/CustomSpinner';

import { authorization } from '../../components/Common/Authorization';
import { receiptDownloadVoucherReport, receiptShowPdfGenerator } from './ReceiptPaymentPdf';

const ReceiptPaymentReport = () => {

    const [loading, setLoading] = useState(false)
    const [pdfLink, setpdfLink] = useState()
    const [btnDropdown, setBtnDropdown] = useState(false)

    //period 1
    const [fstPrdStrDate, setFstPrdStrDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [fstPrdEndDate, setFstPrdEndDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));

    const [reportType, setReportType] = useState(1);


    const incomeShowPdf = () => {
        setLoading(!loading)
        const pefLink = receiptShowPdfGenerator(fstPrdStrDate, fstPrdEndDate, reportType);
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDownloadReport = (type) => {
        receiptDownloadVoucherReport(
            fstPrdStrDate, fstPrdEndDate, reportType, type
        )

    }

    // change the drop down value
    const handleChangeInput = (e) => {
        setReportType(e.target.value)
    }


    //Authorization check
    useEffect(() => {
        authorization(59)
    }, [])



    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Receipt Payment Report'} breadcrumbItem={' Receipt Payment Report'} />
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>

                                {/* period 1 */}

                                <Label className='text-primary' size="lg">Period 1</Label>
                                <Row>
                                    <Col md={4} row>
                                        <FormGroup row>
                                            <Label for="transactionFrom" size="lg">Start Date</Label>
                                            <Col md={10}>
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
                                                        onChange={(selectedDates, dateStr) => setFstPrdStrDate(dateStr)}
                                                        onClose={(selectedDates, dateStr) => setFstPrdStrDate(dateStr)}
                                                        onReady={(selectedDates, dateStr, instance) => {
                                                            const inputElement = instance.altInput;
                                                            if (inputElement) {
                                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                                            }
                                                        }}
                                                        value={fstPrdStrDate}
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col md={4} row>
                                        <FormGroup row>
                                            <Label for="dateTo" md={12} size="lg">End Date</Label>
                                            <Col md={10}>
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
                                                        onChange={(selectedDates, dateStr) => setFstPrdEndDate(dateStr)}
                                                        onClose={(selectedDates, dateStr) => setFstPrdEndDate(dateStr)}
                                                        onReady={(selectedDates, dateStr, instance) => {
                                                            const inputElement = instance.altInput;
                                                            if (inputElement) {
                                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                                            }
                                                        }}
                                                        value={fstPrdEndDate}
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4} row>
                                        <FormGroup row>
                                            <Label for="dateTo" md={12} size="lg">Report Type</Label>
                                            <Col md={10}>
                                                <select
                                                    className="form-select"
                                                    aria-label="Default select example"
                                                    id='activeStatus'
                                                    name="itmStatus"
                                                    value={reportType}
                                                    onChange={handleChangeInput}
                                                >
                                                    <option value={1}>Cash and Bank</option>
                                                    <option value={2}>Cash Only</option>
                                                    <option value={3}>Bank Only</option>
                                                </select>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>


                                {/* btn for show and export report */}
                                <Row>
                                    {/* <Label for="referenceTo" md={4} sm={2} size="lg"></Label> */}
                                    <Col md={8}>
                                        <Col md={11} className='text-end '>
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
                                    </Col>
                                </Row>

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

export default ReceiptPaymentReport