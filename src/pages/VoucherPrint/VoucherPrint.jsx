import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Common/Breadcrumb'

import Flatpickr from "react-flatpickr";
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap';
import { downloadExcel, downloadPdf, downloadWord } from '../../components/Common/mainPdfGenerator';
import CustomButton from '../JournalVoucher/CustomButton';
import { downloadVoucherReport, showPdfGenerator } from '../../components/Common/showPdfGenerator';

import CustomSpinner from '../../components/Common/CustomSpinner';
import { Post } from '../../utils/https';
import RadioButton from '../../components/Common/RadioButton';
import { authorization } from '../../components/Common/Authorization';
import { useSelector } from 'react-redux';

const VoucherPrint = () => {


    const [pdfLink, setpdfLink] = useState()
    const [btnDropdown, setBtnDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const [voucherType, setVoucherType] = useState()

    const [selectedOption, setSelectedOption] = useState('1');
    const [selectedType, setSelectedType] = useState('')

    const [voucherData, setVoucherData] = useState({
        rfFrom: '',
        // rfTo: '',
        journalType: '',
    })
    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));


    const handleSelection = (e) => {
        setSelectedOption(e.target.value)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        const updateVaue = { ...voucherData, [name]: value }
        setVoucherData(updateVaue)
    }


    const generatePdf = () => {
        setLoading(!loading)
        const pefLink = showPdfGenerator(
            voucherData.journalType,
            voucherData.rfFrom,
            // voucherData.rfTo,
            transactionFrom,
            transactionTo,
            selectedOption
        );
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDownloadReport = (type) => {
        downloadVoucherReport(
            voucherData.journalType,
            voucherData.rfFrom,
            // voucherData.rfTo,
            transactionFrom,
            transactionTo,
            selectedOption,
            type
        )

    }

    const getVoucherType = () => {
        const data = {
            data: 1
        }
        try {
            Post('/api/v1/VoucherType/GetAllVouchertype', data)
                .then(res => setVoucherType(res.data.data))
        } catch (error) {

        }
    }


    // //Authorization check
    useEffect(() => {
        authorization(28)
    }, [])


    useEffect(() => {
        getVoucherType()
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Voucher Print'} breadcrumbItem={'voucher print'} />
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>
                                <FormGroup row>
                                    <Label for="option" md={3} sm={2} size="lg">Select Option</Label>
                                    <Col sm={10} md={4}>
                                        <InputGroup size='lg'>
                                            <RadioButton
                                                value='2'
                                                name='selectOption'
                                                selectedOption={selectedOption}
                                                handleOptionChange={handleSelection}
                                                label={'Posted'}
                                            />
                                            <RadioButton
                                                value='1'
                                                name='selectOption'
                                                selectedOption={selectedOption}
                                                handleOptionChange={handleSelection}
                                                label={'Unposted'}
                                            />

                                        </InputGroup>
                                    </Col>
                                </FormGroup>


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
                                    <Label for="bankName" md={3} sm={2} size="lg">Transaction Date To</Label>
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
                                    <Label for="journalType" md={3} sm={2} size="lg">Voucher Type</Label>
                                    <Col sm={10} md={4}>
                                        <select
                                            style={{ height: '45px' }}
                                            className="form-select"
                                            aria-label="Default select example"
                                            id='activeStatus'
                                            name="journalType"
                                            onChange={handleChange}
                                        // value={newData.status}
                                        >
                                            <option value={''}>All</option>
                                            {voucherType?.map((journal) => (
                                                <option key={journal.id} value={journal.jrnType}>{journal.jrnDescription}</option>
                                            ))}
                                        </select>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="referenceNumber" md={3} sm={2} size="lg">Reference Number</Label>
                                    <Col sm={10} md={4}>
                                        <Input
                                            type='text'
                                            id="referenceFrom"
                                            name="rfFrom"
                                            placeholder='All'
                                            className='custom-input'
                                            bsSize="lg"
                                            onChange={handleChange}
                                        />

                                    </Col>
                                </FormGroup>
                                {/* <FormGroup row>
                                <Label for="referenceTo" md={3} sm={2} size="lg">Reference To</Label>
                                <Col sm={10} md={4}>
                                    <Input
                                        type='number'
                                        id="referenceTo"
                                        name="rfTo"
                                        placeholder='All'
                                        className='custom-input'
                                        bsSize="lg"
                                        onChange={handleChange}
                                    />

                                </Col>
                            </FormGroup> */}

                                {/* btn for show and export report */}
                                <Row className='mt-md-3 text-end'>
                                    <Col sm={12} md={7}>
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
                                                <DropdownItem onClick={() => handleDownloadReport('pdf')}>Export TO PDF</DropdownItem>
                                                <DropdownItem onClick={() => handleDownloadReport('doc')}>Export To Word</DropdownItem>
                                                <DropdownItem onClick={() => handleDownloadReport('xls')}>Export To Excel</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
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

export default VoucherPrint