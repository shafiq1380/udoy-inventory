import { Link } from "react-router-dom";
import { Container, CardTitle } from 'reactstrap'

import { fetchAnalTypeFailure, fetchAnalTypeRequest } from "../../store/analysis-type-setup/actions";
import { FaEdit } from "react-icons/fa";

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

import { ID, AnalysisName, AnalysisStatus, } from "./AnalysisTypeCols";

//redux
import { useSelector, useDispatch } from "react-redux";
import AnalTypeDetailsModal from "./AnalTypeDetailsModal";

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
import InputFieldAnalTypeModal from "../../components/InputFieldModal/InputFieldAnalTypeModal";
import { authorization } from "../../components/Common/Authorization";


const AnalysisTypeSetup = () => {

    //meta title
    // document.title = "Coa Analysis | SMART Accounting System";

    const { anals, loading, error, reload } = useSelector(state => state.analtypeReducer);



    const dispatch = useDispatch();

    //const [active, setActive] = useState(1)
    //   const [reload, setReload] = useState(false)

    // const handleValueChange = (e) => {
    //     const value = e.target.value
    //     setActive(value)

    //     dispatch(fetchAnalTypeRequest(value));
    // }

    //update Table
    const updateTble = () => {
        // console.log(active)
        dispatch(fetchAnalTypeRequest());
    }


    const [modal, setModal] = useState(false);
    const [EmDtlsModal, setEmDtlsModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    //const [order, setOrder] = useState(null);

    const [analdata, setanaldata] = useState({})


    //view Derails Modal 
    const toggleViewModal = (ana) => {
        setanaldata(ana)
        setEmDtlsModal(!EmDtlsModal);
    }

    const toggle = () => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
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

    const handleAnalInfo = () => {
        setIsEdit(false);
        setanaldata()
        // toggle();
        setModal(true)
    };

    const onCloseClick = () => {
        setModal(false)
        dispatch(fetchAnalTypeFailure(null))
    }

    const handelUpdateAnal = (anal) => {
        //alert(anal.id)
        setIsEdit(true)
        setanaldata(anal)
        // toggle()
        setModal(true);
    }


    const columns = useMemo(
        () => [
            {
                Header: "Analysis ID",
                accessor: "id",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <ID {...cellProps} />
                },
            },
            {
                Header: "Bank Code Status",
                accessor: "codeBankStatus",
                // filterable: false,
                show: false,
                Cell: (cellProps) => {
                    // console.log(typeof (cellProps.value))
                    if (cellProps?.value === 1) {
                        return "Code Bank";
                    }
                    else {
                        return "Local Entry"
                    }
                },

            },
            {
                Header: "Analysis Name",
                accessor: "analysisTypeName",
                filterable: true,
                // filter: 'select',
                Cell: (cellProps) => {
                    return <AnalysisName {...cellProps} />
                },
            },

            {
                Header: "View Details",
                //    accessor: "id",
                disableFilters: true,
                Cell: (analdata) => {
                    return (
                        // <Button
                        //     type="button"
                        //     color="primary"
                        //     className="btn-sm btn-rounded"
                        //     onClick={() => toggleViewModal(analdata.row.original)}
                        // >
                        //     View Details
                        // </Button>
                        <Link to={`/analysis-details/${analdata.row.original.id}`}>
                            <Button
                                type="button"
                                color="primary"
                                className="btn-sm btn-rounded"
                            >
                                View Details
                            </Button>
                        </Link >
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
                                    handelUpdateAnal(usr.row.original)
                                    //console.log(usr.row.original)
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


    //Authorization check
    useEffect(() => {
        authorization(14)
    }, [])

    useEffect(() => {
        updateTble()
        onCloseClick()
    }, [reload])


    return (
        <div className="page-content">
            <Container fluid>
                {/* Render Breadcrumb */}
                <Breadcrumbs title="Setup" breadcrumbItem="Analysis / Analysis Type Setup" />

            </Container>

            {/* customization start from here  */}

            <React.Fragment>
                <AnalTypeDetailsModal
                    isOpen={EmDtlsModal}
                    toggle={toggleViewModal}
                    analType={analdata}
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
                                                data={anals}
                                                isGlobalFilter={true}
                                                isAddUserList={true}
                                                onClickBtn={handleAnalInfo}
                                                customPageSize={100}
                                                className="custom-header-css"
                                                showbtn
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

                    {/* Edit and add anal Modal */}
                    <InputFieldAnalTypeModal
                        modal={modal}
                        // toggle={toggle}
                        title={!!isEdit ? "Update Analysis" : "Add New Analysis"}
                        anal={analdata}
                        isEdit={isEdit}
                        onCloseClick={onCloseClick}
                    // reloadPage={reloadPage}
                    />

                </div>
                {/* </div> */}
            </React.Fragment>

        </div>
    )
}

export default AnalysisTypeSetup