import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import DepartmentModal from './DepartmentModal';
import { Post } from '../../../utils/https';

import { FaEdit } from 'react-icons/fa'
import TableContainer from '../../../components/Common/TableContainer';
import { ExpensesType, UserEmail, UserStatus } from '../../UserList/UserCol';
import { authorization } from '../../../components/Common/Authorization';


const DepartmentSetup = () => {

    // document.title = "All Employee List | SMART Accounting System";


    const [departmentList, setDepartmentList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [updateDepartment, setupdateDepartment] = useState({})

    const getDepartment = async () => {
        try {
            await Post('/api/v1/EmployeeManagement/GetAllDepartment')
                .then(res => setDepartmentList(res.data.data))
        } catch (error) {

        }
    }

    const handleDepartment = (data) => {
        setupdateDepartment(data)
        setIsEdit(true)
        setShowModal(!showModal)
    }

    const handleShowModal = () => {
        setShowModal(!showModal)
        setIsEdit(false)
    }

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Department Name",
                accessor: "departmentName",
                // disableFilters: true,
                filterable: true,
                width: 200,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Expense Type",
                accessor: "deptExpType",
                filterable: true,
                width: 200,
                Cell: (cellProps) => {
                    return <ExpensesType {...cellProps} />;
                },
            },
            {
                Header: "Active Status",
                accessor: "deptStatus",
                filterable: true,
                filter: true,
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
                            <a
                                to="#"
                                className="text-success"
                                onClick={() => handleDepartment(usr.row.original)}
                            >
                                <FaEdit id="edittooltip" size={18} />
                                <UncontrolledTooltip placement="top" target="edittooltip">
                                    Edit
                                </UncontrolledTooltip>
                            </a>
                        </div>
                    );
                },
            },
        ],
        []
    );


    useEffect(() => {
        getDepartment()
    }, [showModal])

    //authorization
    useEffect(() => {
        authorization(74)
    }, [])


    return (
        <div className="page-content">
            <Container fluid>
                {/* Render Breadcrumb */}
                <Breadcrumb title="Department Setup" breadcrumbItem="Setup / Department" />

                {
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        data={departmentList?.reverse()}
                                        isGlobalFilter={true}
                                        isAddUserList={true}
                                        onClickBtn={handleShowModal}
                                        customPageSize={100}
                                        className="custom-header-css"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                }

                <DepartmentModal
                    show={showModal}
                    handleModal={handleShowModal}
                    isEdit={isEdit}
                    updateData={updateDepartment}
                />

            </Container>
        </div >
    )
}

export default DepartmentSetup