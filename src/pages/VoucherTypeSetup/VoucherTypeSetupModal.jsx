/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, } from 'reactstrap'
import Flatpickr from "react-flatpickr";
import axios from 'axios';
import { Post } from '../../utils/https';



const VoucherTypeSetupModal = ({ handleModal, show, isEdit, updateVoucherTypeData }) => {

    const [voucherTypeData, setVoucherType] = useState({});

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const userID = JSON.parse(localStorage.getItem('userID'))


    const handleInputField = (event) => {
        const { name, value } = event.target
        setVoucherType({ ...voucherTypeData, [name]: value })
    };

    const handleSelectChange = (selectOption) => {
        setVoucherType({ ...voucherTypeData, activeStatus: selectOption.target.value })
    };


    const handleSubmitButton = async () => {

        setLoading(true)
        try {
            await Post('/api/v1/VoucherType/InsertVoucherTypeSetup', { data: voucherTypeData })
                .then(res => {
                    if (res.data.success === true) {
                        handleModal();
                    } else {
                        setError(res.data.errorMessage)
                    }
                })
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    };


    const handleUpdateData = async () => {
        // console.log(voucherTypeData)
        setLoading(true)
        try {
            await Post('/api/v1/VoucherType/UpdateVoucherTypeSetup', { data: voucherTypeData }).then(res => {
                if (res.data.success === true) {
                    handleModal();
                } else {
                    setError(res.data.errorMessage)
                }
            })
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    };


    useEffect(() => {
        if (isEdit && updateVoucherTypeData) {
            setVoucherType({
                id: updateVoucherTypeData?.id,
                jrnType: updateVoucherTypeData?.jrnType,
                jrnDescription: updateVoucherTypeData?.jrnDescription,
                lastUpdateDate: updateVoucherTypeData?.lastUpdateDate || new Date(),
                activeStatus: updateVoucherTypeData?.activeStatus,
                lastUpdateUserID: userID,
            })
        } else {
            setVoucherType({
                jrnType: "",
                jrnDescription: "",
                activeStatus: 1,
                entryDate: new Date(),
                entryUserID: userID,
            })
        }
        setError('')
    }, [show]);

    console.log(voucherTypeData?.lastUpdateDate)
    console.log(voucherTypeData?.entryDate)

    return (
        <div className="page-content">
            <Container fluid>
                <Modal
                    isOpen={show}
                    toggle={() => handleModal()}
                    top={true}
                    size="md"
                >
                    <ModalHeader toggle={() => handleModal()}> {isEdit ? 'Edit Voucher Type' : 'Add Voucher Type'}</ModalHeader>
                    <ModalBody>
                        <Row>

                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Journal Type
                                    </Label>
                                    <Input
                                        name='jrnType'
                                        type="text"
                                        placeholder="Journal type"
                                        onChange={handleInputField}
                                        value={voucherTypeData?.jrnType || ''}
                                    />
                                </div>
                            </Col>

                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Journal Name
                                    </Label>
                                    <Input
                                        name='jrnDescription'
                                        type="text"
                                        placeholder="Journal name"
                                        onChange={handleInputField}
                                        value={voucherTypeData?.jrnDescription || ''}
                                    />
                                </div>
                            </Col>

                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        {isEdit ? 'Last  Update Date' : 'Entry Date'}
                                    </Label>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/YYYY"
                                        options={{
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name={isEdit ? 'lastUpdateDate' : 'entryDate'}
                                        // onChange={(e, date) => setVoucherType({ ...voucherTypeData, entryDate: date })}
                                        onChange={(e, date) => setVoucherType({
                                            ...voucherTypeData,
                                            [isEdit ? 'lastUpdateDate' : 'entryDate']: date
                                        })}
                                        onClose={(e, date) => setVoucherType({
                                            ...voucherTypeData,
                                            [isEdit ? 'lastUpdateDate' : 'entryDate']: date
                                        })}

                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={isEdit ? voucherTypeData?.lastUpdateDate : voucherTypeData?.entryDate}
                                    />
                                </div>
                            </Col>
                            {
                                isEdit &&
                                <Col className="col-12">
                                    <div className="mb-3">
                                        <Label className="form-label">
                                            Active Status
                                        </Label>
                                        <select
                                            className="form-select"
                                            name="activeStatus"
                                            value={voucherTypeData?.activeStatus}
                                            onChange={handleSelectChange}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>

                                    </div>
                                </Col>
                            }

                        </Row>
                        {
                            error &&
                            <p className="text-danger mt-3 fs-5">{error}</p>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="button"
                            // color={isEdit ? 'primary' : 'success'}
                            color='success'
                            onClick={isEdit ? handleUpdateData : handleSubmitButton}
                            disabled={loading}

                        >
                            {isEdit ? 'Update Voucher Type' : 'Add Voucher Type'}
                            {loading && <Spinner size="sm" color="light" />}
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

export default VoucherTypeSetupModal