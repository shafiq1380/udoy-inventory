import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import TableContainer from '../../../components/Common/TableContainer'
import { MobileNumber, UserEmail } from '../../UserList/UserCol'
import { Post } from '../../../utils/https'
import { FaEdit } from 'react-icons/fa'
import UomModal from './UomModal'
import { authorization } from '../../../components/Common/Authorization'

const UOMSetup = () => {


    const [uomList, setUomList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [updateUomData, setUpdateUomData] = useState({})

    const getAllUom = async () => {
        try {
            await Post('/api/Product/GetAllItemUom')
                .then(res => setUomList(res.data.data))
        } catch (error) {

        }
    }

    const handleUomData = (data) => {
        setUpdateUomData(data)
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
                Header: "Uom Desc",
                accessor: "uomDesc",
                // disableFilters: true,
                filterable: true,
                width: 200,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Uom Code",
                accessor: "uomCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
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
                                onClick={() => handleUomData(usr.row.original)}
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
        getAllUom()
    }, [showModal])

    //authorization
    useEffect(() => {
        authorization(68)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Uom Setup'} title={'Uom Setup'} />
                {
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        data={uomList?.reverse()}
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
            </Container>

            <UomModal
                show={showModal}
                handleModal={handleShowModal}
                isEdit={isEdit}
                updateData={updateUomData}
            />
        </div>
    )
}

export default UOMSetup