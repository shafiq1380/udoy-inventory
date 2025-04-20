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


const CPFLists = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPFTransactionByTypeRequest(2));
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
                Cell: (cpfList) => {
                    return (
                        <div>
                            {
                                cpfList.row.original.transactionType === 1 ? "Interest" :
                                    cpfList.row.original.transactionType === 2 ? "Opening" :
                                        cpfList.row.original.transactionType === 3 ? "Transaction" : null
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
                Cell: (cpfList) => {
                    return (
                        <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => cpfView(cpfList.row.original)}
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
                Cell: (cpfList) => {

                    // console.log("cpfList", cpfList.row.original)

                    return (
                        <div className="d-flex gap-3">
                            {
                                cpfList.row.original.transactionStatus === 1 ?
                                    <>
                                        <FaEdit
                                            id="edittooltip"
                                            size={18}
                                            className="text-success cursor-pointer"
                                            onClick={() => cpfEdit(cpfList.row.original)}
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

    const cpfCreate = () => {
        navigate('/cpf-create')
    };

    const cpfEdit = (cpfInfo) => {
        // console.log("cpfInfo", cpfInfo)
        navigate('/cpf-edit', { state: cpfInfo })
    };

    const cpfView = (cpfInfo) => {
        // console.log("cpfInfo", cpfInfo)
        navigate('/cpf-details', { state: cpfInfo })
    };

    useEffect(() => {
        authorization(108)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="CPF Opening and Interest" />
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
                                            onClickBtn={cpfCreate}
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

export default CPFLists