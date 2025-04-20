import React, { useEffect, useMemo, useState } from 'react'
import { authorization } from '../../../components/Common/Authorization'
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { Post } from '../../../utils/https'
import TableContainer from '../../../components/Common/TableContainer'
import { UserID, UserName, CustomStatus, DateFormate } from '../../UserList/UserCol'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const EmployeePayroll = () => {

    const [empPayroll, setEmppyroll] = useState([]);
    const navigate = useNavigate();

    const getAllEmployee = () => {
        Post('/api/Payroll/GatAllPayrollList')
            .then(res => {
                res.data.data
                setEmppyroll(res.data.data);
            })
    };

    const handleCreatePayroll = () => {
        navigate('/createypayroll')
    }

    // console.log(empPayroll)

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "Payroll Month",
                accessor: "salTitle",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "Voucher NO",
                accessor: "voucherID",
                filterable: true,
                // filter: 'select',
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Last Updated Date Time",
                accessor: "lastUpdateDate",
                filterable: true,
                // filter: 'select',
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "salStatus",
                disableFilters: true,
                cutmFilter: 'select',
                width: 200,
                Cell: (cellProps) => {
                    return <CustomStatus {...cellProps} />;
                },
            },
            {
                Header: "View Details",
                accessor: "Details",
                disableFilters: true,
                Cell: (user) => {
                    return (
                        <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => navigate(`/payrolldetails/${user.row.original.id}`)}
                        >
                            View Details
                        </Button>
                    );
                },
            },
        ],
        []
    );


    useEffect(() => {
        getAllEmployee();
    }, [])

    // console.log(empPayroll)


    // Authorization check
    useEffect(() => {
        authorization(70)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={' Transaction/Employee Payroll'} BreadcrumbTitle={'Transaction/Employee Payroll'} />


                <div className="container-fluid">
                    {
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={empPayroll?.reverse()}
                                            isGlobalFilter={true}
                                            isAddUserList={true}
                                            customPageSize={100}
                                            className="custom-header-css"
                                            onClickBtn={handleCreatePayroll}
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

            </Container>
        </div>
    )
}

export default EmployeePayroll