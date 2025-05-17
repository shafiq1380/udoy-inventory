import React, { useState, useEffect } from 'react'
import { authorization } from '../../../components/Common/Authorization'
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Label, Row } from 'reactstrap'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Post, REPORT_URL } from '../../../utils/https'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import EmpRptCheckBox from './../EmployeePayrollReport/EmpRptCheckBox';
import Select from 'react-select'
import axios from 'axios';

const SalaryBankStatement = () => {

    const cCode = JSON.parse(localStorage.getItem('cCode'));
    const token = JSON.parse(localStorage.getItem('authKey'));
    const userID = JSON.parse(localStorage.getItem('userID'));
    const [loading, setLoading] = useState(false);
    const [btnDropdown, setBtnDropdown] = useState(false);
    const [pdfLink, setPdfLink] = useState();
    const [salaryMonths, setSalaryMonths] = useState([]);
    const [bankNames, setBankNames] = useState([]);
    const [salaryId, setSalaryId] = useState(null);
    const [allSelected, setAllSelected] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);

    const getSalaryMonths = () => {
        try {
            Post('/api/v1/Payroll/GetSalaryList')
                .then((res) => {
                    if (res.data.success === true) {
                        setSalaryMonths(res.data.data)
                    };
                });
        } catch (error) {
            console.log("Salary Months Error", error)
        };
    };

    const getBankNames = () => {
        try {
            Post('/api/v1/Payroll/GetBankList')
                .then((res) => {
                    if (res.data.success === true) {
                        setBankNames(res.data.data)
                    };
                });
        } catch (error) {
            console.log("Bank Names Error", error)
        };
    };

    const cleanBankList = (banks) => {
        const uniqueBanks = [...new Set(banks.filter(bank => bank && bank.trim() !== ""))];
        return uniqueBanks.map(bank => ({
            value: bank,
            label: bank
        }));
    };

    const cleanedBanks = cleanBankList(bankNames);

    const handleCheckboxChange = () => {
        if (!allSelected) {
            setSelectedBank("All");
        } else {
            setSelectedBank(null);
        }
        setAllSelected(!allSelected);
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedBank(selectedOption ? selectedOption.value : null);
        if (selectedOption) {
            setAllSelected(false);
        }
    };

    useEffect(() => {
        getSalaryMonths();
        getBankNames();
    }, []);

    const handleShowReport = async () => {

        setLoading(!loading)
        const BASEURL = `${REPORT_URL}/api/PayrollReport/GetBankStatement?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&SalID=${salaryId}&BankName=${selectedBank}`;
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
                console.error('Error fetching PDF:', error);
            });
    };

    const handleDownloadReport = (type) => {
        const BASEURL = `${REPORT_URL}/api/PayrollReport/GetBankStatement?cCode=${cCode}&auth=${token}&downloadtype=${type}&UserID=${userID}&SalID=${salaryId}&BankName=${selectedBank}`;
        window.location.href = BASEURL
    };

    const exportToExcelDataOnly = () => {
        const data = {
            data: {
                cCode: cCode,
                auth: token,
                UserID: userID,
                SalID: salaryId,
                BankName: selectedBank
            }
        }
        try {
            Post(`/api/v1/Payroll/GetBankStatement`, data)
                .then(res => {
                    // console.log(res.data)
                    if (res.status === 200) {
                        res.data.fileContents = res.data.fileContents.replace(/^data:image\/[a-z]+;base64,/, "");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = res.data.fileDownloadName;
                        downloadLink.href = `data:image/png;base64,${res.data.fileContents}`;
                        downloadLink.click();
                        // console.log(downloadLink)
                    }
                })
        } catch (error) {
            console.log("Download Error ------->>>", error)
        }
    }

    // Authorization check
    useEffect(() => {
        authorization(106)
    }, []);

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Report" breadcrumbItem="Salary Bank Statement" />

                <Card>
                    <CardBody>

                        <Row>
                            <Col md={9} sm={12}>
                                <Row className='align-items-center'>
                                    <Col md={2}>
                                        <Label size='lg' className=''>Salary Month</Label>
                                    </Col>

                                    <Col md={1} className='mx-md-4'></Col>

                                    <Col md={6}>
                                        <Select
                                            options={salaryMonths && salaryMonths.map((item) => ({ value: item.id, label: item.salTitle }))}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            placeholder="Select Salary Month"
                                            onChange={(e) => setSalaryId(e.value)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={9} sm={12} >
                                <Row className='align-items-center'>
                                    <Col md={2}>
                                        <Label size='lg'>Bank Name</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'>
                                        <EmpRptCheckBox
                                            label="All"
                                            name="All"
                                            value={allSelected}
                                            handleCheckBox={handleCheckboxChange}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Select
                                            options={cleanedBanks}
                                            value={allSelected ? null : cleanedBanks.find(bank => bank.value === selectedBank)}
                                            onChange={handleSelectChange}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            placeholder="Select Bank Name"
                                            isClearable={true}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col md={7} sm={12}>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded mt-2 mb-2 me-2 px-4"
                                            onClick={handleShowReport}
                                            disabled={!salaryId || !selectedBank}
                                        >
                                            Show Report
                                        </Button>
                                    </div>
                                    <div>
                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                            disabled={!salaryId || !selectedBank}
                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded px-4"
                                                    disabled={!salaryId || !selectedBank}
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
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded mt-2 mb-2 me-2 px-4"
                                            onClick={exportToExcelDataOnly}
                                            disabled={!salaryId || !selectedBank}
                                        >
                                            Export to Excel (Data Only)
                                        </Button>
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

export default SalaryBankStatement;