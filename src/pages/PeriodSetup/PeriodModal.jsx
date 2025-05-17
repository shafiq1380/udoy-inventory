/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, } from 'reactstrap'
import Flatpickr from "react-flatpickr";
import axios from 'axios';
import { Post } from '../../utils/https';



const PeriodModal = ({ handleModal, show, isEdit, updatePeriodData }) => {

    const [periodData, setPeriodData] = useState({
        prdStartDate: '',
        prdEndDate: "",
        prdTitle: "",
        prdStatus: 1
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)


    const handleInputField = (event) => {
        const { name, value } = event.target
        setPeriodData({ ...periodData, [name]: value })
    };

    const handleSelectChange = (selectOption) => {
        setPeriodData({ ...periodData, prdStatus: Number(selectOption.target.value) })
    };

    // console.log(updatePeriodData)


    const handleSubmitButton = async () => {
        setLoading(true)
        try {
            await Post('/api/v1/VoucherEntry/InsertPeriodList', { data: periodData })
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
        // console.log(periodData)
        setLoading(true)
        try {
            await Post('/api/v1/VoucherEntry/UpdatePeriod', { data: periodData })
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
        if (isEdit && updatePeriodData) {
            setPeriodData({
                id: updatePeriodData?.id,
                prdStartDate: updatePeriodData?.prdStartDate,
                prdEndDate: updatePeriodData?.prdEndDate,
                prdTitle: updatePeriodData?.prdTitle,
                prdStatus: updatePeriodData?.prdStatus,
            })
        } else {
            setPeriodData({
                prdStartDate: '',
                prdEndDate: "",
                prdTitle: "",
                prdStatus: 1
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
                    <ModalHeader toggle={() => handleModal()}> {isEdit ? 'Edit Period' : 'Add Period'}</ModalHeader>
                    <ModalBody>
                        <Row>

                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Period Name
                                    </Label>
                                    <Input
                                        name='prdTitle'
                                        type="text"
                                        placeholder="Period Name"
                                        onChange={handleInputField}
                                        value={periodData?.prdTitle || ''}
                                    />
                                </div>
                            </Col>

                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Start Date
                                    </Label>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        options={{
                                            // dateFormat: "d/m/Y",
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name="prdStartDate"
                                        onChange={(e, date) => setPeriodData({ ...periodData, prdStartDate: date })}
                                        onClose={(e, date) => setPeriodData({ ...periodData, prdStartDate: date })}
                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={periodData?.prdStartDate || ''}
                                    />
                                </div>
                            </Col>
                            <Col className="col-12">
                                <div className="mb-3">
                                    <Label className="form-label">
                                        End Date
                                    </Label>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        options={{
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name="prdEndDate"
                                        onChange={(e, date) => setPeriodData({ ...periodData, prdEndDate: date })}
                                        onClose={(e, date) => setPeriodData({ ...periodData, prdEndDate: date })}
                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={periodData?.prdEndDate || ''}
                                    />
                                </div>
                            </Col>

                            {
                                isEdit &&
                                <Col className="col-12">
                                    <div className="mb-3">
                                        <Label className="form-label">
                                            Open Status
                                        </Label>
                                        <select
                                            className="form-select"
                                            name="prdStatus"
                                            value={periodData?.prdStatus}
                                            onChange={handleSelectChange}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={2}>Inactive</option>
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
                            {isEdit ? 'Update Period' : 'Add Period'}
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

export default PeriodModal