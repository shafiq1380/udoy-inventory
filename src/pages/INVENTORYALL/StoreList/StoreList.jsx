import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import TableContainer from '../../../components/Common/TableContainer';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { UserName, UserStatus } from '../../UserList/UserCol';
import { Post } from '../../../utils/https'
import StoreItemModal from './component/StoreItemModal';
import { authorization } from '../../../components/Common/Authorization';

const StoreList = () => {

    const [allStoreList, setAllStoreList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [updateStoreData, setUpdateStoreData] = useState({})


    const fetchAllStoreList = async () => {
        const response = await Post('/api/Product/GetAllStore')
            .then(res => setAllStoreList(res.data.data))
    }

    const handleStoreData = (data) => {
        setUpdateStoreData(data)
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
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Store Name",
                accessor: "storeCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Store Description",
                accessor: "storeDescription",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "status",
                disableFilters: true,
                width: 200,
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />;
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
                                onClick={() => handleStoreData(usr.row.original)}
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
        fetchAllStoreList()
    }, [showModal])


    //autohorization
    useEffect(() => {
        authorization(65)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Store List'} title={'Store List'} />
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>
                                <TableContainer
                                    columns={columns}
                                    data={allStoreList}
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
            </Container>

            <StoreItemModal
                show={showModal}
                handleModal={handleShowModal}
                isEdit={isEdit}
                updateData={updateStoreData}
            />
        </div>
    )
}

export default StoreList