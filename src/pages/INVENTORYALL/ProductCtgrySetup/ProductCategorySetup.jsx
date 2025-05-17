import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import TableContainer from '../../../components/Common/TableContainer'
import { MobileNumber, UserEmail } from '../../UserList/UserCol'
import { FaEdit } from 'react-icons/fa'
import { Post } from '../../../utils/https'
import ProductCtgModal from './ProductCtgModal'
import { authorization } from '../../../components/Common/Authorization'

const ProductCategorySetup = () => {

    const [productCtg, setProductCtg] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [updatePrdCtgData, setUpdatePrdCtgData] = useState({})

    const getProductCtg = async () => {
        try {
            await Post('/api/v1/Product/GetAllItemCategory')
                .then(res => setProductCtg(res.data.data))
        } catch (error) {

        }
    }



    const handleUomData = (data) => {
        setUpdatePrdCtgData(data)
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
                // disableFilters: true,
                filterable: true,
                width: 200,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Category Name",
                accessor: "categoryName",
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
        getProductCtg()
    }, [showModal])

    //authorization
    useEffect(() => {
        authorization(69)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Product Category Setup'} title={'Product Category Setup'} />
                {
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        data={productCtg?.reverse() || []}
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

            <ProductCtgModal
                show={showModal}
                handleModal={handleShowModal}
                isEdit={isEdit}
                updateData={updatePrdCtgData}
            />
        </div>
    )
}

export default ProductCategorySetup