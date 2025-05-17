import React, { useEffect, useState } from 'react'
import { showPdfGenerator } from '../../components/Common/showPdfGenerator'
import { Post } from '../../utils/https'
import Breadcrumb from '../../components/Common/Breadcrumb'
import {
    Button, ButtonDropdown, Card, CardBody, Col,
    Container,
    DropdownItem, DropdownMenu, DropdownToggle,
    FormGroup, Input, InputGroup, Label, Row
} from 'reactstrap'

import Select from 'react-select'
import Flatpickr from "react-flatpickr";
import CustomSpinner from '../../components/Common/CustomSpinner'
import { subLedgerDownloadVoucherReport, subLedgerShowPdfGenerator } from './subledgerPdfGenerator'
import { useSelector } from 'react-redux'
import { authorization } from '../../components/Common/Authorization'
import './VoucherSubLedger.css';


const VoucherSubLedger = () => {

    const [pdfLink, setpdfLink] = useState()
    const [btnDropdown, setBtnDropdown] = useState(false)
    const [loading, setLoading] = useState(false)

    const [analysisType, setAnalysisType] = useState()
    const [selectAnlType, setSelectAnlType] = useState()

    const [analysisCode, setAnalysisCode] = useState()
    const [selectAnalysisCode, setSelectAnalysisCode] = useState()

    const [options, setOptions] = useState()
    const [coaAccount, setCoaAccount] = useState();
    const [toCoaAccount, setToCoaAccount] = useState();

    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));

    const [multipleLedgerCode, setMultipleLedgerCode] = useState(false);


    const generatePdf = () => {
        setLoading(!loading)
        const pefLink = subLedgerShowPdfGenerator(transactionFrom, transactionTo, coaAccount?.value, toCoaAccount?.value, selectAnlType?.value, selectAnalysisCode?.value);
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDownlaodReport = (type) => {
        subLedgerDownloadVoucherReport(
            transactionFrom,
            transactionTo,
            coaAccount?.value,
            selectAnlType?.value,
            selectAnalysisCode?.value,
            type
        )
    }

    //getting all account
    const getCoaAccount = () => {
        try {
            Post('/api/v1/CoaSetup/GetAllCoaAccountWithAnal')
                .then(res => {
                    setOptions(res.data.data)
                })

        } catch (error) {

        }
    }

    //getting type id usin CoaId
    const getAnalysisTypeByCoaID = () => {
        const data = { data: coaAccount?.value }
        try {
            Post('/api/v1/CoaSetup/GetAnalysisTypeByCoaID', data)
                .then(res => {
                    const updateData = [...res.data.data, { analysisTypeID: '', analysisTypeName: 'All' }]
                    setAnalysisType(updateData)
                })

        } catch (error) {

        }
    }

    //getting all Analysis Code
    const getAnalysisCode = () => {
        const data = { data: selectAnlType?.value }
        try {
            Post('/api/v1/CoaSetup/GetAllAnalysisCodeByType', data)
                .then(res => {
                    const updateData = [...res.data.data, { id: '', analysisName: 'All' }]
                    setAnalysisCode(updateData)
                })

        } catch (error) {

        }
    }

    //Authorization check
    useEffect(() => {
        authorization(30)
    }, [])



    //this is for getting analysis code
    useEffect(() => {
        setSelectAnalysisCode()
        getAnalysisCode()
    }, [selectAnlType])

    // console.log(analysisCode)

    //this is for getting analysis type
    useEffect(() => {
        setSelectAnlType()
        getAnalysisTypeByCoaID()
    }, [coaAccount])

    //this is for getting Coa Account
    useEffect(() => {
        getCoaAccount()
    }, [])

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
        }),
    };

    const handleMultipleLedgerCodeChange = () => {
        // Clear all states except Transaction Date From and Transaction Date To
        setCoaAccount(null);
        setToCoaAccount(null);
        setSelectAnlType(null);
        setSelectAnalysisCode(null);
    };


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Voucher  Ledger Print'} breadcrumbItem={' Voucher Sub Ledger Print'} />
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>

                                <FormGroup row>
                                    <Label for="dateFrom" md={3} sm={2} size="lg">Transaction Date From</Label>
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
                                                onChange={(e, date) => settransactionFrom(date)}
                                                onClose={(e, date) => settransactionFrom(date)}
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
                                                onChange={(e, date) => settransactionTo(date)}
                                                onClose={(e, date) => settransactionTo(date)}
                                                onReady={(selectedDates, dateStr, instance) => {
                                                    const inputElement = instance.altInput;
                                                    if (inputElement) {
                                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                                    }
                                                }}
                                                value={transactionTo}
                                            />
                                        </InputGroup>
                                        <div class="custom-control custom-checkbox checkbox-lg">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="checkbox-3"
                                                onClick={handleMultipleLedgerCodeChange}
                                                checked={multipleLedgerCode}
                                                onChange={() => setMultipleLedgerCode(!multipleLedgerCode)}
                                            />
                                            <label className="custom-control-label" for="checkbox-3">Multiple Ledger Code?</label>
                                        </div>
                                    </Col>

                                </FormGroup>
                                <FormGroup row>
                                    <Label for="ledgerCode" md={3} sm={2} size="lg">{multipleLedgerCode ? "Ledger Account Code From" : "Ledger Account Code"}</Label>
                                    <Col sm={10} md={4}>
                                        <Select
                                            styles={customStyles}
                                            value={coaAccount}
                                            onChange={setCoaAccount}
                                            options={options?.map(coa => {
                                                return {
                                                    value: coa.coaId,
                                                    label: `${coa.coaCode}:${coa.coaName}`
                                                }
                                            })}
                                        />
                                    </Col>

                                </FormGroup>

                                {
                                    multipleLedgerCode ? <FormGroup row>
                                        <Label for="ledgerCode" md={3} sm={2} size="lg">Ledger Account Code To</Label>
                                        <Col sm={10} md={4}>
                                            <Select
                                                styles={customStyles}
                                                value={toCoaAccount}
                                                onChange={setToCoaAccount}
                                                options={options?.map(coa => {
                                                    return {
                                                        value: coa.coaId,
                                                        label: `${coa.coaCode}:${coa.coaName}`
                                                    }
                                                })}
                                            />
                                        </Col>
                                    </FormGroup>
                                        :
                                        <>
                                            <FormGroup row>
                                                <Label for="subcodeFrom" md={3} sm={2} size="lg">Analysis Type</Label>
                                                <Col sm={10} md={4}>
                                                    <Select
                                                        styles={customStyles}
                                                        value={selectAnlType ? selectAnlType : { value: "", label: "All" }}
                                                        onChange={setSelectAnlType}
                                                        options={analysisType?.map(anal => {
                                                            return {
                                                                value: anal.analysisTypeID,
                                                                label: anal.analysisTypeName
                                                            }
                                                        })}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label for="subcodeTo" md={3} sm={2} size="lg">Analysis</Label>
                                                <Col sm={10} md={4}>
                                                    <Select
                                                        styles={customStyles}
                                                        value={selectAnalysisCode ? selectAnalysisCode : { value: "", label: "All" }}
                                                        onChange={setSelectAnalysisCode}
                                                        options={analysisCode?.map(anal => {
                                                            return {
                                                                value: anal.id,
                                                                label: `${anal.analysisCode}:${anal.analysisName}`
                                                            }
                                                        })}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </>
                                }












                                {/* btn for show and export report */}
                                <FormGroup row>
                                    <Label for="referenceTo" md={4} sm={2} size="lg"></Label>
                                    <Col sm={10} md={6}>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded px-4"
                                            onClick={generatePdf}
                                            disabled={!coaAccount}
                                        >
                                            Preview
                                        </Button>
                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                            disabled={!coaAccount}
                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn-rounded px-4"
                                                    disabled={!coaAccount}
                                                >
                                                    Export Report
                                                </Button>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => handleDownlaodReport('pdf')}>Export TO PDF</DropdownItem>
                                                <DropdownItem onClick={() => handleDownlaodReport('doc')}>Export To Word</DropdownItem>
                                                <DropdownItem onClick={() => handleDownlaodReport('xls')}>Export To Excel</DropdownItem>
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

export default VoucherSubLedger