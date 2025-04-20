import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row, UncontrolledTooltip } from 'reactstrap'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainer';
import { UserName } from '../UserList/UserCol';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Post } from '../../utils/https';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersRequest } from '../../store/users-list/actions';


const VoucherPermissions = () => {

    // document.title = "Voucher Permission | SMART Accounting System";

    const { users } = useSelector(state => state.usersReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    // const handlePermission = (data) =>
    //     // console.log(id.empCode)
    //     navigate(`/edit-voucher-permission/${data.empCode}`);
    // ;

    const handlePermission = (data) => {
        navigate(`/edit-voucher-permission/${data.empCode}`);
    };

    const columns = useMemo(
        () => [
            {
                Header: "User Code",
                accessor: "empCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "User Name", // Updated header name for clarity
                accessor: "userName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "User Designation",
                accessor: "userDesignation",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "User Department",
                accessor: "userDepartment",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Permission",
                disableFilters: true,
                Cell: (coa) => {
                    return (
                        <div className="d-flex gap-3">
                            <a
                                to="#" // Changed to href for accessibility
                                className="text-success fw-bolder font-size-16"
                                onClick={() => handlePermission(coa.row.original)}
                            >
                                Edit Permission
                            </a>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const getUserList = () => {
        dispatch(fetchUsersRequest());
    };

    useEffect(() => {
        getUserList();
    }, []);

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Configuration" breadcrumbItem="Voucher Permission" />
            </Container>

            <Container fluid>
                <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center text-uppercase">User Information for Voucher Permission</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <TableContainer
                                    columns={columns}
                                    data={users && users.filter(user => user.userLoginStatus === 1).reverse()}
                                    customPageSize={100}
                                    className="custom-header-css"
                                    hidden
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

            </Container>

        </div>
    )
}

export default VoucherPermissions