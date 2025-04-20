import React, { useEffect, useMemo, useState } from 'react'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap'
import { MobileNumber, OpenStatus, UserEmail, UserStatus } from '../../UserList/UserCol'
import TableContainer from '../../../components/Common/TableContainer'
import { FaEdit } from 'react-icons/fa'
import PayCodeModal from './PayCodeModal'
import { authorization } from '../../../components/Common/Authorization'
import { Post } from '../../../utils/https'

const PayCodeSetup = () => {

    const [payCode, setPayCode] = useState([])
    const [showMdal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [updateData, setUpdateData] = useState({})



    const handleModal = () => {
        setIsEdit(false)
        setShowModal(!showMdal)
    }

    const handleEdit = (data) => {
        setUpdateData(data)
        setIsEdit(true)
        setShowModal(!showMdal)
    }


    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
                disableFilters: true,
                // filterable: true,
                width: 200,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "SL",
                accessor: "sl",
                disableFilters: true,
                // filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "For Type",
                accessor: "forType",
                filterable: true,
                filter: true,

                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "ForCode",
                accessor: "forCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "For Status",
                accessor: "forStatus",
                filterable: true,
                filter: true,
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />;
                },
            },
            {
                Header: "IsOpening ( ON / Off ) ",
                accessor: "isOpening",
                disableFilters: true,
                Cell: (cellProps) => {
                    return <OpenStatus {...cellProps} />;
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
                                onClick={() => handleEdit(usr.row.original)}
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


    const getPayCode = async () => {
        try {
            await Post('/api/Payroll/GetSalaryForCodeList')
                .then(res => {
                    if (res.data.success === true) {
                        setPayCode(res.data.data?.reverse())
                    }
                }
                )
        } catch (error) {

        }
    }


    useEffect(() => {
        getPayCode()
    }, [showMdal])


    useEffect(() => {
        authorization(105)
    }, [])



    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Pay Code Setup'} title={'Pay Code Setup'} />

                {
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        // data={[]}
                                        data={payCode}
                                        isGlobalFilter={true}
                                        isAddUserList={true}
                                        onClickBtn={handleModal}
                                        customPageSize={100}
                                        className="custom-header-css"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>

            <PayCodeModal
                show={showMdal}
                handleModal={handleModal}
                isEdit={isEdit}
                updateData={updateData}
            />
        </div>
    )
}

export default PayCodeSetup