import React, { useEffect, useState } from 'react'
import { Button, CardTitle, Col, Input, Label, Modal, ModalBody, Row } from 'reactstrap'
import { Post } from '../../../utils/https'

const UomModal = ({ show, handleModal, isEdit, updateData }) => {

    const [uomData, setUomData] = useState({
        uomCode: '',
        uomDesc: ''
    })
    const [error, setError] = useState()

    const handleInputValue = (e) => {
        const { name, value } = e.target
        setUomData({ ...uomData, [name]: value })
    }

    const updateUomdata = async () => {
        const data = { data: uomData }
        try {
            const response = await Post('/api/Product/UpdateUOM', data)
                .then(res => {
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        handleModal()
                        setUomData({
                            uomCode: '',
                            uomDesc: '',
                        })
                    }

                })
        } catch (err) {
            console.log(err)
        }
    }

    const addUomdata = async () => {
        const data = { data: uomData }
        try {
            const response = await Post('/api/Product/InsertUOM', data)
                .then(res => {
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        handleModal()
                        setUomData({
                            uomCode: '',
                            uomDesc: '',
                        })
                    }

                })
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        if (isEdit) {
            setUomData({
                id: updateData.id,
                uomCode: updateData.uomCode,
                uomDesc: updateData.uomDesc
            })
        } else {
            setUomData({
                uomCode: '',
                uomDesc: '',
            })
        }
        setError('')
    }, [isEdit, updateData, show])


    return (
        <Modal isOpen={show} toggle={() => handleModal()} top={true}>
            <div className="modal-content">
                <ModalBody className="px-4 py-5">
                    <button type="button" onClick={() => handleModal()} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    <CardTitle className="mb-4" tag="h1" >{isEdit ? 'Edit UOM' : 'Add UOM'}</CardTitle>
                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    UOM Code
                                </Label>

                                <Input
                                    name='uomCode'
                                    type="text"
                                    placeholder='Enter Uom Code'
                                    onChange={handleInputValue}
                                    value={uomData?.uomCode}
                                // disabled
                                />
                            </div>
                        </Col>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    UOM Description
                                </Label>

                                <Input
                                    name='uomDesc'
                                    type="text"
                                    placeholder='Enter Store Description'
                                    onChange={handleInputValue}
                                    value={uomData?.uomDesc}
                                // disabled
                                />
                            </div>
                        </Col>

                        {/* 
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
                                    name="status"
                                // value={storeData?.status}
                                // onChange={handleInputValue}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </Col>
                        } */}

                    </Row>

                    {
                        error &&
                        <p className="text-danger mt-3 fs-5">{error}</p>
                    }

                    <div className="text-right mt-md-3">
                        <Button
                            type="button"
                            color="success"
                            onClick={isEdit ? updateUomdata : addUomdata}
                        >
                            {isEdit ? 'Update Uom' : 'Add Uom'}
                        </Button>
                    </div>
                </ModalBody>
            </div >
        </Modal >
    )
}

export default UomModal