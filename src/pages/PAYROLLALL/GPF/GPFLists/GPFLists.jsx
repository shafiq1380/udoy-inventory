import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap'
import Breadcrumbs from '../../../../components/Common/Breadcrumb'
import TableContainer from '../../../../components/Common/TableContainer'
import { UserID, UserName, DateFormate, AllowanceStatus } from '../../../UserList/UserCol'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authorization } from '../../../../components/Common/Authorization'
import { getPFTransactionByTypeRequest } from '../../../../store/pf-transaction/actions'
import { Post } from '../../../../utils/https'


const GPFLists = () => {


    const [transTypes, setTransTypes] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const transactionTypeList = async () => {
        const data = await Post('/api/v1/ProvidentFund/GetGPFTransactionTypeList', {})
            .then(res =>
                setTransTypes(res.data.data)
            );
    }


    useEffect(() => {
        dispatch(getPFTransactionByTypeRequest(1));
        transactionTypeList()
    }, [dispatch]);

    const { loading, pfTransactionByType, error } = useSelector(state => state.pfTransactionByTypeReducer);

    // console.log("pfTransactionByType", pfTransactionByType)

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
                Header: "Transaction Type",
                accessor: "transactioTypeID",
                filterable: true,
                Cell: (gpfList) => {
                    const matchedItem = transTypes.find(item => item.id === gpfList.row.original.transactioTypeID);

                    return (
                        <div>
                            {matchedItem ? matchedItem.transactionName : null}
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
                cutmFilter: 'select',
                disableFilters: true,
                width: 200,
                Cell: (cellProps) => {
                    return <AllowanceStatus {...cellProps} />;
                },
            },
            {
                Header: "View Details",
                accessor: "",
                disableFilters: true,
                Cell: (gpfList) => {
                    return (
                        <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => gpfView(gpfList.row.original)}
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
                Cell: (gpfList) => {

                    // console.log("gpfList", gpfList.row.original)

                    return (
                        <div className="d-flex gap-3">
                            {
                                gpfList.row.original.transactionStatus === 1 ?
                                    <a>
                                        <FaEdit
                                            id="edittooltip"
                                            size={18}
                                            className="text-success cursor-pointer"
                                            onClick={() => gpfEdit(gpfList.row.original)}
                                        />
                                        <UncontrolledTooltip placement="top" target="edittooltip">
                                            Edit
                                        </UncontrolledTooltip>
                                    </a>
                                    : null
                            }
                        </div>
                    );
                },
            },
        ],
        [transTypes]
    );

    const gpfCreate = () => {
        navigate('/gpf-create')
    };

    const gpfEdit = (gpfInfo) => {
        // console.log("gpfInfo", gpfInfo)
        navigate('/gpf-edit', { state: gpfInfo })
    };

    const gpfView = (gpfInfo) => {
        // console.log("gpfInfo", gpfInfo)
        navigate('/gpf-details', { state: gpfInfo })
    };

    useEffect(() => {
        authorization(107)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="GPF Transaction List" />
                <div className="container-fluid">
                    {
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={pfTransactionByType}
                                            isGlobalFilter={true}
                                            isAddUserList={true}
                                            customPageSize={100}
                                            className="custom-header-css"
                                            onClickBtn={gpfCreate}
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

export default GPFLists