import React, { useState, useMemo, useEffect } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import TableContainer from '../../components/Common/TableContainer';
import { MobileNumber, UserName, OpenStatus, DateFormate, ActiveStatus, UserStatus } from '../UserList/UserCol';
import { FaEdit } from 'react-icons/fa'
import AccpartnerModal from './AccpartnerModal';
import { Post } from '../../utils/https';
import axios from 'axios';
import { authorization } from '../../components/Common/Authorization';



const AccpartnerTypes = () => {

    // document.title = "Accpartner Type Setup | SMART Accounting System";

    const [partnerAddModal, setpartnerAddModal] = useState(false);
    const [partnerEditModal, setpartnerEditModal] = useState(false);
    const [updatePartnertData, setupdatePartnertData] = useState({});

    const [accpartners, setAccpartnerTypes] = useState([])



    const columns = useMemo(
        () => [
            {
                Header: "Partner Type",
                accessor: "contractType",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Entry Date",
                accessor: "entryDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "Last Updated Date",
                accessor: "lastUpdateDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "Active Status",
                accessor: "rStatus",
                filter: 'select',
                width: 200,
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />;
                },
            },
            {
                Header: "Action",
                disableFilters: true,
                Cell: (period) => {
                    return (
                        <div className="d-flex gap-3">
                            <a
                                to="#"
                                className="text-success"
                                onClick={() => handleEdit(period.row.original)}
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

    const handlePeriodModal = () => {
        setpartnerAddModal(!partnerAddModal)
        setpartnerEditModal(false)
    };

    const handleEdit = (data) => {
        setupdatePartnertData(data)
        setpartnerEditModal(true)
        setpartnerAddModal(!partnerAddModal)
    };

    const getAllAccpartners = async () => {
        const data = {
            data: 0
        }
        try {
            await Post('/api/PartnerManagement/GetAllPartnerType', data)
                .then(res => setAccpartnerTypes(res.data.data))
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getAllAccpartners()
    }, [partnerAddModal])

    // console.log(accpartners)
    useEffect(() => {
        authorization(15)
    }, [])

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Configuration" breadcrumbItem="Partnet Type Setup" />
            </Container>

            <Container fluid>

                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <TableContainer
                                    columns={columns}
                                    data={accpartners && accpartners}
                                    customPageSize={10}
                                    className="custom-header-css"
                                    onClickBtn={handlePeriodModal}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

            </Container>

            <AccpartnerModal
                show={partnerAddModal}
                handleModal={handlePeriodModal}
                isEdit={partnerEditModal}
                updatePartnertData={updatePartnertData}
            />

        </div>
    )
}

export default AccpartnerTypes