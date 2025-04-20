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
import { incomeDownloadVoucherReport, incomeShowPdfGenerator } from './IncomeStemtPdfHO';
import { useSelector } from 'react-redux';
import { authorization } from '../../components/Common/Authorization';

const IncomeStatementHO = () => {

    const [loading, setLoading] = useState(false)
    const [pdfLink, setpdfLink] = useState()
    const [btnDropdown, setBtnDropdown] = useState(false)

    //period 1
    const [fstPrdStrDate, setFstPrdStrDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [fstPrdEndDate, setFstPrdEndDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    //period 2
    const [sndPrdStrDate, setSndPrdStrDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [sndPrdEndDate, setSndPrdEndDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    //period 3
    const [trdPrdStrDate, setTrdPrdStrDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [trdPrdEndDate, setTrdPrdEndDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));



    const incomeShowPdf = () => {
        setLoading(!loading)
        const pefLink = incomeShowPdfGenerator(fstPrdStrDate, fstPrdEndDate, sndPrdStrDate, sndPrdEndDate, trdPrdStrDate, trdPrdEndDate);
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDownloadReport = (type) => {
        incomeDownloadVoucherReport(
            fstPrdStrDate, fstPrdEndDate, sndPrdStrDate, sndPrdEndDate, trdPrdStrDate, trdPrdEndDate,
            type
        )

    }


    //Authorization check
    useEffect(() => {
        authorization(66)
    }, [])



    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Income Statement (HO)'} breadcrumbItem={' Income Statement (HO)'} />
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
                                            <Label for="dateTo" size="lg">End Date</Label>
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
                                </Row>


                                {/* period 2 */}
                                <Label for="transactionFrom" className='text-primary' size="lg">Period 2</Label>
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
                                                        onChange={(selectedDates, dateStr) => setSndPrdStrDate(dateStr)}
                                                        onClose={(selectedDates, dateStr) => setSndPrdStrDate(dateStr)}
                                                        onReady={(selectedDates, dateStr, instance) => {
                                                            const inputElement = instance.altInput;
                                                            if (inputElement) {
                                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                                            }
                                                        }}
                                                        value={sndPrdStrDate}
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col md={4} row>
                                        <FormGroup row>
                                            <Label for="dateTo" size="lg">End Date</Label>
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
                                                        onChange={(selectedDates, dateStr) => setSndPrdEndDate(dateStr)}
                                                        onClose={(selectedDates, dateStr) => setSndPrdEndDate(dateStr)}
                                                        onReady={(selectedDates, dateStr, instance) => {
                                                            const inputElement = instance.altInput;
                                                            if (inputElement) {
                                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                                            }
                                                        }}
                                                        value={sndPrdEndDate}
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>


                                {/* btn for show and export report */}
                                <Row >
                                    {/* <Label for="referenceTo" md={4} sm={2} size="lg"></Label> */}
                                    <Col md={8}>
                                        <Col md={11} className='text-end'>
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

export default IncomeStatementHO