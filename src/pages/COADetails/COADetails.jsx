import React, { useMemo, useState } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Button, Card, CardBody, CardHeader, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import TableContainer from '../../components/Common/TableContainer';
import { UserName } from '../UserList/UserCol';
import { FaEdit } from 'react-icons/fa'
import { IoMdSettings } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import COAAddEditModal from './COAAddEditModal';
import COAViewModal from './COAViewModal';




const COADetails = () => {

    // document.title = "COA Details | SMART Accounting System";

    const { state } = useLocation();
    const history = useNavigate();

    const [coaDetailsData, setCoaDetailsData] = useState([
        {
            sn: 1,
            title: "Sales",
            trnType: "(D-C) +VE",
            remarks: "Sales",
            total: 5
        },
        {
            sn: 2,
            title: "Less: Vat",
            trnType: "D-C",
            remarks: "Less: Vat",
            total: 8
        },
    ]);

    const [coaAddModal, setCoaAddModal] = useState(false);
    const [coaEditModal, setCoaEditModal] = useState(false);
    const [updateCoaData, setUpdateCoaData] = useState({});
    const [coaViewModal, setCoaViewModal] = useState(false);

    const columns = useMemo(
        () => [
            {
                Header: "S/N",
                accessor: "sn",
                disableFilters: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Title",
                accessor: "title",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "TRN Type",
                accessor: "trnType",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Remarks",
                accessor: "remarks",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Total",
                accessor: "total",
                disableFilters: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Action",
                disableFilters: true,
                Cell: (coa) => {
                    return (
                        <div className="d-flex gap-3">
                            <a to="#" onClick={() => handleCOAEditModal(coa.row.original)}>
                                <FaEdit id="edit" size={20} color="green" role="button" />
                                <UncontrolledTooltip placement="top" target="edit">
                                    Edit
                                </UncontrolledTooltip>
                            </a>
                            <a to="#" onClick={() => handleCOAViewModal(coa.row.original)}>
                                <FaEye id="view" size={25} color="green" role="button" />
                                <UncontrolledTooltip placement="top" target="view">
                                    View
                                </UncontrolledTooltip>
                            </a>
                            <a to="#">
                                <IoMdSettings id="settings" size={25} color="green" role="button" />
                                <UncontrolledTooltip placement="top" target="settings">
                                    Setup
                                </UncontrolledTooltip>
                            </a>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const handleCOAAddModal = () => {
        setCoaAddModal(!coaAddModal);
        setCoaEditModal(false);
    };

    const handleCOAEditModal = (data) => {
        setUpdateCoaData(data);
        setCoaEditModal(true);
        setCoaAddModal(!coaAddModal);
    };

    const handleCOAViewModal = () => {
        setCoaViewModal(!coaViewModal);
    };


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="SETUP" breadcrumbItem="COA / COA Details" />
            </Container>

            <Container fluid>
                <Card>
                    <CardBody>
                        <Button
                            type="button"
                            color="success"
                            className="btn-rounded px-3 mb-3"
                            onClick={() => history(-1)}
                        >
                            <IoMdArrowRoundBack size={20} color='white' />
                        </Button>
                        <CardHeader>
                            <h3 className="text-center text-uppercase">COA Details Screen for - <span className='text-success'>{state && state.coaName}</span> </h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <TableContainer
                                    columns={columns}
                                    data={coaDetailsData.reverse()}
                                    customPageSize={10}
                                    className="custom-header-css"
                                    onClickBtn={handleCOAAddModal}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>

            {/* COA Add & Edit Modal */}
            <COAAddEditModal
                show={coaAddModal}
                handleModal={handleCOAAddModal}
                isEdit={coaEditModal}
                updateCoaData={updateCoaData}
            />

            {/* COA View Modal */}
            <COAViewModal
                show={coaViewModal}
                handleModal={handleCOAViewModal}
            />

        </div>
    )
};

export default COADetails;