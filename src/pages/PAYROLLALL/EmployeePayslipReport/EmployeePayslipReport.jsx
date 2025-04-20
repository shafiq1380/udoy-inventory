import React, { useState, useEffect } from 'react'
import { authorization } from '../../../components/Common/Authorization'
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, InputGroup, Label, Row } from 'reactstrap'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Post, REPORT_URL, REPORT_URL1 } from '../../../utils/https'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import ReactSelect from 'react-select'
import EmpRptCheckBox from './../EmployeePayrollReport/EmpRptCheckBox';
import axios from 'axios';
import Flatpickr from "react-flatpickr";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";


const EmployeePayslipReport = () => {

    const [loading, setLoading] = useState(false)
    const [department, setDepartment] = useState([])
    const [employee, setEmployee] = useState([])
    const [employeeType, setEmployeeType] = useState([])
    const [departmentID, setDepartmentID] = useState({})
    const [employeeTypeID, setEmployeeTypeID] = useState({})
    const [employeeID, setEmployeeID] = useState({})
    const [periodDate, setPeriodDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [btnDropdown, setBtnDropdown] = useState(false)
    const [withValue, setWithValue] = useState(0);

    const [reportData, setReportData] = useState({
        monthAll: 0,
        deptAll: 0,
        empAll: 0,
        empTypeAll: 0,
        departmentID: 0,
        employeeID: 0,
        employeeTypeID: 0,
    })

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
    }
    const getEmployeeType = () => {
        try {
            Post('/api/Payroll/GetEmployeeType')
                .then(res => setEmployeeType(res.data.data))
        } catch (error) {

        }
    };

    //get the selected data
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
        if (name === 'monthAll') {
            setPeriodDate(null)
            setToDate(null)
            setReportData({
                ...reportData, ['monthAll']: checked ? 1 : 0
            })
        } else if (name === 'deptAll') {
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

    const handleDate = (date, name) => {
        if (date) {
            // const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            //     year: 'numeric',
            //     month: '2-digit',
            //     day: '2-digit'
            // });

            if (name === 'periodDate') {
                setPeriodDate(date);
                setReportData({
                    ...reportData,
                    ['startDate']: date,
                    ['monthAll']: 0
                });
            } else if (name === 'toDate') {
                setToDate(date);
                setReportData({
                    ...reportData,
                    ['endDate']: date,
                    ['monthAll']: 0
                });
            }
        } else {
            if (name === 'periodDate') {
                setPeriodDate('');
            } else if (name === 'toDate') {
                setToDate('');
            }
        }
    };

    const handleZeroCheckBox = (e) => {
        console.log("e.target.checked", e.target.checked)
        const { checked } = e.target;
        setWithValue(checked ? 1 : 0);
    };

    useEffect(() => {
        getDepartment()
        getEmployee()
        getEmployeeType()
    }, [])


    // Authorization check
    useEffect(() => {
        authorization(99)
    }, []);

    const [pdfLink, setPdfLink] = useState()


    const handleShowReport = async () => {

        setLoading(!loading)

        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const token = JSON.parse(localStorage.getItem('authKey'));
        const userID = JSON.parse(localStorage.getItem('userID'));
        const fromDate = periodDate ? periodDate : "";
        const toDat = toDate ? toDate : "";
        const deptID = reportData.departmentID;
        const empID = reportData.employeeID;
        const empTypeID = reportData.employeeTypeID;
        const monthAll = reportData.monthAll;
        const deptAll = reportData.deptAll;
        const empAll = reportData.empAll;
        const empTypeAll = reportData.empTypeAll;

        const BASEURL = `${REPORT_URL}/api/PayrollReport/GetPayslipReport?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&MonthAll=${monthAll}&EmpTypeAll=${empTypeAll}&DeptAll=${deptAll}&EmpAll=${empAll}&StartDate=${fromDate ? fromDate : ""}&EndDate=${toDat ? toDat : ""}&EmployeeTypeID=${empTypeID}&EmployeeID=${empID}&DepartmentID=${deptID}&WithValue=${withValue}`;

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
                console.error('Error fetching PDF:', error);
            });
    };

    const handleDownloadReport = (type) => {


        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const token = JSON.parse(localStorage.getItem('authKey'));
        const userID = JSON.parse(localStorage.getItem('userID'));
        const fromDate = periodDate ? periodDate : "";
        const toDat = toDate ? toDate : "";
        const deptID = reportData.departmentID;
        const empID = reportData.employeeID;
        const empTypeID = reportData.employeeTypeID;
        const monthAll = reportData.monthAll;
        const deptAll = reportData.deptAll;
        const empAll = reportData.empAll;
        const empTypeAll = reportData.empTypeAll;

        const BASEURL = `${REPORT_URL}/api/PayrollReport/GetPayslipReport?cCode=${cCode}&auth=${token}&downloadtype=${type}&UserID=${userID}&MonthAll=${monthAll}&EmpTypeAll=${empTypeAll}&DeptAll=${deptAll}&EmpAll=${empAll}&StartDate=${fromDate ? fromDate : ""}&EndDate=${toDat ? toDat : ""}&EmployeeTypeID=${empTypeID}&EmployeeID=${empID}&DepartmentID=${deptID}&WithValue=${withValue}`;


        window.location.href = BASEURL

    }


    // formatting date for the to date 
    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month + 1, 0);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Report" breadcrumbItem="Employee Payslip Report" />

                <Card>
                    <CardBody>

                        <Row>
                            <Col md={8} sm={12}>
                                <Row className='align-items-center'>
                                    <Col md={2}>
                                        <Label size='lg' className=''>Period</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'>
                                        <EmpRptCheckBox
                                            handleCheckBox={handleCheckBox}
                                            value={reportData.monthAll === 1 ? true : false}
                                            name='monthAll'
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Flatpickr
                                            className="form-control"
                                            placeholder="DD/MM/YYYY"
                                            options={{
                                                plugins: [
                                                    new monthSelectPlugin({
                                                        shorthand: true,
                                                        dateFormat: "d/m/Y",
                                                        altInput: true,
                                                        altFormat: "m-Y",
                                                        theme: "light"
                                                    })
                                                ],
                                                static: true
                                            }}
                                            onChange={(selectedDates, dateStr) => handleDate(dateStr, 'periodDate')}
                                            value={periodDate}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Label size='lg'>TO</Label>
                                    </Col>
                                    <Col md={3}>
                                        <Flatpickr
                                            className="form-control"
                                            placeholder="DD/MM/YYYY"
                                            options={{
                                                plugins: [
                                                    new monthSelectPlugin({
                                                        shorthand: true,
                                                        dateFormat: "d/m/Y",
                                                        altInput: true,
                                                        altFormat: "Y-m-d",
                                                        theme: "light",
                                                    })
                                                ],
                                                static: true
                                            }}
                                            // onChange={(selectedDates, dateStr) => handleDate(dateStr, 'toDate')}

                                            onChange={(selectedDates, dateStr) => {
                                                if (selectedDates.length > 0) {
                                                    const selectedDate = selectedDates[0];
                                                    const year = selectedDate.getFullYear();
                                                    const month = selectedDate.getMonth();

                                                    const lastDayOfMonth = getLastDayOfMonth(year, month);

                                                    const formattedDate = formatDate(lastDayOfMonth);
                                                    handleDate(formattedDate, 'toDate');
                                                }
                                            }}
                                            value={toDate}
                                        />
                                    </Col>
                                </Row>
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
                                            // styles={customStyles}
                                            onChange={(event) => handleSelectedData(event, 'emp')}
                                            options={employee &&
                                                employee.map(emp =>
                                                    ({ value: emp.id, label: `${emp.empCode} : ${emp.empName}` }))}
                                            placeholder="Select"
                                            value={employeeID}
                                        // autoFocus
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8} sm={12}>
                                <Row className='align-items-center'>
                                    <Col md={2}></Col>
                                    <Col md={4} className='mx-md-5'>
                                        <InputGroup size='lg'>
                                            <input
                                                type="checkbox"
                                                className="form-check-input checkboxboder mx-2 p-3"
                                                checked={withValue}
                                                onChange={handleZeroCheckBox}
                                                id="withValue"
                                            />
                                            <Label for="withValue" className="form-check-label" size="lg">With Ledger Balance</Label>

                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col md={8} sm={12}>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded mt-2 mb-2 me-2 px-4"
                                            onClick={handleShowReport}
                                            disabled={
                                                reportData.monthAll === 0 &&
                                                    (!periodDate && !toDate) ||
                                                    (periodDate && !toDate || !periodDate && toDate) ||
                                                    (reportData.deptAll === 0 && reportData.departmentID === 0) ||
                                                    (reportData.empAll === 0 && reportData.employeeID === 0) || (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0) ? true : false
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
                                                reportData.monthAll === 0 &&
                                                    (!periodDate && !toDate) ||
                                                    (periodDate && !toDate || !periodDate && toDate) ||
                                                    (reportData.deptAll === 0 && reportData.departmentID === 0) ||
                                                    (reportData.empAll === 0 && reportData.employeeID === 0) || (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0) ? true : false
                                            }

                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded px-4"
                                                    disabled={
                                                        reportData.monthAll === 0 &&
                                                            (!periodDate && !toDate) ||
                                                            (periodDate && !toDate || !periodDate && toDate) ||
                                                            (reportData.deptAll === 0 && reportData.departmentID === 0) ||
                                                            (reportData.empAll === 0 && reportData.employeeID === 0) || (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0) ? true : false
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

export default EmployeePayslipReport