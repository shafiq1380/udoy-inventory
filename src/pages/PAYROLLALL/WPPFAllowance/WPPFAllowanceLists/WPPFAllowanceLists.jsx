import React, { useEffect, useMemo } from 'react'
import { Button, Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrumbs from '../../../../components/Common/Breadcrumb'
import TableContainer from '../../../../components/Common/TableContainer'
import { AllowanceStatus, DateFormate, UserID, UserName } from '../../../UserList/UserCol'
import { fetchAllowanceListsByTypeRequest } from '../../../../store/allowance-types-store/actions'
import { authorization } from '../../../../components/Common/Authorization'


const WPPFAllowanceLists = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllowanceListsByTypeRequest(5));
    }, [dispatch]);

    const { loading, allowanceListsByType, error } = useSelector(state => state.allowanceListsByTypeReducer);
    // console.log("allowanceListsByType", allowanceListsByType)

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
                accessor: "allowDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "Title",
                accessor: "allowTitle",
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
                Header: "Update Date",
                accessor: "updateDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "allowStatus",
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
                Cell: (wppfInfo) => {
                    return (
                        <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => viewWPPFAllowance(wppfInfo.row.original)}
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
                Cell: (wppfInfo) => {

                    return (
                        <div className="d-flex gap-3">
                            {
                                wppfInfo.row.original.allowStatus === 1 ?
                                    <>
                                        <FaEdit
                                            id="edittooltip"
                                            size={18}
                                            className="text-success cursor-pointer"
                                            onClick={() => editWPPFAllowance(wppfInfo.row.original)}
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

    const createWPPFAllowance = () => {
        navigate('/create-wppf-allowance')
    };

    const editWPPFAllowance = (wppfInfo) => {
        navigate('/edit-wppf-allowance', { state: wppfInfo })
    };

    const viewWPPFAllowance = (wppfInfo) => {
        navigate('/details-wppf-allowance', { state: wppfInfo })
    };

    useEffect(() => {
        authorization(98)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="WPPF Allowance" />
                <div className="container-fluid">
                    {
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={allowanceListsByType.reverse()}
                                            isGlobalFilter={true}
                                            isAddUserList={true}
                                            customPageSize={100}
                                            className="custom-header-css"
                                            onClickBtn={createWPPFAllowance}
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

export default WPPFAllowanceLists;