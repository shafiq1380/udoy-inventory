import React, { useEffect, useState } from 'react'
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, InputGroup, Label, Row } from 'reactstrap'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Post, REPORT_URL } from '../../../utils/https';
import Select from 'react-select'
import EmpRptCheckBox from '../../PAYROLLALL/EmployeePayrollReport/EmpRptCheckBox';
import Flatpickr from "react-flatpickr";
import CustomSpinner from '../../../components/Common/CustomSpinner';
import axios from 'axios';
import { authorization } from '../../../components/Common/Authorization';
import { ledgerDownloadVoucherReport } from '../../VoucherLedger/ledgerPdfGenerator';


const TransactionDetailReport = () => {

    // document.title = "Transaction Detail Report | SMART Accounting System"

    const [allTransactionTypes, setAllTransactionTypes] = useState([]);
    const getDefaultDate = () => {
        const defaultDate = new Date();
        return `${('0' + (defaultDate.getDate())).slice(-2)}/${('0' + (defaultDate.getMonth() + 1)).slice(-2)}/${defaultDate.getFullYear()}`;
    };

    const [fromDates, setFromDates] = useState(getDefaultDate());
    const [toDates, setToDates] = useState(getDefaultDate());
    const [loading, setLoading] = useState(false);
    const [pdfLink, setPdfLink] = useState()
    const [trnDetailData, setTrnDetailData] = useState({
        trnAllId: 0,
        trnTypeId: 0
    });
    const [trnTypeId, setTrnTypeId] = useState({});

    // drop down btn 
    const [btnDropdown, setBtnDropdown] = useState(false)


    useEffect(() => {
        getAllTransactionTypes()
    }, []);

    const getAllTransactionTypes = () => {
        try {
            Post('/api/InvTransaction/GetTransactionTypeList')
                .then((response) => {
                    // console.log("response", response.data.data)
                    if (response.status === 200) {
                        setAllTransactionTypes(response.data.data)
                    }
                })
        } catch (error) {
            console.log("Error ------->>>", error)
        }
    };

    const handleSelectData = (e, name) => {
        if (name === 'trnType') {
            setTrnTypeId(e)
            setTrnDetailData({
                ...trnDetailData, ['trnTypeId']: e.value, ['trnAllId']: 0
            })
        }
    };

    const handleCheckBox = (e) => {
        const { checked, name } = e.target
        if (name === 'allTrnType') {
            setTrnTypeId({})
            setTrnDetailData({
                ...trnDetailData, ['trnAllId']: checked ? 1 : 0, ['trnTypeId']: 0
            })
        }
    };

    const handleFromDateChange = (selectedDates, dateStr) => {
        setFromDates(dateStr);
    };

    const handleToDateChange = (selectedDates, dateStr) => {
        setToDates(dateStr);
    };

    // get the local database Data 
    const cCode = JSON.parse(localStorage.getItem('cCode'));
    const token = JSON.parse(localStorage.getItem('authKey'));
    const userID = JSON.parse(localStorage.getItem('userID'));

    const handleShowReport = async () => {

        setLoading(!loading)

        const startDate = fromDates;
        const endDate = toDates;
        const trnId = trnDetailData.trnAllId === 1 ? 0 : trnDetailData.trnTypeId;
        const trnType = trnDetailData.trnAllId === 1 ? trnId : trnDetailData.trnTypeId;
        // console.log("trnType", trnType)
        // console.log("startDate", startDate)
        // console.log("endDate", endDate)

        const BASEURL = `${REPORT_URL}/api/InvReport/GetItemTransactionDetailReport?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&StartDate=${startDate}&EndDate=${endDate}&TranAll=${trnDetailData.trnAllId}&TranTypeID=${trnType}&TranID=0`;

        // console.log("BASEURL", BASEURL)

        await axios.get(`${BASEURL}`, {
            responseType: 'blob',
        })
            .then((response) => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setLoading(false)
                setPdfLink(url)
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && error.response.status === 500) {
                    toast.error(error.response.statusText, toastOptions);
                } else {
                    console.error('Error fetching PDF:', error);
                }
            });

    };

    const handleDownloadReport = (type) => {


        const startDate = fromDates;
        const endDate = toDates;
        const trnId = trnDetailData.trnAllId === 1 ? 0 : trnDetailData.trnTypeId;
        const trnType = trnDetailData.trnAllId === 1 ? trnId : trnDetailData.trnTypeId;
        // console.log("trnType", trnType)
        // console.log("startDate", startDate)
        // console.log("endDate", endDate)

        const BASEURL = `${REPORT_URL}/api/InvReport/GetItemTransactionDetailReport?cCode=${cCode}&auth=${token}&downloadtype=${type}&UserID=${userID}&StartDate=${startDate}&EndDate=${endDate}&TranAll=${trnDetailData.trnAllId}&TranTypeID=${trnType}&TranID=0`;


        window.location.href = BASEURL

    }


    useEffect(() => {
        authorization(88)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Report" breadcrumbItem="Transaction Detail Report" />

                <Card>
                    <CardBody>
                        <Row>
                            <Col md={8} sm={12}>
                                <Row row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>Transaction Types </Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4 '>
                                        <Col md={1} className="fs-4 d-flex align-items-center mb-sm-2">
                                            <EmpRptCheckBox
                                                handleCheckBox={handleCheckBox}
                                                name="allTrnType"
                                                value={trnDetailData.trnAllId === 1 ? true : false}
                                            />
                                        </Col>
                                    </Col>
                                    <Col md={7}>
                                        <Select
                                            onChange={(e) => handleSelectData(e, 'trnType')}
                                            value={trnTypeId}
                                            options={allTransactionTypes?.map((item) => {
                                                return {
                                                    label: item.trnCode + " : " + item.trnDesc,
                                                    value: item.id
                                                };
                                            })}
                                            placeholder="Select Transaction Type"
                                        />
                                    </Col>
                                </Row>

                                <Row row>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>From Date</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'></Col>
                                    <Col sm={10} md={7}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "d/m/Y",
                                                    altInput: true,
                                                    altFormat: "d/m/Y",
                                                    allowInput: true
                                                }}
                                                id="date"
                                                name="date"
                                                onChange={handleFromDateChange}
                                                onClose={handleFromDateChange}
                                                onReady={(selectedDates, dateStr, instance) => {
                                                    const inputElement = instance.altInput;
                                                    if (inputElement) {
                                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                                    }
                                                }}
                                                value={fromDates}
                                            />
                                        </InputGroup>

                                    </Col>
                                </Row>

                                <Row className='mt-2 mb-2'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>To Date</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'></Col>
                                    <Col sm={10} md={7}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "d/m/Y",
                                                    altInput: true,
                                                    altFormat: "d/m/Y",
                                                    allowInput: true
                                                }}
                                                id="date"
                                                name="date"
                                                onChange={handleToDateChange}
                                                onClose={handleToDateChange}
                                                onReady={(selectedDates, dateStr, instance) => {
                                                    const inputElement = instance.altInput;
                                                    if (inputElement) {
                                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                                    }
                                                }}
                                                value={toDates}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8} sm={12}>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded  mb-2 me-2 px-4  mt-1"
                                            onClick={handleShowReport}
                                            disabled={
                                                trnDetailData.trnAllId === 0 && trnDetailData.trnTypeId === 0
                                            }
                                        >
                                            Show Report
                                        </Button>
                                    </div>
                                    <div>
                                        {/* <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded  mb-2 me-2 px-4"
                                            onClick={handleDownload}
                                            disabled={
                                                trnDetailData.trnAllId === 0 && trnDetailData.trnTypeId === 0
                                            }
                                        >
                                            Export Report
                                        </Button> */}
                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                            disabled={
                                                trnDetailData.trnAllId === 0 && trnDetailData.trnTypeId === 0
                                            }

                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn-rounded px-4"
                                                    disabled={
                                                        trnDetailData.trnAllId === 0 && trnDetailData.trnTypeId === 0
                                                    }
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
                                    </div>
                                </div>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>

                <Row style={{ height: '100vh', marginBottom: '20px' }}>
                    {
                        loading ? <CustomSpinner /> : <iframe src={pdfLink} width="100%" height="100%" frameBorder="0"></iframe>
                    }
                </Row>

            </Container>
        </div>
    )
}

export default TransactionDetailReport