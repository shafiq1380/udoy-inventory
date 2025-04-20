/* eslint-disable react/prop-types */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, } from 'reactstrap'
import { authorization } from '../../components/Common/Authorization';
import { Post } from '../../utils/https';


const UsersAddEditModal = ({ handleModal, show, isEdit, updateNodeData }) => {

    const [nodeData, setNodeData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const handleInputField = (event) => {
        const { name, value } = event.target
        if (name == "nodeTypeID") {
            if ((value.match(/\./g) || []).length > 1) {
                return;
            }
            const numericValue = value.replace(/[^0-9.]/g, '');
            setNodeData({ ...nodeData, [name]: numericValue })
        } else if (name == "nodeOrder") {
            if ((value.match(/\./g) || []).length > 1) {
                return;
            }
            const numericValue = value.replace(/[^0-9.]/g, '');
            setNodeData({ ...nodeData, [name]: numericValue })
        }

        else {
            setNodeData({ ...nodeData, [name]: value })
        }
    };


    const handleCreateNode = async () => {
        setLoading(true)
        try {
            await Post('/api/UserManagement/InsertNodeList', { data: nodeData })
                .then(res => {
                    if (res.data.success === true) {
                        handleModal()

                    } else {
                        setError(res.data.errorMessage)
                    }
                })
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const updateNodeNode = async () => {
        setLoading(true)
        try {
            await Post('/api/UserManagement/UpdateNodeList', { data: nodeData })
                .then(res => {
                    if (res.data.success === true) {
                        handleModal()
                    } else {
                        setError(res.data.errorMessage)
                    }
                })
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    // console.log(nodeData)

    useEffect(() => {
        if (isEdit && updateNodeData) {
            setNodeData({
                nodeId: updateNodeData?.nodeID,
                moduleName: updateNodeData?.moduleName,
                nodeTypeID: updateNodeData?.nodeTypeID,
                nodeDescription: updateNodeData?.nodeDescription,
                nodeOrder: updateNodeData?.nodeOrder,
                nodeName: updateNodeData?.nodeName,
                nodeTypeName: updateNodeData?.nodeTypeName,
            })
        } else {
            setNodeData({
                nodeID: 0,
                moduleName: '',
                nodeTypeID: 0,
                nodeTypeName: '',
                nodeOrder: '',
                nodeName: '',
                nodeDescription: '',
            })
        }
        setError('')
    }, [show, isEdit]);


    useEffect(() => {
        authorization(47)
    }, [])

    // console.log(nodeData)

    return (
        <div className="page-content">
            <Container fluid>
                <Modal
                    isOpen={show}
                    toggle={() => handleModal()}
                    top={true}
                    size="md"
                >
                    <ModalHeader toggle={() => handleModal()}> {isEdit ? 'Edit Node' : 'Create Node'}</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Module Name
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Module Name"
                                        name='moduleName'
                                        onChange={handleInputField}
                                        value={nodeData?.moduleName || ''}
                                    />
                                </div>
                            </Col>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Node Type ID
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Node Type ID"
                                        name='nodeTypeID'
                                        onChange={handleInputField}
                                        value={nodeData?.nodeTypeID || ''}
                                    />
                                </div>
                            </Col>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Node Type Name
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Node Type Name"
                                        name='nodeTypeName'
                                        onChange={handleInputField}
                                        value={nodeData?.nodeTypeName || ''}
                                    />
                                </div>
                            </Col>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Node Order
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Node Order"
                                        name='nodeOrder'
                                        onChange={handleInputField}
                                        value={nodeData?.nodeOrder || ''}
                                    />
                                </div>
                            </Col>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Node Name
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Node Name"
                                        name='nodeName'
                                        onChange={handleInputField}
                                        value={nodeData?.nodeName || ''}
                                    />
                                </div>
                            </Col>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Node Description
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Node Description"
                                        name='nodeDescription'
                                        onChange={handleInputField}
                                        value={nodeData?.nodeDescription || ''}
                                    />
                                </div>
                            </Col>
                        </Row>

                        {
                            error &&
                            <p className="text-danger mt-3 fs-5">{error}</p>
                        }

                    </ModalBody>
                    <ModalFooter>

                        <Button type="button" color="danger" onClick={() => handleModal()}>
                            Close
                        </Button>
                        <Button
                            type="button"
                            color={'success'}
                            onClick={isEdit ? updateNodeNode : handleCreateNode}
                            disabled={loading}
                        >
                            {isEdit ? 'Update Node' : 'Create Node'}
                            {loading && <Spinner size="sm" color="light" />}
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    )
}

export default UsersAddEditModal