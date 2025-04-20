import React, { useEffect, useMemo } from 'react'
import { Button, Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap'
import Breadcrumbs from '../../../../components/Common/Breadcrumb'
import TableContainer from '../../../../components/Common/TableContainer'
import { UserID, UserName, DateFormate, AllowanceStatus } from '../../../UserList/UserCol'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authorization } from '../../../../components/Common/Authorization'
import { getPFTransactionByTypeRequest } from '../../../../store/pf-transaction/actions'


const EmployeeLoanOpeningInterestLists = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPFTransactionByTypeRequest(3));
    }, [dispatch]);

    const { loading, pfTransactionByType, error } = useSelector(state => state.pfTransactionByTypeReducer);

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
                Header: "Date",
                accessor: "transactionDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "Title",
                accessor: "transactionTitle",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Voucher ID",
                accessor: "voucherID",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Voucher Type",
                accessor: "transactionType",
                filterable: true,
                Cell: (employeeLoanList) => {
                    return (
                        <div>
                            {
                                employeeLoanList.row.original.transactionType === 1 ? "Interest" :
                                    employeeLoanList.row.original.transactionType === 2 ? "Opening" :
                                        employeeLoanList.row.original.transactionType === 3 ? "Transaction" : null
                            }
                        </div>
                    );
                },
            },
            {
                Header: "Update Date",
                accessor: "updateDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "transactionStatus",
                filter: 'select',
                width: 200,
                Cell: (cellProps) => {
                    return <AllowanceStatus {...cellProps} />;
                },
            },
            {
                Header: "View Details",
                accessor: "",
                disableFilters: true,
                Cell: (employeeLoanList) => {
                    return (
                        <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => employeeLoanView(employeeLoanList.row.original)}
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
                Cell: (employeeLoanList) => {

                    // console.log("employeeLoanList", employeeLoanList.row.original)

                    return (
                        <div className="d-flex gap-3">
                            {
                                employeeLoanList.row.original.transactionStatus === 1 ?
                                    <>
                                        <FaEdit
                                            id="edittooltip"
                                            size={18}
                                            className="text-success cursor-pointer"
                                            onClick={() => employeeLoanEdit(employeeLoanList.row.original)}
                                        />
                                        <UncontrolledTooltip placement="top" target="edittooltip">
                                            Edit
                                        </UncontrolledTooltip>
                                    </>
                                    : null
                            }
                        </div>
                    );
                },
            },
        ],
        []
    );

    const employeeLoanCreate = () => {
        navigate('/employeeLoan-create')
    };

    const employeeLoanEdit = (employeeLoanInfo) => {
        // console.log("employeeLoanInfo", employeeLoanInfo)
        navigate('/employeeLoan-edit', { state: employeeLoanInfo })
    };

    const employeeLoanView = (employeeLoanInfo) => {
        // console.log("employeeLoanInfo", employeeLoanInfo)
        navigate('/employeeLoan-details', { state: employeeLoanInfo })
    };

    useEffect(() => {
        authorization(109)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Employee Loan Opening/Interest" />
                <div className="container-fluid">
                    {
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={pfTransactionByType.reverse()}
                                            isGlobalFilter={true}
                                            isAddUserList={true}
                                            customPageSize={100}
                                            className="custom-header-css"
                                            onClickBtn={employeeLoanCreate}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    }
                </div>

            </Container>
        </div>
    )
}

export default EmployeeLoanOpeningInterestLists;