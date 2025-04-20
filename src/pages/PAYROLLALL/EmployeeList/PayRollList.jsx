import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import { Post } from "../../../utils/https";


import TableContainer from "../../../components/Common/TableContainer";
import { MobileNumber, UserEmail, UserID, UserName, UserStatus } from '../../UserList/UserCol';
import { Link, } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import PayRollDetailsModal from './PayRollDetailsModal';
import { authorization } from '../../../components/Common/Authorization';
import Breadcrumb from '../../../components/Common/Breadcrumb';

const PayRollList = () => {

    //meta title
    // document.title = "Payroll List | SMART Accounting System";

    const [payrollList, setPayrollList] = useState([]);
    const [modal, setModal] = useState(false);

    const [empPayId, setEmpPayId] = useState(null);


    const getAllEmployee = () => {
        Post('/api/Payroll/GetAllEmployeePaySetup')
            .then(res => {
                res.data.data
                setPayrollList(res.data.data);
            })
    };



    //view Derails Modal 
    const toggleViewModal = async (usr) => {
        setEmpPayId(usr.id)
        setModal(!modal)

    }

    const handleModal = () => {
        setModal(!modal);
    };

    //download the excel file
    const handleDownload = () => {
        try {
            Post('/api/Payroll/GetAllEmployeePaySetupDetail')
                .then(res => {
                    // console.log(res.data)
                    if (res.status === 200) {
                        res.data.fileContents = res.data.fileContents.replace(/^data:image\/[a-z]+;base64,/, "");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = res.data.fileDownloadName;
                        downloadLink.href = `data:image/png;base64,${res.data.fileContents}`;
                        downloadLink.click();
                        console.log(downloadLink)
                    }
                })
        } catch (error) {
            console.log("Download Error ------->>>", error)
        }
    };


    const columns = useMemo(
        () => [
            {
                Header: "User-ID",
                accessor: "empCode",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "User-Name",
                accessor: "empName",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "Employee Type",
                accessor: "employeeTypeName",
                filterable: true,
                filter: 'select',
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Department",
                accessor: "deptName",
                filter: 'select',
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "Designation",
                accessor: "designation",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Grade",
                accessor: "grade",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            // {
            //     Header: "Absent Days",
            //     accessor: "absentDays",
            //     filterable: true,
            //     Cell: (cellProps) => {
            //         return <UserEmail {...cellProps} />;
            //     },
            // },
            {
                Header: "Status",
                accessor: "activeStatus",
                disableFilters: true,
                filter: 'select',
                width: 200,
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />;
                },
            },
            {
                Header: "Payroll Status",
                accessor: "salStatus",
                disableFilters: true,
                filter: 'select',
                width: 200,
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />;
                },
            },
            {
                Header: "View Details",
                accessor: "id",
                disableFilters: true,
                Cell: (user) => {
                    return (
                        <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => toggleViewModal(user.row.original)}
                        >
                            View Details
                        </Button>
                    );
                },
            },
            {
                Header: "Action",
                accessor: "action",
                disableFilters: true,
                Cell: (usr) => {
                    return (
                        <div className="d-flex gap-3">
                            <Link
                                to={`${"/payroll"}/${usr.row.original.id}`}
                                className="text-success"
                            >
                                {/* <i className="mdi mdi-pencil font-size-18" id="edittooltip" /> */}
                                <FaEdit id="edittooltip" size={18} />
                                <UncontrolledTooltip placement="top" target="edittooltip">
                                    Edit
                                </UncontrolledTooltip>
                            </Link>

                        </div>
                    );
                },
            },
        ],
        []
    );



    useEffect(() => {
        getAllEmployee();
    }, [])


    //Authorization check
    useEffect(() => {
        authorization(62)
    }, [])



    // console.log(payrollList)

    return (
        <div className="page-content">
            <Container fluid>
                {/* Render Breadcrumb */}
                <Breadcrumb title="EmployeeList" breadcrumbItem="setup / EmployeeList" />
            </Container>

            {/* customization start from here  */}

            <React.Fragment>
                <PayRollDetailsModal
                    isOpen={modal}
                    toggle={handleModal}
                    empPayId={empPayId}
                />

                {/* <div className="page-content"> */}
                <div className="container-fluid">
                    {
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={payrollList?.reverse()}
                                            isGlobalFilter={true}
                                            isAddUserList={true}
                                            customPageSize={100}
                                            className="custom-header-css"
                                            hidden
                                            exbtn
                                            excelDownload={handleDownload}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        // :
                        // <div className="w-100 d-flex justify-content-center">
                        //     <div className="spinner-grow text-success  text-center"
                        //         style={{ width: '2.5rem', height: "2.5rem" }} role="status">
                        //     </div>
                        // </div>
                    }
                </div>
            </React.Fragment>

        </div>
    )
}

export default PayRollList