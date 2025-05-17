import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, } from 'reactstrap'
import { Post } from '../../../utils/https'

const PayCodeModal = ({ handleModal, show, isEdit, updateData }) => {

    const [payCodeData, setPayCodeData] = useState({})
    const [error, setErronr] = useState('')
    const [loading, setLoading] = useState(false)

    const userID = JSON.parse(localStorage.getItem('userID'))

    const handleInputField = (event) => {
        const { name, value } = event.target
        if (name === 'sl') {
            setPayCodeData({ ...payCodeData, [name]: parseInt(value) })
        } else {
            setPayCodeData({ ...payCodeData, [name]: value })
        }
    }


    //handle Added subgroup
    const handleSubmitButton = async () => {
        setLoading(true)
        const data = { ...payCodeData, empTypeID: 0 }
        try {
            await Post('/api/v1/Payroll/CreateSalaryForCode', { data: data })
                .then(res => {
                    if (res?.data?.errorMessage) {
                        setLoading(false)
                        setErronr(res?.data?.errorMessage)
                    } else {
                        setErronr('')
                        handleModal()
                        setPayCodeData({})
                        setLoading(false)
                    }
                })
        } catch (error) {
            console.log('Error', error)
        }
    }



    //handle update subgroup
    const handleUpdateData = async () => {
        setLoading(true)

        // console.log(payCodeData)

        try {
            await Post('/api/v1/Payroll/UpdateSalaryForCode', { data: payCodeData })
                .then(res => {
                    if (res?.data?.errorMessage) {
                        setLoading(false)
                        setErronr(res?.data?.errorMessage)
                    } else {
                        setLoading(false)
                        setErronr('')
                        handleModal()
                        setPayCodeData({})
                    }
                })
        } catch (error) {
            console.log('Error', error)
        }
    }



    useEffect(() => {
        if (isEdit && updateData) {
            setPayCodeData(updateData)
        } else {
            setPayCodeData({
                id: 0,
                sl: '',
                coaCode: "",
                subCode: "",
                forType: "C",
                forCode: "",
                forDesc: "",
                forStatus: 1,
                isOpening: 1
            })
        }
        setErronr('')
        setLoading(false)
    }, [show])


    return (
        <Modal isOpen={show} toggle={() => handleModal()} top={true}>
            <div className="modal-content">
                <ModalHeader toggle={handleModal}>
                    {isEdit ? 'Edit Pay Code' : 'Add Pay Code'}
                </ModalHeader>

                <ModalBody className="px-4">
                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    SL
                                </Label>

                                <Input
                                    name='sl'
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    placeholder='Enter Serial No'
                                    onChange={handleInputField}
                                    value={payCodeData?.sl || ''}
                                />
                            </div>
                        </Col>

                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    For  Code
                                </Label>
                                <Input
                                    name='forCode'
                                    type="text"
                                    placeholder='Enter for Code'
                                    onChange={handleInputField}
                                    value={payCodeData?.forCode || ''}
                                />
                            </div>
                        </Col>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    For Type
                                </Label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='activeStatus'
                                    name="forType"
                                    value={payCodeData?.forType || ''}
                                    onChange={handleInputField}
                                >
                                    <option value={"C"}>C</option>
                                    <option value={'D'}>D</option>
                                </select>
                            </div>
                        </Col>

                        {
                            isEdit &&
                            <Col className="col-12 mb-3">
                                <Label className="activeStatus">
                                    Active Status
                                </Label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='activeStatus'
                                    name="forStatus"
                                    value={payCodeData?.forStatus || ''}
                                    onChange={handleInputField}
                                >
                                    <option value={0}>Inactive</option>
                                    <option value={1}>Active</option>
                                </select>
                            </Col>
                        }

                    </Row>

                    <Col className="col-12 mb-3">
                        <Label className="opening">
                            Is Opening
                        </Label>
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            name="isOpening"
                            value={payCodeData?.isOpening || ''}
                            onChange={handleInputField}
                        >
                            <option value={0}>Close</option>
                            <option value={1}>Open</option>
                        </select>
                    </Col>

                    {
                        error &&
                        <p className="text-danger fs-4">{error}</p>
                    }

                </ModalBody>

                <ModalFooter>

                    <div className="text-end">
                        <Button
                            type="button"
                            color="danger"
                            onClick={handleModal}
                        >
                            Close
                        </Button>
                    </div>

                    <div className="text-end">
                        <Button
                            type="button"
                            color="success"
                            className='px-5'
                            onClick={isEdit ? handleUpdateData : handleSubmitButton}
                            disabled={loading || payCodeData?.forCode === '' || payCodeData?.sl === ''}
                        >
                            {loading ?
                                <Spinner color='light' size='sm' />
                                :
                                <>{isEdit ? 'Update' : 'Add Pay Code'}</>}
                        </Button>
                    </div>
                </ModalFooter>
            </div >
        </Modal >
    )
}

export default PayCodeModal