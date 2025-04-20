import React, { useState, useMemo, useEffect } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import TableContainer from '../../components/Common/TableContainer';
import { MobileNumber, DateFormate, OpenStatus } from '../UserList/UserCol';
import { FaEdit } from 'react-icons/fa'
import PeriodModal from './PeriodModal';
import { Post } from '../../utils/https';
import axios from 'axios';



const PeriodSetup = () => {

    // document.title = "Period Setup | SMART Accounting System";

    const [periodAddModal, setPeriodAddModal] = useState(false);
    const [periodEditModal, setPeriodEditModal] = useState(false);
    const [updatePeriodData, setUpdatePeriodData] = useState({});

    const [periods, setPeriods] = useState([])



    const columns = useMemo(
        () => [
            {
                Header: "Start Date",
                accessor: "prdStartDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "End Date",
                accessor: "prdEndDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "Period Name",
                accessor: "prdTitle",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "Open Status",
                accessor: "prdStatus",
                filter: 'select',
                width: 200,
                Cell: (cellProps) => {
                    return <OpenStatus {...cellProps} />;
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
        setPeriodAddModal(!periodAddModal)
        setPeriodEditModal(false)
    };

    const handleEdit = (data) => {
        setUpdatePeriodData(data)
        setPeriodEditModal(true)
        setPeriodAddModal(!periodAddModal)
    };

    const getAllPeriod = async () => {
        const data = {
            data: 0
        }
        try {
            await Post('/api/VoucherEntry/GetAllPeriodList', data)
                .then(res => setPeriods(res.data.data))
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getAllPeriod()
    }, [periodAddModal])


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Configuration" breadcrumbItem="Period Setup" />
            </Container>

            <Container fluid>

                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <TableContainer
                                    columns={columns}
                                    data={periods && periods.reverse()}
                                    customPageSize={100}
                                    className="custom-header-css"
                                    onClickBtn={handlePeriodModal}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

            </Container>

            <PeriodModal
                show={periodAddModal}
                handleModal={handlePeriodModal}
                isEdit={periodEditModal}
                updatePeriodData={updatePeriodData}
            />

        </div>
    )
}

export default PeriodSetup