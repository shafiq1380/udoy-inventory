import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Modal, ModalBody, Row, Table } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import { Post, REPORT_URL } from '../../../utils/https'
import DynamicTable from '../PayrollSetupReport/DynamicTable'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import ErrorModal from '../Common/ErrorModal'
import { authorization } from '../../../components/Common/Authorization'
import convertAndDownloadPdf from '../../../components/Common/convertAndDownloadPdf'
import axios from 'axios';
import { getAllAllowanceReportTypeDownload } from './GetBankStatementReport'



const PayrollDetails = () => {

    const [error, setError] = useState(null)
    const [modalShow, setModalShow] = useState(false)

    const { id } = useParams()
    const navigate = useNavigate()
    const userId = JSON.parse(localStorage.getItem("userID"))
    const [reportLoading, setReportLoading] = useState(false);
    const [btnDropdown, setBtnDropdown] = useState(false);
    const [pdfLink, setPdfLink] = useState()



    // console.log(data)

    // //separete key from data
    // const allKeys = Array.from(
    //     new Set(data?.payrollData?.flatMap(item => Object?.keys(item)))
    // );

    // // Generate columns based on keys
    // const columns = useMemo(
    //     () =>
    //         allKeys?.map(key => ({
    //             Header: key,
    //             accessor: key,
    //         })),
    //     [allKeys]
    // );

    // //column key make unique 
    // const uniqueColumns = columns.map((column, index) => ({
    //     ...column,
    //     id: `column-${index}`,
    // }));



    const [originalData, setOriginalData] = useState();
    const [sanitizedData, setSanitizedData] = useState();


    // ...
    const sanitizeKey = (key) => key.replace(/[^\w\s]/gi, '');
    const getData = () => {
        const requestData = { payrollID: id, userID: userId };
        try {
            Post('/api/Payroll/GetPayrollByID', { data: requestData })
                .then(res => {
                    if (res.data.success === true) {
                        setOriginalData(res?.data?.data);
                        // Sanitize the data and set it in state
                        const sanitizedData = res?.data?.data?.payrollData?.map((item) => {
                            const sanitizedItem = {};
                            for (const key in item) {
                                if (Object.hasOwnProperty.call(item, key)) {
                                    const sanitizedKey = sanitizeKey(key);
                                    sanitizedItem[sanitizedKey] = item[key];
                                }
                            }
                            return sanitizedItem;
                        });
                        setSanitizedData(sanitizedData);
                    }
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    //separate accessors from data
    const accessors = Array.from(
        new Set(sanitizedData?.flatMap(item => Object?.keys(item)))
    );

    //separate headers from data
    const headers = Array.from(
        new Set(originalData?.payrollData?.flatMap(item => Object?.keys(item)))
    );

    const columns = useMemo(() => {
        return accessors.map((accessor, index) => ({
            Header: headers[index], // Use the corresponding header
            accessor: sanitizeKey(accessor),
        }));
    }, [accessors, headers]);

    //column key make unique 
    const uniqueColumns = columns.map((column, index) => ({
        ...column,
        id: `column-${index}`,
    }));



    const handleDownload = () => {
        const data = { payrollID: id, userID: userId }
        try {
            Post('/api/Payroll/GetPayrollByIDTable', { data: data })
                .then(res => {
                    if (res.status === 200) {
                        res.data.fileContents = res.data.fileContents.replace(/^data:image\/[a-z]+;base64,/, "");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = res.data.fileDownloadName;
                        //content // file .extension // title // page size
                        // convertAndDownloadPdf(res.data.fileContents, res.data.fileDownloadName, 'Employee Payroll', 'a1');
                        downloadLink.href = `data:image/png;base64,${res.data.fileContents}`;
                        downloadLink.click();
                    }
                })
        } catch (error) {
            console.log("Download Error ------->>>", error)
        }
    };


    const handleUpdate = async () => {
        const data = { payrollID: +id, userID: userId }
        try {
            await Post('/api/Payroll/PayrollUpdate', { data: data })
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

    const handlePost = async () => {
        const data = { payrollID: +id, userID: userId }
        try {
            await Post('/api/Payroll/PayrollPost', { data: data })
                .then(res => {
                    // console.log(res.data)
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

    const handlePostOnly = async () => {
        const data = { payrollID: +id, userID: userId }
        try {
            await Post('/api/Payroll/PayrollPostOnly', { data: data })
                .then(res => {
                    // console.log(res.data)
                    if (res.data.success === false) {
                        setError({ message: res.data.errorMessage, color: 'danger' })
                        handleModal()
                    } else {
                        navigate('/employee-payroll')
                    }
                })
        } catch (error) {
            console.log("Error", error)
        }
    }

    const handleCreateVoucher = async () => {
        // console.log(originalData.payrollHdr.salDate)
        const data = { payrollID: id, payrollDate: originalData.payrollHdr.salDate, userID: userId }
        try {
            await Post('/api/Payroll/PayrollCreateVoucher', { data: data })
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

    // console.log(originalData)

    // const handleShowBankStatement = async () => {
    //     setReportLoading(true);
    //     const cCode = JSON.parse(localStorage.getItem('cCode'));
    //     const auth = JSON.parse(localStorage.getItem('authKey'));
    //     const BASEURL = `${REPORT_URL}/api/PayrollReport/GetBankStatement?cCode=${cCode}&auth=${auth}&downloadtype=pdf&SalID=${id}`;
    //     try {
    //         const response = await axios.get(`${BASEURL}`, {
    //             responseType: 'blob',
    //         });
    //         const blob = new Blob([response.data], { type: 'application/pdf' });
    //         const url = URL.createObjectURL(blob);
    //         setPdfLink(url);
    //     } catch (error) {
    //         console.error('Error fetching PDF:', error);
    //     } finally {
    //         setReportLoading(false);
    //     }
    // };

    const handleDownloadReport = useCallback((type) => {
        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const auth = JSON.parse(localStorage.getItem('authKey'));
        getAllAllowanceReportTypeDownload(auth, cCode, type, id);
    }, [id]);

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Payroll/Details'} BreadcrumbTitle={'Payroll/Details'} />
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
                        <FormGroup row>
                            <Col md={4}>
                                <Table bordered>
                                    <tbody>
                                        <tr >
                                            <td>
                                                ID
                                            </td>
                                            <td className='text-black text-end'>
                                                {originalData?.payrollHdr?.id}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                Payroll Month
                                            </td>
                                            <td className='text-black text-end'>
                                                {originalData?.payrollHdr?.salTitle}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                Created By
                                            </td>
                                            <td className='text-black text-end'>
                                                {originalData?.payrollHdr?.createdBy}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                Created Date
                                            </td>
                                            <td className='text-black text-end'>
                                                {originalData?.payrollHdr?.createdDatetime?.split('T')[0]?.split('-').reverse().join('/')}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                Posted By
                                            </td>
                                            <td className='text-black text-end'>
                                                {originalData?.payrollHdr?.lastUpdateBy || 'N/A'}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                Posted Date
                                            </td>
                                            <td className='text-black text-end'>
                                                {originalData?.payrollHdr?.lastUpdateDate?.split('T')[0]?.split('-').reverse().join('/') || 'N/A'}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                Voucher ID
                                            </td>
                                            <td className='text-black text-end'>
                                                {originalData?.payrollHdr?.voucherID || 'N/A'}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                Voucher REF
                                            </td>
                                            <td className='text-black text-end'>
                                                {originalData?.payrollHdr?.voucherRef || 'N/A'}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                Payroll Status
                                            </td>
                                            <td className='text-black text-end'>
                                                {originalData?.payrollHdr?.salStatus === 1 ? 'Save' : "Posted"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col md={3}>
                                <Table bordered>
                                    <tbody>
                                        <tr >
                                            <td>Total Employee</td>
                                            <td className='text-black text-end'>
                                                {originalData?.totalEmployee}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>Total Addition</td>
                                            <td className='text-black text-end'>
                                                {originalData?.totalAddition}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>Total Deduction</td>
                                            <td className='text-black text-end'>
                                                {originalData?.totalDeduction}
                                            </td>
                                        </tr>

                                        <tr >
                                            <td>Total Payable</td>
                                            <td className='text-black text-end'>
                                                {originalData?.totalPayable}
                                            </td>
                                        </tr>

                                    </tbody>
                                </Table>
                            </Col>
                        </FormGroup>
                        {
                            originalData?.payrollHdr?.salStatus === 1 &&
                            <Col md={6}>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded  mb-2 me-2 px-5"
                                            onClick={handleUpdate}
                                        >
                                            Update
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded  mb-2 me-2 px-5"
                                            onClick={handlePost}
                                        >
                                            Update and Post
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded  mb-2 me-2 px-5"
                                            onClick={handlePostOnly}
                                        >
                                            Post Only
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        }

                        {/* <Col md={4}>
                            <div className='d-flex flex-wrap justify-content-end'>
                                <div>
                                    <Button
                                        type="button"
                                        color="primary"
                                        className="btn-rounded mt-2 me-2 px-4"
                                        onClick={handleShowBankStatement}

                                    >
                                        Show Bank Statement
                                    </Button>
                                </div>
                                <div>
                                    <ButtonDropdown
                                        toggle={() => setBtnDropdown(!btnDropdown)}
                                        isOpen={btnDropdown}
                                    >
                                        <DropdownToggle color="white border border-white">
                                            <Button
                                                type="button"
                                                color="success"
                                                className="btn-rounded px-4"
                                            >
                                                Export Bank Statement
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
                        </Col> */}

                        {
                            (originalData?.payrollHdr?.salStatus === 2 && originalData?.payrollHdr?.voucherID === null) &&
                            <Col md={4}>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded  mb-2 me-2 px-5"
                                            onClick={handleCreateVoucher}
                                        >
                                            Create Voucher
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        }
                    </CardBody>
                </Card>


                {
                    reportLoading ?
                        <CustomSpinner />
                        :
                        pdfLink &&
                        <Row style={{ height: '100vh', marginBottom: '20px' }}>
                            <iframe src={pdfLink} width="100%" height="100%" frameBorder="0"></iframe>
                        </Row>
                }



                {
                    originalData ?
                        <Card className='mt-3'>
                            <CardBody>
                                <DynamicTable
                                    columns={uniqueColumns}
                                    data={sanitizedData}
                                    // data={data?.payrollData}
                                    customPageSize={200}
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

export default PayrollDetails




