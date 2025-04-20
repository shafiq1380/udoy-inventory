import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, Col, Container, Row, Spinner, UncontrolledTooltip } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { MobileNumber, UserEmail, UserID, UserName, UserStatus } from '../../UserList/UserCol'
import { FaEdit } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

import TableContainer from '../../../components/Common/TableContainer'
import { fetchAllItemList } from '../../../store/InventoryItemList/actions'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { authorization } from '../../../components/Common/Authorization'

const InventoryItemList = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { allItemList } = useSelector(state => state.AllItemList)

    useEffect(() => {
        dispatch(fetchAllItemList())
    }, [])

    // console.log('anup', allItemList)

    const columns = useMemo(
        () => [
            // {
            //     Header: "ID",
            //     accessor: "id",
            //     width: 200,
            //     filterable: true,
            //     Cell: (cellProps) => {
            //         return <UserID {...cellProps} />
            //     },
            // },
            {
                Header: "Group Name",
                accessor: "groupName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Item Code",
                accessor: "itemCode",
                disableFilters: false,
                width: 200,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Sub Group Name",
                accessor: "subGroupName",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "Item Desc",
                accessor: "itemDesc",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Item Display Name",
                accessor: "itemDisplayName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },

            // {
            //     Header: "Coa Code",
            //     accessor: "coaCode",
            //     disableFilters: true,
            //     width: 200,
            //     Cell: (cellProps) => {
            //         return <UserEmail {...cellProps} />;
            //     },
            // },

            {
                Header: "Itm Status",
                accessor: "itmStatus",
                disableFilters: true,
                width: 200,
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />;
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
                                to={`/inventoryiteminput/${usr.row.original.id}`}
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


    const handleClick = () => {
        navigate('/inventoryiteminput')
    }


    //authorization
    useEffect(() => {
        authorization(60)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Product'} title={'Product Setup'} />
                {
                    allItemList ?

                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={allItemList}
                                            isGlobalFilter={true}
                                            isAddUserList={true}
                                            onClickBtn={handleClick}
                                            customPageSize={100}
                                            className="custom-header-css"
                                            showbtn

                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row> :
                        <CustomSpinner />
                }
            </Container>
        </div>
    )
}

export default InventoryItemList