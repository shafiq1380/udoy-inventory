import React, { useEffect, useState } from 'react'
import { Button, CardTitle, Col, Input, Label, Modal, ModalBody, Row } from 'reactstrap'
import StoreCheckBox from './StoreCheckBox'
import { Post } from '../../../../utils/https'

const StoreItemModal = ({ show, handleModal, isEdit, updateData }) => {

    const [storeData, setStoreData] = useState({
        "storeCode": "",
        "storeDescription": "",
        "isMrrOpen": 0,
        "isIssueOpen": 0,
        "isFinnProductOpen": 0,
        "isSalesOpen": 0,
        "isTransitOpen": 0,
        "status": 1
    })

    const [error, setError] = useState()

    //get the input value 
    const handleInputValue = (e) => {
        const { name, value, checked } = e.target
        if (name === 'isMrrOpen') {
            setStoreData({ ...storeData, [name]: checked ? 1 : 0 })
        } else if (name === 'isIssueOpen') {
            setStoreData({ ...storeData, [name]: checked ? 1 : 0 })
        } else if (name === 'isFinnProductOpen') {
            setStoreData({ ...storeData, [name]: checked ? 1 : 0 })
        } else if (name === 'isSalesOpen') {
            setStoreData({ ...storeData, [name]: checked ? 1 : 0 })
        } else if (name === 'isTransitOpen') {
            setStoreData({ ...storeData, [name]: checked ? 1 : 0 })
        } else {
            setStoreData({ ...storeData, [name]: value })
        }
    }

    const submitStoredata = async () => {
        const data = { data: storeData }
        try {
            const response = await Post('/api/v1/Product/InsertStore', data)
                .then(res => {
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        handleModal()
                        setStoreData({
                            "storeCode": "",
                            "storeDescription": "",
                            "isMrrOpen": 0,
                            "isIssueOpen": 0,
                            "isFinnProductOpen": 0,
                            "isSalesOpen": 0,
                            "isTransitOpen": 0,
                            "status": 1
                        })
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    const updateStoredata = async () => {
        const data = { data: storeData }
        try {
            const response = await Post('/api/v1/Product/UpdateStore', data)
                .then(res => {
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        handleModal()
                        setStoreData({
                            "storeCode": "",
                            "storeDescription": "",
                            "isMrrOpen": 0,
                            "isIssueOpen": 0,
                            "isFinnProductOpen": 0,
                            "isSalesOpen": 0,
                            "isTransitOpen": 0,
                            "status": 1
                        })
                    }

                })
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        if (isEdit) {
            setStoreData({
                "id": updateData?.id,
                "storeCode": updateData?.storeCode,
                "storeDescription": updateData?.storeDescription,
                "isMrrOpen": updateData?.isMrrOpen,
                "isIssueOpen": updateData?.isIssueOpen,
                "isFinnProductOpen": updateData?.isFinnProductOpen,
                "isSalesOpen": updateData?.isSalesOpen,
                "isTransitOpen": updateData?.isTransitOpen,
                "status": updateData?.status
            })
        } else {
            setStoreData({
                "storeCode": "",
                "storeDescription": "",
                "isMrrOpen": 0,
                "isIssueOpen": 0,
                "isFinnProductOpen": 0,
                "isSalesOpen": 0,
                "isTransitOpen": 0,
                "status": 1
            })
        }
        setError('')
    }, [isEdit, updateData, show])


    return (
        <Modal isOpen={show} toggle={() => handleModal()} top={true}>
            <div className="modal-content">
                <ModalBody className="px-4 py-5">
                    <button type="button" onClick={() => handleModal()} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    <CardTitle className="mb-4" tag="h1" >{isEdit ? 'Edit Store' : 'Add Store'}</CardTitle>
                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    Store Name
                                </Label>

                                <Input
                                    name='storeCode'
                                    type="text"
                                    placeholder='Enter Store Name'
                                    onChange={handleInputValue}
                                    value={storeData?.storeCode}
                                // disabled
                                />
                            </div>
                        </Col>


                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    Store Description
                                </Label>
                                <Input
                                    name='storeDescription'
                                    type="text"
                                    placeholder='Enter Store Description'
                                    onChange={handleInputValue}
                                    value={storeData?.storeDescription}
                                />
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
                                    name="status"
                                    value={storeData?.status}
                                    onChange={handleInputValue}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </Col>
                        }

                        <Col className='col-12 row'>
                            <StoreCheckBox title={'Is MRR'}
                                name='isMrrOpen' handleCheckBox={handleInputValue}
                                value={storeData?.isMrrOpen}
                            />
                            <StoreCheckBox title={'Is Issue'}
                                name='isIssueOpen' handleCheckBox={handleInputValue}
                                value={storeData?.isIssueOpen}
                            />
                            <StoreCheckBox title={'Is Finish Product'}
                                name='isFinnProductOpen' handleCheckBox={handleInputValue}
                                value={storeData?.isFinnProductOpen}
                            />
                            <StoreCheckBox title={'Is Sales'}
                                name='isSalesOpen' handleCheckBox={handleInputValue}
                                value={storeData?.isSalesOpen}
                            />
                            <StoreCheckBox title={'Is TransitOpen'}
                                name='isTransitOpen' handleCheckBox={handleInputValue}
                                value={storeData?.isTransitOpen}
                            />
                        </Col>

                    </Row>

                    {
                        error &&
                        <p className="text-danger mt-3 fs-5">{error}</p>
                    }

                    <div className="text-right mt-md-3">
                        <Button
                            type="button"
                            color="success"
                            onClick={isEdit ? updateStoredata : submitStoredata}
                        >
                            {isEdit ? 'Update' : 'Add Store'}
                        </Button>
                    </div>
                </ModalBody>
            </div >
        </Modal >
    )
}

export default StoreItemModal