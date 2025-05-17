import React, { useEffect, useMemo, useState } from 'react'
import Breadcrumb from '../../components/Common/Breadcrumb'
import { Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import TableContainer from '../../components/Common/TableContainer'
import { UserID, UserName } from '../UserList/UserCol'
import { Link } from 'react-router-dom'
import UserRoleModal from './component/UserRoleModal'
import { Post } from '../../utils/https'
import CustomSpinner from '../../components/Common/CustomSpinner'
import { FaEdit } from 'react-icons/fa'
import { authorization } from '../../components/Common/Authorization'
import { useSelector } from 'react-redux'


const UserRoleSetup = () => {


    const [userRoles, setUserRoles] = useState()
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [updatData, setUpdateData] = useState({})
    const [reload, setReload] = useState(false)


    const toggleModal = () => {
        setShowModal(!showModal);
        setIsEdit(false)
    };


    //update the Role Permission
    const handleUpdate = (item) => {
        setUpdateData(item)
        toggleModal()
        setIsEdit(true)
    }

    const getAllRole = async () => {
        const response = await Post('/api/v1/UserManagement/GetAllRole')
            .then(role => setUserRoles(role.data.data))
    }


    const reloadPage = () => {
        setReload(!reload)
    }


    const columns = useMemo(
        () => [
            // {
            //     Header: "User-ID",
            //     accessor: "id",
            //     width: 150,
            //     filterable: true,
            //     Cell: (cellProps) => {
            //         return <UserID {...cellProps} />
            //     },
            // },
            {
                Header: "User Role Name",
                accessor: "roleName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Action",
                accessor: "action",
                disableFilters: true,
                Cell: (menuItem) => {
                    return (
                        <div className="d-flex gap-3">
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => {
                                    handleUpdate(menuItem.row.original)
                                }}
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
        getAllRole()
    }, [reload])

    //Authorization check
    useEffect(() => {
        authorization(48)
    }, [])

    return (
        <div className='page-content'>
            <Breadcrumb title={'User Role Setup'} breadcrumbItem={'User  Role Setup'} />

            <Row>
                <Col xs="12">
                    {
                        userRoles ?
                            <Card>
                                <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        data={userRoles}
                                        isGlobalFilter={true}
                                        isAddUserList={true}
                                        onClickBtn={toggleModal}
                                        customPageSize={100}
                                        className="custom-header-css"
                                    />
                                </CardBody>
                            </Card>
                            :
                            <CustomSpinner />
                    }
                </Col>
            </Row>

            <UserRoleModal
                showModal={showModal}
                toggleModal={toggleModal}
                isEdit={isEdit}
                updatData={updatData}
                reloadPage={reloadPage}
            />

        </div>
    )
}

export default UserRoleSetup