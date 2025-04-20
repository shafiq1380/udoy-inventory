import React, { useEffect, useMemo, useState } from 'react'
import { authorization } from '../../../components/Common/Authorization'
import { Button, Card, CardBody, Col, Container, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { Post } from '../../../utils/https'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import DynamicTable from '../PayrollSetupReport/DynamicTable'
import ReactSelect from 'react-select'
import EmployeeReportDateCmp from './EmployeeReportDateCmp'
import EmpRptCheckBox from './EmpRptCheckBox'
import CustomizeTableData from './CustomizeTableData'
import CustomButton from '../../JournalVoucher/CustomButton'

const EmployeePayrollReport = () => {

    const [showReportData, setShowReportData] = useState([])
    const [loading, setLoading] = useState(false)
    const [showNoData, setShowNoData] = useState('')

    const [department, setDepartment] = useState([])
    const [employee, setEmployee] = useState([])
    const [employeeType, setEmployeeType] = useState([])

    const [departmentID, setDepartmentID] = useState({})
    const [employeeTypeID, setEmployeeTypeID] = useState({})
    const [employeeID, setEmployeeID] = useState({})

    const [periodDate, setPeriodDate] = useState(new Date());
    // const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [toDate, setToDate] = useState(new Date());
    const [isGroupData, setIsGroupData] = useState(0)

    const [reportData, setReportData] = useState({
        monthAll: 0,
        deptAll: 0,
        empAll: 0,
        empTypeAll: 0,
        departmentID: 0,
        employeeID: 0,
        employeeTypeID: 0,
    })

    // show the table data 
    const [showTable, setShowTable] = useState(true)

    const getDepartment = () => {
        try {
            Post('/api/EmployeeManagement/GetAllDepartment')
                .then(res => setDepartment(res.data.data))
        } catch (error) {

        }
    }
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
    }

    //remove the sepcial character from data 
    const sanitizeKey = (key) => key.replace(/[^\w\s]/gi, '');
    const sanitizedData = showReportData?.map((item) => {
        const sanitizedItem = {};
        for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
                const sanitizedKey = sanitizeKey(key);
                sanitizedItem[sanitizedKey] = item[key];
            }
        }
        return sanitizedItem;
    });


    //separate accessors from data
    const accessors = Array.from(
        new Set(sanitizedData?.flatMap(item => Object?.keys(item)))
    );

    //separate headers from data
    const headers = Array.from(
        new Set(showReportData?.flatMap(item => Object?.keys(item)))
    );

    const columns = useMemo(() => {
        return accessors.map((accessor, index) => ({
            Header: headers[index], // Use the corresponding header
            accessor: accessor,
        }));
    }, [accessors, headers]);

    //column key make unique 
    const uniqueColumns = columns.map((column, index) => ({
        ...column,
        id: `column-${index}`,
    }));



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
    }
    const handleDate = (dte, name) => {
        const date = dte?.split('/').reverse().join('-')
        // console.log(date)
        if (name === 'periodDate') {
            setPeriodDate(date)
            setReportData({
                ...reportData, ['startDate']: date, ['monthAll']: 0
            })
        } else if (name === 'toDate') {
            setToDate(date)
            setReportData({
                ...reportData, ['endDate']: date, ['monthAll']: 0
            })
        }

    }



    const handleDownload = () => {
        const data = {
            ...reportData, ['startDate']: periodDate, ['endDate']: toDate,
            ['isGroup']: isGroupData, ['addCodeList']: checkedForCIds, ['dedCodeList']: checkedForDIds
        }
        // console.log(data)

        try {
            Post('/api/Payroll/GetPayrollReportTable', { data })
                .then(res => {
                    if (res.status === 200) {
                        res.data.fileContents = res.data.fileContents.replace(/^data:image\/[a-z]+;base64,/, "");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = res.data.fileDownloadName;
                        downloadLink.href = `data:image/png;base64,${res.data.fileContents}`;
                        downloadLink.click();
                    }
                })
        } catch (error) {
            console.log("Download Error ------->>>", error)
        }
    };


    const handlShowReport = async () => {
        setShowReportData([])
        setLoading(true)
        const data = {
            ...reportData, ['startDate']: periodDate, ['endDate']: toDate,
            ['isGroup']: isGroupData, ['addCodeList']: checkedForCIds, ['dedCodeList']: checkedForDIds
        }
        // console.log(data)
        try {
            await Post('/api/Payroll/GetPayrollReport', { data })
                .then(res => {
                    // console.log(res.data)
                    if (res.data.length > 0) {
                        setLoading(false)
                        // console.log(res)
                        setShowReportData(res.data)

                    } else {
                        setLoading(false)
                        setShowNoData('No Data Found')
                    }
                })
        } catch (error) {

        }
    }

    // console.log(employeeType)

    useEffect(() => {
        getDepartment()
        getEmployee()
        getEmployeeType()
    }, [])

    // console.log(employeeType)


    // Authorization check
    useEffect(() => {
        authorization(71)
    }, [])


    // here is a issue the Date picker component use only date and month 
    // that's why it's not support in mobile view


    // here code start for the table customize data . 

    const [checkedForCIds, setcheckedForCIds] = useState([]);
    const [checkedForDIds, setcheckedForDIds] = useState([]);
    const [payroll, setPayroll] = useState([])
    const [forTypeC, setForTypeC] = useState([])
    const [forTypeD, setForTypeD] = useState([])


    const getPayroll = async () => {
        const response = await Post('/api/Payroll/GetSalaryForCodeList', {
            data: 0,
        }).then(res => setPayroll(res.data.data))
    }

    useEffect(() => {
        getPayroll()
    }, [])


    useEffect(() => {
        if (payroll) {
            const filteredForTypeC = payroll.filter(item => item.forType === "C");
            const filteredForTypeD = payroll.filter(item => item.forType === "D");

            setForTypeC(filteredForTypeC);
            setForTypeD(filteredForTypeD);

            // Update checked IDs for Type C and Type D
            setcheckedForCIds(filteredForTypeC.map(item => item.id));
            setcheckedForDIds(filteredForTypeD.map(item => item.id));
        }
    }, [payroll,])





    const tableDataShow = () => {
        setShowTable(!showTable)
    }


    const handleForCcheckboxChange = (id) => {
        setcheckedForCIds((prevChecked) =>
            prevChecked.includes(id)
                ? prevChecked.filter((checkedId) => checkedId !== id)
                : [...prevChecked, id]
        );
    };

    const handleCTextClick = (id) => {
        handleForCcheckboxChange(id);
    };

    const handleForDcheckboxChange = (id) => {
        setcheckedForDIds((prevChecked) =>
            prevChecked.includes(id)
                ? prevChecked.filter((checkedId) => checkedId !== id)
                : [...prevChecked, id]
        );
    };

    const handleDTextClick = (id) => {
        handleForDcheckboxChange(id);
    };

    const selectAllForC = () => {
        if (checkedForCIds.length === forTypeC.length) {
            setcheckedForCIds([]);
        } else {
            setcheckedForCIds(forTypeC.map(item => item.id));
        }
    };


    const selectAllForD = () => {
        if (checkedForDIds.length === forTypeD.length) {
            setcheckedForDIds([]);
        } else {
            setcheckedForDIds(forTypeD.map(item => item.id));
        }
    };


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={' Report/Employee Payroll Report'} BreadcrumbTitle={'Report/Employee Payroll Report'} />

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
                                            <Col md={2} className='p-1 ' style={{ marginLeft: '-7px' }}>
                                                <EmpRptCheckBox
                                                    handleCheckBox={handleCheckBox}
                                                    value={reportData.monthAll === 1 ? true : false}
                                                    name='monthAll'
                                                />
                                            </Col>
                                            <Col md={6} >
                                                <EmployeeReportDateCmp
                                                    label="Period"
                                                    date={periodDate}
                                                    handleDate={handleDate}
                                                    name='periodDate'
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col md={4} sm={12}>
                                        <FormGroup row className='align-items-center py-2'>
                                            <Col md={3}>
                                                <Label size='lg' className='text-end'>TO</Label>
                                            </Col>

                                            <Col md={8}>
                                                <EmployeeReportDateCmp
                                                    label="Period"
                                                    date={toDate}
                                                    handleDate={handleDate}
                                                    name='toDate'
                                                />
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
                                                            value={isGroupData}
                                                            checked={isGroupData === 0}
                                                            onChange={() => setIsGroupData(0)}
                                                            className="fs-4 mx-2 border border-primary border-3 " />
                                                        Details
                                                    </Label>
                                                    <Label check className="fs-4 ">
                                                        <Input type="radio"
                                                            value={isGroupData}
                                                            checked={isGroupData === 1}
                                                            onChange={() => setIsGroupData(1)}
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
                                        <div className='d-flex flex-wrap justify-content-end'>
                                            <div>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn-rounded  mb-2 me-2 px-4"
                                                    onClick={handlShowReport}
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
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded  mb-2 me-2 px-4"
                                                    onClick={handleDownload}
                                                    disabled={
                                                        reportData.monthAll === 0 &&
                                                            (!periodDate && !toDate) ||
                                                            (periodDate && !toDate || !periodDate && toDate) ||
                                                            (reportData.deptAll === 0 && reportData.departmentID === 0) ||
                                                            (reportData.empAll === 0 && reportData.employeeID === 0) ||
                                                            (reportData.empTypeAll === 0 && reportData.employeeTypeID === 0) ? true : false
                                                    }
                                                >
                                                    Export Report
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            <Col md={5} >
                                {
                                    showTable ?
                                        <CustomizeTableData
                                            tableDataShow={tableDataShow}
                                            checkedForCIds={checkedForCIds}
                                            checkedForDIds={checkedForDIds}
                                            setcheckedForCIds={setcheckedForCIds}
                                            setcheckedForDIds={setcheckedForDIds}
                                            handleForCcheckboxChange={handleForCcheckboxChange}
                                            handleForDcheckboxChange={handleForDcheckboxChange}
                                            selectAllForC={selectAllForC}
                                            selectAllForD={selectAllForD}
                                            handleCTextClick={handleCTextClick}
                                            handleDTextClick={handleDTextClick}
                                            forTypeC={forTypeC}
                                            forTypeD={forTypeD}
                                        />
                                        :
                                        <div className='d-flex align-items-center justify-content-center' style={{ height: '300px' }}>
                                            <CustomButton onClick={tableDataShow} text={'Show Table'} />
                                        </div>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                {
                    loading ? <CustomSpinner /> :
                        showReportData?.length > 0 ?
                            <Card>
                                <CardBody>
                                    <DynamicTable
                                        columns={uniqueColumns}
                                        data={sanitizedData}
                                        customPageSize={200}
                                        excelDownload={handleDownload}
                                        gridExBtn
                                    />
                                </CardBody>
                            </Card>
                            :
                            // <CustomSpinner />
                            showNoData ? <p className=' text-center text-muted fs-2'>{showNoData}</p> : null

                }

            </Container>
        </div >
    )
}

export default EmployeePayrollReport