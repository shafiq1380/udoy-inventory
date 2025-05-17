import React, { useState, useMemo, useEffect } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, CardHeader, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import TableContainer from '../../components/Common/TableContainer';
import { UserName } from '../UserList/UserCol';
import { FaEdit } from 'react-icons/fa';
import UsersAddEditModal from './UsersAddEditModal';
import axios from 'axios';
import { Post } from '../../utils/https';


const UsersNodeSetup = () => {

    // document.title = "COA Details | SMART Accounting System";

    const [nodeList, setNodeList] = useState([]);

    const [nodeAddModal, setNodeAddModal] = useState(false);
    const [nodeEditModal, setNodeEditModal] = useState(false);
    const [updateNodeData, setUpdateNodeData] = useState({});


    const columns = useMemo(
        () => [
            {
                Header: "Node ID",
                accessor: "nodeID",
                disableFilters: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Module",
                accessor: "moduleName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Node Type",
                accessor: "nodeTypeID",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Node Type Name",
                accessor: "nodeTypeName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Node Order",
                accessor: "nodeOrder",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Node Name",
                accessor: "nodeName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Action",
                disableFilters: true,
                Cell: (node) => {
                    return (
                        <div className="d-flex gap-3">
                            <a to="#" onClick={() => handleNodeEditModal(node.row.original)}>
                                <FaEdit id="edit" size={20} color="green" role="button" />
                                <UncontrolledTooltip placement="top" target="edit">
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

    const handleNodeAddModal = () => {
        setNodeAddModal(!nodeAddModal);
        setNodeEditModal(false);
    };

    const handleNodeEditModal = (data) => {
        setUpdateNodeData(data);
        setNodeEditModal(true);
        setNodeAddModal(!nodeAddModal);
    };

    const getAllNodeList = async () => {
        const data = {
            data: 0
        }
        try {
            await Post('/api/v1/UserManagement/GetAllNodeList', data)
                .then(res => setNodeList(res.data.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllNodeList();
    }, [nodeAddModal])

    // console.log(nodeList)

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="CONFIGURATION" breadcrumbItem="User Management / User Node Setup" />
            </Container>

            <Container fluid>
                <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center text-uppercase">User Node List Screen</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <TableContainer
                                    columns={columns}
                                    data={nodeList}
                                    customPageSize={100}
                                    className="custom-header-css"
                                    onClickBtn={handleNodeAddModal}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>

            {/* User Node Add & Edit Modal */}

            <UsersAddEditModal
                show={nodeAddModal}
                handleModal={handleNodeAddModal}
                isEdit={nodeEditModal}
                updateNodeData={updateNodeData}
            />

        </div>
    )
}

export default UsersNodeSetup