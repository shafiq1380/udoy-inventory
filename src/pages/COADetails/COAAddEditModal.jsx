/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, } from 'reactstrap'
import Select from 'react-select'


const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'white',
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'white',
    }),
};


const COAAddEditModal = ({ handleModal, show, isEdit, updateCoaData }) => {

    const [coaData, setCoaData] = useState({});

    const handleInputField = (event) => {
        const { name, value } = event.target
        setCoaData({ ...coaData, [name]: value })
    };

    useEffect(() => {
        if (isEdit && updateCoaData) {
            setCoaData({
                sn: updateCoaData?.sn,
                title: updateCoaData?.title,
                trnType: updateCoaData?.trnType,
                remarks: updateCoaData?.remarks,
            })
        } else {
            setCoaData({
                sn: '',
                title: '',
                trnType: '',
                remarks: '',
            })
        }
    }, [show]);

    const handleSelectChange = (selectOption) => {
        setCoaData({ ...coaData, trnType: selectOption.value })
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Modal
                    isOpen={show}
                    toggle={() => handleModal()}
                    top={true}
                    size="md"
                >
                    <ModalHeader toggle={() => handleModal()}> {isEdit ? 'COA Edit' : 'COA Add'}</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        S/N
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="S/N"
                                        name='sn'
                                        onChange={handleInputField}
                                        value={coaData?.sn || ''}
                                    />
                                </div>
                            </Col>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Title
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        name='title'
                                        onChange={handleInputField}
                                        value={coaData?.title || ''}
                                    />
                                </div>
                            </Col>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        TrnType
                                    </Label>
                                    <Select
                                        styles={customStyles}
                                        className="react-select"
                                        options={[
                                            { value: 'D-C', label: 'D-C' },
                                            { value: 'C-D', label: 'C-D' },
                                            { value: '(D-C) + VE', label: '(D-C) + VE' },
                                            { value: 'D Only', label: 'D Only' },
                                            { value: 'C Only', label: 'C Only' },
                                            { value: 'D If positive Only', label: 'D If positive Only' },
                                            { value: 'C If positive Only', label: 'C If positive Only' },
                                        ]}
                                        name='trnType'
                                        onChange={handleSelectChange}
                                        value={coaData?.trnType || ''}
                                    />
                                </div>
                            </Col>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Remarks
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Remarks"
                                        name='remarks'
                                        onChange={handleInputField}
                                        value={coaData?.remarks || ''}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="button"
                            color={isEdit ? 'primary' : 'success'}
                        >
                            {isEdit ? 'COA Edit' : 'COA Add'}
                        </Button>
                        <Button type="button" color="danger" onClick={() => handleModal()}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    )
}

export default COAAddEditModal