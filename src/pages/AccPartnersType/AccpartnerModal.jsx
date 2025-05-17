/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, } from 'reactstrap'
import Flatpickr from "react-flatpickr";
import axios from 'axios';
import { UserID } from '../UserList/UserCol';
import { Post } from '../../utils/https';



const AccpartnerModal = ({ handleModal, show, isEdit, updatePartnertData }) => {

    const [partnerData, setpartnerData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const userID = JSON.parse(localStorage.getItem('userID'));



    const handleInputField = (event) => {
        const { name, value } = event.target
        setpartnerData({ ...partnerData, [name]: value })
    };

    const handleSelectChange = (selectOption) => {
        setpartnerData({ ...partnerData, rStatus: selectOption.target.value })
    };


    const handleSubmitButton = async () => {
        // console.log(partnerData)
        setLoading(true)
        try {
            await Post('/api/v1/PartnerManagement/InsertAccPartnerAcc', { data: partnerData })
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
        // console.log(partnerData)
        setLoading(true)
        try {
            await Post('/api/v1/PartnerManagement/UpdateAccPartnerAcc', { data: partnerData })
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


    useEffect(() => {
        if (isEdit && updatePartnertData) {
            setpartnerData({
                id: updatePartnertData?.id,
                contractType: updatePartnertData?.contractType,
                rStatus: updatePartnertData?.rStatus,
                lastUpdateDate: updatePartnertData?.lastUpdateDate || new Date(),
                lastUpdateUserId: userID
            })
        } else {
            setpartnerData({
                contractType: '',
                entryDate: new Date(),
                entryUserId: userID,
                rStatus: 1
            })
        }
        setError('')
    }, [show]);



    return (
        <div className="page-content">
            <Container fluid>
                <Modal
                    isOpen={show}
                    toggle={() => handleModal()}
                    top={true}
                    size="md"
                >
                    <ModalHeader toggle={() => handleModal()}> {isEdit ? 'Edit Partner Type' : 'Add Partner Type'}</ModalHeader>
                    <ModalBody>
                        <Row>

                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Partner Type Name
                                    </Label>
                                    <Input
                                        name='contractType'
                                        type="text"
                                        placeholder="partner Type Name"
                                        onChange={handleInputField}
                                        value={partnerData?.contractType || ''}
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
                                        onChange={(e, date) => setpartnerData({
                                            ...partnerData,
                                            [isEdit ? 'lastUpdateDate' : 'entryDate']: date
                                        })}
                                        onClose={(e, date) => setpartnerData({
                                            ...partnerData,
                                            [isEdit ? 'lastUpdateDate' : 'entryDate']: date
                                        })}

                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={isEdit ? partnerData?.lastUpdateDate : partnerData?.entryDate}
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
                                            name="rstatus"
                                            value={partnerData?.rStatus}
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
                            disabled={loading}
                            onClick={isEdit ? handleUpdateData : handleSubmitButton}

                        >
                            {isEdit ? 'Update Partner Type' : 'Add Partner Type'}
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

export default AccpartnerModal