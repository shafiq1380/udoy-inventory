import React, { useState, useMemo, useEffect } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import TableContainer from '../../components/Common/TableContainer';
import { UserName, UserStatus } from '../UserList/UserCol';
import { FaEdit } from 'react-icons/fa'
import VouchersTpeSetupModal from './VoucherTypeSetupModal';
import { Post } from '../../utils/https';
import axios from 'axios';
import { authorization } from '../../components/Common/Authorization';



const VouchersTpeSetup = () => {

    // document.title = "Voucher Type Setup  Setup | SMART Accounting System";

    const [periodAddModal, setPeriodAddModal] = useState(false);
    const [periodEditModal, setPeriodEditModal] = useState(false);
    const [updateVoucherTypeData, setUpdateVoucherTypeData] = useState({});

    const [vouchersType, setVoucherType] = useState([])



    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Voucher Type",
                accessor: "jrnType",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Description",
                accessor: "jrnDescription",
                ffilterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Active Status",
                accessor: "activeStatus",
                filter: true,
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
        setPeriodAddModal(!periodAddModal)
        setPeriodEditModal(false)
    };

    const handleEdit = (data) => {
        setUpdateVoucherTypeData(data)
        setPeriodEditModal(true)
        setPeriodAddModal(!periodAddModal)
    };

    const getAllVoucherType = async () => {
        const data = {
            data: 0
        }
        try {
            await Post('/api/VoucherType/GetAllVoucherTypeSetup', data)
                .then(res => setVoucherType(res.data.data))
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getAllVoucherType()
    }, [periodAddModal])

    // console.log(vouchersType)

    //Authorization check
    useEffect(() => {
        authorization(10)
    }, [])

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Configuration" breadcrumbItem="Voucher Type Setup" />
            </Container>

            <Container fluid>

                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <TableContainer
                                    columns={columns}
                                    data={vouchersType && vouchersType}
                                    customPageSize={10}
                                    className="custom-header-css"
                                    onClickBtn={handlePeriodModal}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

            </Container>

            <VouchersTpeSetupModal
                show={periodAddModal}
                handleModal={handlePeriodModal}
                isEdit={periodEditModal}
                updateVoucherTypeData={updateVoucherTypeData}
            />

        </div>
    )
}

export default VouchersTpeSetup