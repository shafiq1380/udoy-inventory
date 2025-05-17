import React, { useEffect, useMemo, useState } from 'react'
import { authorization } from '../../../components/Common/Authorization'
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { Post } from '../../../utils/https'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import Flatpickr from "react-flatpickr";
import ReactSelect from 'react-select'
import GpfReportDateCmp from './GpfReportDateCmp'
import GpfCheckBox from './GpfCheckBox'
import { gpfDownloadReport, gpfShowPdfGenerator } from './GpfTransactionReport'
// import CustomizeTableData from './CustomizeTableData'
// import CustomButton from '../../JournalVoucher/CustomButton'

const GpfReport = () => {

    const [loading, setLoading] = useState(false)
    const [pdfLink, setpdfLink] = useState()

    const [department, setDepartment] = useState([])
    const [employee, setEmployee] = useState([])
    const [employeeType, setEmployeeType] = useState([])

    const [departmentID, setDepartmentID] = useState({})
    const [employeeTypeID, setEmployeeTypeID] = useState({})
    const [employeeID, setEmployeeID] = useState({})

    const [btnDropdown, setBtnDropdown] = useState(false)

    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));


    const [issummary, setIssummary] = useState(1)

    const [reportData, setReportData] = useState({
        // monthAll: 0,
        deptAll: 0,
        empAll: 0,
        empTypeAll: 0,
        departmentID: 0,
        employeeID: 0,
        employeeTypeID: 0,
    })


    const getDepartment = () => {
        try {
            Post('/api/v1/EmployeeManagement/GetAllDepartment')
                .then(res => setDepartment(res.data.data))
        } catch (error) {

        }
    }

    const getEmployee = () => {
        try {
            Post('/api/v1/EmployeeManagement/GetAllEmployee')
                .then(res => setEmployee(res.data.data))
        } catch (error) {

        }
    }
    const getEmployeeType = () => {
        try {
            Post('/api/v1/Payroll/GetEmployeeType')
                .then(res => setEmployeeType(res.data.data))
        } catch (error) {

        }
    }


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
    }


    //handle checkbox data 
    const handleCheckBox = (e) => {
        const { checked, name } = e.target
        // if (name === 'monthAll') {
        //     setPeriodDate(null)
        //     setToDate(null)
        //     setReportData({
        //         ...reportData, ['monthAll']: checked ? 1 : 0
        //     })
        // } 
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
    }



    const handleDownloadReport = (type) => {
        gpfDownloadReport(
            reportData.empTypeAll,
            reportData.deptAll,
            reportData.empAll,
            transactionFrom,
            transactionTo,
            reportData.employeeTypeID,
            reportData.employeeID,
            reportData.departmentID,
            issummary,
            type,
        )

    }


    const handlShowReport = async () => {
        setLoading(!loading)
        const pefLink = gpfShowPdfGenerator(
            reportData.empTypeAll,
            reportData.deptAll,
            reportData.empAll,
            transactionFrom,
            transactionTo,
            reportData.employeeTypeID,
            reportData.employeeID,
            reportData.departmentID,
            issummary
        );
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDate = (dte, name) => {
        // const date = dte?.split('/').join('/')
        if (name === 'periodDate') {
            settransactionFrom(dte)
        } else if (name === 'toDate') {
            settransactionTo(dte)
        }
    }


    useEffect(() => {
        getDepartment()
        getEmployee()
        getEmployeeType()
    }, [])

    // Authorization check
    useEffect(() => {
        authorization(114)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'GPF Report'} BreadcrumbTitle={'GPF Report'} />
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={7}>

                                <Row >
                                    <Col md={8} sm={12}>
                                        <FormGroup row className='align-items-center'>
                                            <Col md={4}>
                                                <Label size='lg' className='text-end pt-0'>Period</Label>
                                            </Col>
                                            <Col md={2} className='p-1' style={{ marginLeft: '-7px' }}>
                                                {/* <GpfCheckBox
                                                    handleCheckBox={handleCheckBox}
                                                    value={reportData.monthAll === 1 ? true : false}
                                                    name='monthAll'
                                                /> */}
                                                <Col md={1} className="fs-4 d-flex align-items-center mb-sm-2">
                                                    <label className="form-check-label"></label>
                                                    <div
                                                        className=" mx-2 p-3 mt-2"
                                                    />
                                                </Col >
                                            </Col>

                                            <Col md={6} >
                                                <GpfReportDateCmp
                                                    label="Period"
                                                    date={transactionFrom}
                                                    handleDate={handleDate}
                                                    name='periodDate'
                                                />
                                                {/* <Flatpickr
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
                                                /> */}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col md={4} sm={12}>
                                        <FormGroup row className='align-items-center py-2'>
                                            <Col md={3}>
                                                <Label size='lg' className='text-end'>TO</Label>
                                            </Col>

                                            <Col md={8}>
                                                <GpfReportDateCmp
                                                    label="Period"
                                                    date={transactionTo}
                                                    handleDate={handleDate}
                                                    name='toDate'
                                                />

                                                {/* <Flatpickr
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
                                                ></Flatpickr> */}
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} sm={12} >
                                        <FormGroup row className='align-items-center'>
                                            <Col md={2}>
                                                <Label size='lg' className='pt-0'>Employee Type </Label>
                                            </Col>
                                            <Col md={1} className='mx-md-4'>
                                                <GpfCheckBox
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
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} sm={12}>
                                        <FormGroup row className='align-items-center'>
                                            <Col md={2}>
                                                <Label size='lg' className='pt-0'>Department </Label>
                                            </Col>
                                            <Col md={1} className='mx-md-4 '>
                                                <GpfCheckBox
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
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} sm={12}>
                                        <FormGroup row className='align-items-center'>
                                            <Col md={2}>
                                                <Label size='lg' className='pt-0'>Employee </Label>
                                            </Col>
                                            <Col md={1} className='mx-md-4'>
                                                <GpfCheckBox
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
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>

                                    <Col md={12} sm={12}>
                                        <FormGroup row className='align-items-center'>
                                            <Col md={3}>

                                            </Col>
                                            <Col md={8} className='ps-5'>
                                                <InputGroup size='lg'>
                                                    <Label check className="fs-4 ">
                                                        <Input type="radio"
                                                            value={issummary}
                                                            checked={issummary === 0}
                                                            onChange={() => setIssummary(0)}
                                                            className="fs-4 mx-2 border border-primary border-3 " />
                                                        Details
                                                    </Label>
                                                    <Label check className="fs-4 ">
                                                        <Input type="radio"
                                                            value={issummary}
                                                            checked={issummary === 1}
                                                            onChange={() => setIssummary(1)}
                                                            className="fs-4 mx-2 border border-primary border-3 " />
                                                        Summary
                                                    </Label>
                                                </InputGroup>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} sm={12}>
                                        <div className='d-flex flex-wrap justify-content-end '>
                                            <div>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn-rounded  mt-md-1 me-2 px-4"
                                                    onClick={handlShowReport}
                                                    disabled={transactionFrom === '' || transactionTo === '' ? true : false
                                                        ||
                                                        (reportData.deptAll === 0 && reportData.departmentID === 0) ||
                                                        (reportData.empAll === 0 && reportData.employeeID === 0) ||
                                                        (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0) ? true : false
                                                    }
                                                >
                                                    Show Report
                                                </Button>
                                            </div>

                                            {/* <div> */}
                                            <ButtonDropdown
                                                toggle={() => { setBtnDropdown(!btnDropdown) }}
                                                isOpen={btnDropdown}
                                                disabled={transactionFrom === '' || transactionTo === '' ? true : false
                                                    ||
                                                    (reportData.deptAll === 0 && reportData.departmentID === 0) ||
                                                    (reportData.empAll === 0 && reportData.employeeID === 0) ||
                                                    (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0) ? true : false
                                                }
                                            >
                                                <DropdownToggle color="white border border-white p-1" caret>
                                                    <Button
                                                        type="button"
                                                        color="success"
                                                        className="btn-rounded px-4"
                                                        disabled={transactionFrom === '' || transactionTo === '' ? true : false
                                                            ||
                                                            (reportData.deptAll === 0 && reportData.departmentID === 0) ||
                                                            (reportData.empAll === 0 && reportData.employeeID === 0) ||
                                                            (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0) ? true : false
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
                                            {/* </div> */}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                    </CardBody>
                </Card>


                <Row style={{ height: '100vh', marginBottom: '20px' }}>
                    {
                        loading ?
                            <CustomSpinner />
                            :
                            <iframe src={pdfLink} width="100%" height="100%"></iframe>
                    }
                </Row>

            </Container>
        </div >
    )
}

export default GpfReport