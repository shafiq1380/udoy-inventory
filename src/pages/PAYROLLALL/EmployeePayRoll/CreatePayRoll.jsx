import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, Col, Container, FormGroup, InputGroup, Label, Row, Table } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Flatpickr from "react-flatpickr";
import { Post } from '../../../utils/https';
import DynamicTable from '../PayrollSetupReport/DynamicTable';
import CustomSpinner from '../../../components/Common/CustomSpinner';
import ErrorModal from '../Common/ErrorModal';
import { authorization } from '../../../components/Common/Authorization';

const CreatePayRoll = () => {

    const [data, setData] = useState()
    const [payrollDate, setPayrollDate] = useState(new Date());
    const [modalShow, setModalShow] = useState(false)
    const [error, setError] = useState('')

    const userID = JSON.parse(localStorage.getItem('userID'))
    const navigate = useNavigate()

    const getData = () => {
        try {
            Post('/api/Payroll/GetCurrentPayroll')
                .then(res => {
                    setData(res.data.data)
                })
        } catch (error) {

        }
    }

    //remove the sepcial character from data 
    const sanitizeKey = (key) => key.replace(/[^\w\s]/gi, '');
    const sanitizedData = data?.payrollData.map((item) => {
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
        new Set(data?.payrollData?.flatMap(item => Object?.keys(item)))
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


    //create the payroll
    const handleCreatePayroll = async () => {
        const data = {
            payrollDate: payrollDate,
            userID: userID
        }
        try {
            await Post('/api/Payroll/PayrollCreate', { data: data })
                .then(res => {
                    if (res.data.success === false) {
                        setError({ message: res.data.errorMessage, color: 'danger' })
                        handleModal()
                    } else {
                        navigate('/employee-payroll')
                    }
                })
        } catch (error) {

        }
    }


    //download the excel file 
    const handleDownload = () => {
        try {
            Post('/api/Payroll/GetAllEmployeePaySetupDetail')
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

    //handle modal
    const handleModal = () => {
        setModalShow(!modalShow)
    }



    useEffect(() => {
        getData()
    }, [])

    // Authorization check
    useEffect(() => {
        authorization(70)
    }, [])


    // console.log(payrollDate)

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Payroll/Create-payroll'} BreadcrumbTitle={'Payroll/Create-payroll'} />
                <Button
                    type="button"
                    color="success"
                    className="btn-rounded px-3"
                    onClick={() => navigate(-1)}
                >
                    <IoMdArrowRoundBack size={20} color='white' />
                </Button>

                <Card className='mt-3'>
                    <CardBody>
                        <Row>
                            <Col md={4}>
                                <Label size='lg'>Payroll Date</Label>
                                <Col md={10}>
                                    <InputGroup size='lg'>
                                        <Flatpickr
                                            className="form-control"
                                            placeholder="dd/mm/yyyy"
                                            options={{
                                                dateFormat: "Y-m-d",
                                                altInput: true,
                                                altFormat: "d/m/Y",
                                                allowInput: true,
                                            }}
                                            id="date"
                                            name="date"
                                            onChange={(selectedDates, dateStr) => setPayrollDate(dateStr)}
                                            onClose={(selectedDates, dateStr) => setPayrollDate(dateStr)}
                                            onReady={(selectedDates, dateStr, instance) => {
                                                const inputElement = instance.altInput;
                                                if (inputElement) {
                                                    inputElement.addEventListener('focus', (e) => e.target.select());
                                                }
                                            }}
                                            value={payrollDate}
                                        />
                                    </InputGroup>

                                    <div className=" mt-2 mt-md-4 text-end">
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded  mb-2 me-2"
                                            onClick={handleCreatePayroll}
                                        >
                                            Create Payroll
                                        </Button>
                                    </div>
                                </Col>
                            </Col>
                            <Col md={3}>
                                <Table bordered>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Total Employee
                                            </td>
                                            <td className='text-black text-end'>
                                                {data?.totalEmployee}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Total Addition
                                            </td>
                                            <td className='text-black text-end'>
                                                {data?.totalAddition}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                Total Deduction
                                            </td>
                                            <td className='text-black text-end'>
                                                {data?.totalDeduction}
                                            </td>
                                        </tr>

                                        <tr >
                                            <td>
                                                Total Payable
                                            </td>
                                            <td className='text-black text-end'>
                                                {data?.totalPayable}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                {

                    data?.payrollData ?
                        <Card>
                            <CardBody>
                                <DynamicTable
                                    columns={uniqueColumns}
                                    data={sanitizedData}
                                    customPageSize={100}
                                    excelDownload={handleDownload}
                                    exbtn
                                />
                            </CardBody>
                        </Card>
                        :
                        <CustomSpinner />
                }

            </Container>



            <ErrorModal
                show={modalShow}
                test={error?.message}
                color={error?.color}
                handleModal={handleModal}
            />

        </div>
    )
}

export default CreatePayRoll