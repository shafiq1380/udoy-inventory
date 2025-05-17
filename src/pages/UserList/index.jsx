import { Link } from "react-router-dom";
import { Container, CardTitle } from 'reactstrap'

import { addFailer, fetchUsersRequest } from "../../store/users-list/actions";

// customization start from Here...

import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";

//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ResponseModal from "../../components/Common/ResponseModal";

import {
    getOrders as onGetOrders,
    addNewOrder as onAddNewOrder,
    updateOrder as onUpdateOrder,
    deleteOrder as onDeleteOrder,
} from "/src/store/actions";

import { UserID, UserName, UserEmail, MobileNumber, UserStatus, } from "./UserCol";

//redux
import { useSelector, useDispatch } from "react-redux";
import UserDetailsModal from "./UserDetailsModal";

import {
    Button,
    Col,
    Row,
    UncontrolledTooltip,
    Form,
    Label,
    Card,
    CardBody,
} from "reactstrap";
import InputFieldModal from "../../components/InputFieldModal/InputFieldModal";
import { Post } from "../../utils/https";
import { FaEdit } from "react-icons/fa";
import { authorization } from "../../components/Common/Authorization";


const UserList = () => {

    //meta title
    // document.title = "User List | SMART Accounting System";

    const { users, loading, reload } = useSelector(state => state.usersReducer);

    const dispatch = useDispatch();


    //update Table
    const updateTble = () => {
        dispatch(fetchUsersRequest());
    }

    // const reloadPage = () => {
    //     setReload(!reload)
    // }

    // customization start from here

    const [modal, setModal] = useState(false);
    const [EmDtlsModal, setEmDtlsModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [order, setOrder] = useState(null);

    const [user, setUser] = useState({})
    const [userLoading, setUserLoading] = useState(false)


    //view Derails Modal 
    // const toggleViewModal = async (usr) => {
    //     setUserLoading(true)
    //     const user = await Post('/api/v1/UserManagement/GetLoginInformationByCode', { data: usr.userID })
    //         .then(res => {
    //             // res.data.data
    //             if (res) {
    //                 setUser(res.data.data)
    //                 setEmDtlsModal(!EmDtlsModal);
    //                 setUserLoading(false)
    //             }
    //         }
    //         )
    //     // setUser(user)
    //     // if (user) {
    //     //     setEmDtlsModal(!EmDtlsModal);
    //     // }
    //     // setEmDtlsModal(!EmDtlsModal);
    // }


    const toggle = () => {
        if (modal) {
            setModal(false);
            setOrder(null);
        } else {
            setModal(true);
        }
        dispatch(addFailer(''))
    };


    //delete order
    const [deleteModal, setdeleteModal] = useState(false);

    const onClickDelete = (order) => {
        // setOrder(order);
        setdeleteModal(true);
    };

    const handleDeleteOrder = () => {
        if (order && order.id) {
            dispatch(onDeleteOrder(order.id));
            setdeleteModal(false);
            setOrder("");
        }
    };

    const handleUserInfo = () => {
        setIsEdit(false);
        setUser()
        toggle();
    };

    const handelUpdateUser = (usr) => {
        setIsEdit(true)
        setUser(usr)
        toggle()
    }


    const columns = useMemo(
        () => [
            {
                Header: "User-ID",
                accessor: "userID",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "User Name",
                accessor: "userName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "User Mobile",
                accessor: "userMobile",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "User Email",
                accessor: "userEmail",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "userLoginStatus",
                disableFilters: true,
                width: 200,
                filter: 'select',
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />;
                },
            },
            {
                Header: "View Details",
                accessor: "empCode",
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
                                to="#"
                                className="text-success"
                                onClick={() => {
                                    handelUpdateUser(usr.row.original)
                                }}
                            >
                                {/* <i className="mdi mdi-pencil font-size-18" id="edittooltip" /> */}
                                <FaEdit id="edittooltip" size={18} />
                                <UncontrolledTooltip placement="top" target="edittooltip">
                                    Edit
                                </UncontrolledTooltip>
                            </Link>
                            {/* <Link
                                to="#"
                                className="text-danger"
                                onClick={() => {
                                    // const orderData = cellProps.row.original;
                                    onClickDelete();
                                }}
                            >
                                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                <UncontrolledTooltip placement="top" target="deletetooltip">
                                    Delete
                                </UncontrolledTooltip>
                            </Link> */}
                        </div>
                    );
                },
            },
        ],
        []
    );


    useEffect(() => {
        updateTble()
        setModal(false)
    }, [reload])


    //Authorization check
    useEffect(() => {
        authorization(46)
    }, [])


    return (
        <div className="page-content">
            <Container fluid>
                {/* Render Breadcrumb */}
                <Breadcrumbs title="Configuration" breadcrumbItem="User Management / User List" />
            </Container>

            {/* customization start from here  */}

            <React.Fragment>
                <UserDetailsModal
                    isOpen={EmDtlsModal}
                    toggle={toggleViewModal}
                    user={user}
                />
                <ResponseModal
                    show={deleteModal}
                    onCloseClick={() => setdeleteModal(false)}
                    // errorMsg={msg}
                    msg={'Want To Delete Item'}
                />

                {/* <div className="page-content"> */}
                <div className="container-fluid">
                    {
                        !loading ?
                            <Row>
                                <Col xs="12">
                                    <Card>
                                        <CardBody>
                                            <TableContainer
                                                columns={columns}
                                                data={users.reverse()}
                                                isGlobalFilter={true}
                                                isAddUserList={true}
                                                onClickBtn={handleUserInfo}
                                                customPageSize={100}
                                                className="custom-header-css"
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            :
                            <div className="w-100 d-flex justify-content-center">
                                <div className="spinner-grow text-success  text-center"
                                    style={{ width: '2.5rem', height: "2.5rem" }} role="status">
                                </div>
                            </div>
                    }

                    {/* Edit and add user Modal */}
                    <InputFieldModal
                        modal={modal}
                        toggle={toggle}
                        title={!!isEdit ? "Update User Information" : "Add New User"}
                        user={user}
                        isEdit={isEdit}
                    />

                </div>
                {/* </div> */}
            </React.Fragment>

        </div>
    )
}

export default UserList