import React, { useState, useEffect } from 'react'
import { authorization } from '../../../components/Common/Authorization'
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Post, REPORT_URL } from '../../../utils/https'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import axios from 'axios';
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import EmpRptCheckBox from '../EmployeePayrollReport/EmpRptCheckBox';
import ReactSelect from 'react-select'

const EmployeeSalaryRegisterReport = () => {

    const [loading, setLoading] = useState(false);
    const [pdfLink, setPdfLink] = useState();
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [btnDropdown, setBtnDropdown] = useState(false)

    const [reportData, setReportData] = useState({
        monthAll: 0,
        deptAll: 0,
        empAll: 0,
        empTypeAll: 0,
        departmentID: 0,
        employeeID: 0,
        employeeTypeID: 0,
    });

    const [department, setDepartment] = useState([])
    const [employee, setEmployee] = useState([])
    const [employeeType, setEmployeeType] = useState([])
    const [departmentID, setDepartmentID] = useState({})
    const [employeeTypeID, setEmployeeTypeID] = useState({})
    const [employeeID, setEmployeeID] = useState({})
    const [isGroupData, setIsGroupData] = useState(1)

    const getDepartment = () => {
        try {
            Post('/api/EmployeeManagement/GetAllDepartment')
                .then(res => setDepartment(res.data.data))
        } catch (error) {

        }
    };

    const getEmployee = () => {
        try {
            Post('/api/EmployeeManagement/GetAllEmployee')
                .then(res => setEmployee(res.data.data))
        } catch (error) {

        }
    };

    const getEmployeeType = () => {
        try {
            Post('/api/Payroll/GetEmployeeType')
                .then(res => setEmployeeType(res.data.data))
        } catch (error) {

        }
    };

    const handleSelectedData = (event, name) => {
        if (name === 'dept') {
            setDepartmentID(event)
            setReportData({
                ...reportData, ['departmentID']: event.value, ['deptAll']: 0
            })
        } else if (name === 'emp') {
            setEmployeeID(event)
            setReportData({
                ...reportData, ['employeeID']: event.value, ['empAll']: 0
            })
        } else if (name === 'emptype') {
            setEmployeeTypeID(event)
            setReportData({
                ...reportData, ['employeeTypeID']: event.value, ['empTypeAll']: 0
            })
        }
    };

    const handleCheckBox = (e) => {
        const { checked, name } = e.target
        if (name === 'deptAll') {
            setDepartmentID({})
            setReportData({
                ...reportData, ['deptAll']: checked ? 1 : 0, ['departmentID']: 0
            })
        } else if (name === 'empAll') {
            setEmployeeID({})
            setReportData({
                ...reportData, ['empAll']: checked ? 1 : 0, ['employeeID']: 0
            })
        } else if (name === 'empTypeAll') {
            setEmployeeTypeID({})
            setReportData({
                ...reportData, ['empTypeAll']: checked ? 1 : 0, ['employeeTypeID']: 0
            })
        }
    };

    useEffect(() => {
        getDepartment()
        getEmployee()
        getEmployeeType()
    }, []);

    const handleVoucherDate = (selectedDates, dateStr) => { setTransactionDate(dateStr) };

    const handleShowReport = async () => {

        setLoading(!loading)

        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const token = JSON.parse(localStorage.getItem('authKey'));
        const userID = JSON.parse(localStorage.getItem('userID'));
        const fromDate = transactionDate;
        const deptID = reportData.departmentID;
        const empID = reportData.employeeID;
        const empTypeID = reportData.employeeTypeID;
        const deptAll = reportData.deptAll;
        const empAll = reportData.empAll;
        const empTypeAll = reportData.empTypeAll;

        const BASEURL = `${REPORT_URL}/api/PayrollReport/GetSalRegisterReport?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&StartDate=${fromDate}&EmpTypeAll=${empTypeAll}&DeptAll=${deptAll}&EmpAll=${empAll}&EmployeeTypeID=${empTypeID}&EmployeeID=${empID}&DepartmentID=${deptID}&isDetail=${isGroupData}`;

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

        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const token = JSON.parse(localStorage.getItem('authKey'));
        const userID = JSON.parse(localStorage.getItem('userID'));
        const fromDate = transactionDate;
        const deptID = reportData.departmentID;
        const empID = reportData.employeeID;
        const empTypeID = reportData.employeeTypeID;
        const deptAll = reportData.deptAll;
        const empAll = reportData.empAll;
        const empTypeAll = reportData.empTypeAll;

        const BASEURL = `${REPORT_URL}/api/PayrollReport/GetSalRegisterReport?cCode=${cCode}&auth=${token}&downloadtype=${type}&UserID=${userID}&StartDate=${fromDate}&EmpTypeAll=${empTypeAll}&DeptAll=${deptAll}&EmpAll=${empAll}&EmployeeTypeID=${empTypeID}&EmployeeID=${empID}&DepartmentID=${deptID}&isDetail=${isGroupData}`;

        window.location.href = BASEURL
    };

    // Authorization check
    useEffect(() => {
        authorization(100)
    }, []);


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Report" breadcrumbItem="Employee Salary Register Report" />
                <Card>
                    <CardBody>

                        <Row>
                            <Col md={5} sm={12}>
                                <FormGroup row className='align-items-center'>
                                    <Col md={4}>
                                        <Label size='lg' className='text-end pt-0'>Salary Date</Label>
                                    </Col>

                                    <Col md={6}>
                                        <Flatpickr
                                            className="form-control"
                                            placeholder="DD/MM/YYYY"
                                            style={{ width: '350px' }}
                                            options={{
                                                plugins: [
                                                    new monthSelectPlugin({
                                                        shorthand: true,
                                                        dateFormat: "d/m/Y",
                                                        altInput: true,
                                                        altFormat: "m-d-Y",
                                                        theme: "light"
                                                    })
                                                ],
                                                static: true
                                            }}
                                            id="date"
                                            name="date"
                                            onChange={handleVoucherDate}
                                            value={transactionDate}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8} sm={12} >
                                <Row className='align-items-center'>
                                    <Col md={2}>
                                        <Label size='lg'>Employee Type </Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'>
                                        <EmpRptCheckBox
                                            handleCheckBox={handleCheckBox}
                                            value={reportData.empTypeAll === 1 ? true : false}
                                            name='empTypeAll'
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <ReactSelect
                                            // styles={customStyles}
                                            onChange={(event) => handleSelectedData(event, 'emptype')}
                                            options={employeeType &&
                                                employeeType?.map(emp =>
                                                    ({ value: emp.id, label: emp.employeeTypes }))}

                                            placeholder="Select"
                                            value={employeeTypeID}
                                        // autoFocus
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8} sm={12}>
                                <Row className='align-items-center'>
                                    <Col md={2}>
                                        <Label size='lg' className=''>Department </Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4 '>
                                        <EmpRptCheckBox
                                            handleCheckBox={handleCheckBox}
                                            value={reportData.deptAll === 1 ? true : false}
                                            name='deptAll'
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <ReactSelect
                                            // styles={customStyles}
                                            onChange={(event) => handleSelectedData(event, 'dept')}
                                            options={department &&
                                                department.map(dept =>
                                                    ({ value: dept.id, label: dept.departmentName }))}
                                            placeholder="Select"
                                            value={departmentID}
                                        // autoFocus
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8} sm={12}>
                                <Row className='align-items-center'>
                                    <Col md={2}>
                                        <Label size='lg' className=''>Employee </Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'>
                                        <EmpRptCheckBox
                                            handleCheckBox={handleCheckBox}
                                            value={reportData.empAll === 1 ? true : false}
                                            name='empAll'
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <ReactSelect
                                            onChange={(event) => handleSelectedData(event, 'emp')}
                                            options={employee &&
                                                employee.map(emp =>
                                                    ({ value: emp.id, label: `${emp.empCode} : ${emp.empName}` }))}
                                            placeholder="Select"
                                            value={employeeID}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col md={8} sm={12}>
                                <FormGroup row className='align-items-center'>
                                    <Col md={3}>

                                    </Col>
                                    <Col md={8} className='ps-5'>
                                        <InputGroup size='lg'>
                                            <Label check className="fs-4 ">
                                                <Input type="radio"
                                                    value={isGroupData}
                                                    checked={isGroupData === 1}
                                                    onChange={() => setIsGroupData(1)}
                                                    className="fs-4 mx-2 border border-primary border-3 " />
                                                Detail
                                            </Label>
                                            <Label check className="fs-4 ">
                                                <Input type="radio"
                                                    value={isGroupData}
                                                    checked={isGroupData === 0}
                                                    onChange={() => setIsGroupData(0)}
                                                    className="fs-4 mx-2 border border-primary border-3 " />
                                                Summary
                                            </Label>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4} sm={12}>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded mt-1 mb-2 me-2 px-4"
                                            onClick={handleShowReport}
                                            disabled={
                                                (!transactionDate)
                                                    || (reportData.deptAll === 0 && reportData.departmentID === 0)
                                                    || (reportData.empAll === 0 && reportData.employeeID === 0)
                                                    || (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0)
                                                    ? true : false
                                            }
                                        >
                                            Show Report
                                        </Button>
                                    </div>
                                    <div>
                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                            disabled={
                                                (!transactionDate)
                                                    || (reportData.deptAll === 0 && reportData.departmentID === 0)
                                                    || (reportData.empAll === 0 && reportData.employeeID === 0)
                                                    || (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0)
                                                    ? true : false
                                            }
                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded px-4"
                                                    disabled={
                                                        (!transactionDate)
                                                            || (reportData.deptAll === 0 && reportData.departmentID === 0)
                                                            || (reportData.empAll === 0 && reportData.employeeID === 0)
                                                            || (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0)
                                                            ? true : false
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

export default EmployeeSalaryRegisterReport